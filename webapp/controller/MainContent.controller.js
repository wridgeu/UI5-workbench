sap.ui.define(["com/mrb/workbench/controller/BaseController"], function (
  BaseController
) {
  "use strict";

  return BaseController.extend("com.mrb.workbench.controller.MainContent", {
    onInit: function () {
      this._workbenchStorage = this.getOwnerComponent().getStorageInstance();
      this._codeEditor = this.byId("aCodeEditor");
      this._languSelect = this.byId("aLanguageSelector");
      this._themeSelect = this.byId("aThemeSelector");
      this._storageKey = "_temp";
      this._saveDialog = sap.ui.xmlfragment(
        "com.mrb.workbench.view.SaveDialog",
        this
      );
      this.getView().addDependent(this._saveDialog);
      //manual initialization
      this._initViewValues();
    },
    onThemeSelection: function (oEvt) {
      var boundItemValues = oEvt
        .getParameters()
        .selectedItem.getBindingContext()
        .getProperty();
      this._codeEditor.setColorTheme(boundItemValues.name);
    },
    onLanguageSelection: function (oEvt) {
      var boundItemValues = oEvt
        .getParameters()
        .selectedItem.getBindingContext()
        .getProperty();
      this._codeEditor.setType(boundItemValues.value);
    },
    onPrettyPrint: function () {
      this._codeEditor.prettyPrint();
    },
    onClearSaves: function () {
      this._workbenchStorage.removeAll("");
    },
    onListItemPress: function (oEvt) {
      // eslint-disable-next-line no-warning-comments
      this._loadChangeFromStorage(oEvt.getParameters().listItem.getText());
    },
    onSave: function (oEvt) {
      this._saveChangeToStorage(oEvt);
    },
    onChange: function (oEvt) {
      this._saveChangeToStorage(oEvt);
    },
    onSaveDialogSave: function () {
      var sInputText = sap.ui.getCore().byId("saveDlgInput").getValue();
      var saveObject = {
        saves: [
          {
            name: sInputText,
            syntax: this._languSelect.getSelectedKey(),
            content: this._codeEditor.getCurrentValue(),
          },
        ],
      };

      if (!sInputText || !saveObject.saves[0].content) {
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
          MessageToast.show("Filename or File itself can't be empty!");
        });
        return this._saveDialog.close();
      }

      this._workbenchStorage.put(sInputText, JSON.stringify(saveObject));
      this._updateListBinding(saveObject);
      this._codeEditor.setValue("");
      this._saveDialog.close();
    },
    onSaveDialogCancel: function () {
      this._saveDialog.close();
    },
    _updateListBinding: function (savedObject) {
      //check if there is a binding
      if (
        !this.byId("localStorageOverview")
          .getModel("savedObjects")
          .getProperty("/saves")
      ) {
        this.byId("localStorageOverview")
          .getModel("savedObjects")
          .setData(savedObject);
        return;
      }
      //check if the same name already exists
      //TODO: change to normal callback to match ES5 code-style
      //instead of arrow-functions as I'm not using babel atm.
      if (
        this.byId("localStorageOverview")
          .getModel("savedObjects")
          .getProperty("/saves")
          .some((el) => el.name === savedObject.saves[0].name)
      ) {
        return;
      }
      this.byId("localStorageOverview")
        .getModel("savedObjects")
        .getProperty("/saves")
        .push(savedObject.saves[0]);
      this.byId("localStorageOverview").getBinding("items").refresh();
    },
    _saveChangeToStorage: function (oEvt) {
      if (this._workbenchStorage.isSupported()) {
        var ceContent = this._codeEditor.getCurrentValue();
        if (this._storageKey && oEvt.sId === "press" && ceContent) {
          this._saveDialog.open();
        } else if (oEvt.sId === "change" || oEvt.sId === "liveChange") {
          /* Save current string to LocalStorage on Change */
          this._workbenchStorage.put(this._storageKey, ceContent);
        }
      } else {
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
          MessageToast.show("No support for Local Storage API");
        });
      }
    },
    _loadChangeFromStorage: function (saveName) {
      var storageValue = this._workbenchStorage.get(saveName);
      var saveArray = JSON.parse(storageValue).saves;
      this._codeEditor.setValue(saveArray[0].content);
    },
    _initViewValues: function () {
      this._codeEditor.setType("abap");
      this._languSelect.setSelectedKey("abap");
      this._themeSelect.setSelectedKey("default");
      if (this._workbenchStorage.get("_temp")) {
        this._codeEditor.setValue(this._workbenchStorage.get("_temp"));
      }
    },
  });
});
