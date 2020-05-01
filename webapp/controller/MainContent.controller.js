sap.ui.define(
  [
    "com/mrb/workbench/controller/BaseController",
    "sap/ui/util/Storage"
  ],
  function (BaseController, UI5Storage) {
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
      onMenuSaves: function () {
        // eslint-disable-next-line no-warning-comments
        // TODO: add saving functionality - browser
      },
      onClearSaves: function () {
        this._workbenchStorage.clear();
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
      _updateListBinding: function () {
        // eslint-disable-next-line no-warning-comments
        // TODO: dynamically update the binding of list per menu-button
      },
      onListItemPress: function () {
        // eslint-disable-next-line no-warning-comments
        // TODO: dynamic bind -> CE Type, Theme or ReadSavedItems
      },
      onSave: function (oEvt) {
        this._saveChangeToLocalStorage(this, oEvt);
      },
      onPrettyPrint: function () {
        this._codeEditor.prettyPrint();
      },
      onChange: function (oEvt) {
        //might need some changes
        this._saveChangeToLocalStorage(this, oEvt);
      },
      _saveChangeToLocalStorage: function (context, oEvt) {
        if (this._workbenchStorage !== undefined) {
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
      onSaveDialogSave: function () {
        var sInputText = sap.ui.getCore().byId("saveDlgInput").getValue();
        var ceContent = this._codeEditor.getCurrentValue();
        if (!sInputText) {
          sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
            MessageToast.show("Filename can't be empty!");
          });
          return this._saveDialog.close();
        }
        this._workbenchStorage.put(sInputText, ceContent);
        this._codeEditor.setValue("");
        this._saveDialog.close();
      },
      onSaveDialogCancel: function () {
        this._saveDialog.close();
      },
    });
  }
);
