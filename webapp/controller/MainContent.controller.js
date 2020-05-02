sap.ui.define(
  ["com/mrb/workbench/controller/BaseController", "sap/ui/util/Storage", "sap/ui/model/json/JSONModel"],
  function (BaseController, UI5Storage, JSONModel) {
    "use strict";

    return BaseController.extend("com.mrb.workbench.controller.MainContent", {
      onInit: function () {
        this._codeEditor = this.byId("aCodeEditor");
        this._languSelect = this.byId("aLanguageSelector");
        this._themeSelect = this.byId("aThemeSelector");
        this._workbenchStorage = new UI5Storage("local", "codeEditor");
        this._storageKey = "_temp";
        this._saveDialog = sap.ui.xmlfragment(
          "com.mrb.workbench.view.SaveDialog",
          this
        );
        this.getView().addDependent(this._saveDialog);
        //manual initialization
        this._codeEditor.setType("abap");
        this._languSelect.setSelectedKey("abap");
        this._themeSelect.setSelectedKey("default");
        if (this._workbenchStorage.get("_temp")) {
          this._codeEditor.setValue(this._workbenchStorage.get("_temp"));
        }
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
      onListItemPress: function () {
        // eslint-disable-next-line no-warning-comments
        // TODO: Implement loading of saved files
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
          "saves": [{
            name: sInputText,
            syntax: this._languSelect.getSelectedKey(),
            content: this._codeEditor.getCurrentValue()}
        ]};
        
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
        //TODO: Update the list of the saved Items here:
        var oJSONModel = new JSONModel(savedObject, false);
        if (!this.byId("localStorageOverview").getModel("savedObjects")) {
          this.byId("localStorageOverview").setModel(oJSONModel, "savedObjects");
          return;
        }
        this.byId("localStorageOverview").getModel("savedObjects").getProperty("/saves").push(savedObject.saves[0]);
        this.byId("localStorageOverview").getBinding("items").refresh();
      },
      _saveChangeToStorage: function ( oEvt) {
        if (this._workbenchStorage.isSupported()) {
          var ceContent = this._codeEditor.getCurrentValue();
          if (this._storageKey && oEvt.sId === "press" && ceContent) {
            this._saveDialog.open();
          } else if (ceContent && oEvt.sId === "change") {
            /* Save current string to LocalStorage on Change */
            this._workbenchStorage.put(this._storageKey, ceContent);
          }
        } else {
          sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
            MessageToast.show("No support for Local Storage API");
          });
        }
      },
    });
  }
);
