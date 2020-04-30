sap.ui.define(["com/mrb/workbench/controller/BaseController"], function (
  BaseController
) {
  "use strict";

  return BaseController.extend("com.mrb.workbench.controller.MainContent", {
    onInit: function () {
      this._codeEditor = this.byId("aCodeEditor");
      this._languSelect = this.byId("aLanguageSelector");
      this._themeSelect = this.byId("aThemeSelector");
      this._workbenchStorage = window.localStorage;
      this._storageKey = "_temp";

      //manual initialization
      this._codeEditor.setType("abap");
      this._languSelect.setSelectedKey("abap");
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
      this._codeEditor.setValue("");
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
          /* Save current string to LocalStorage on SaveIcon */
          this._storageKey = window.prompt();
          this._workbenchStorage.setItem(this._storageKey, ceContent);
          this._storageKey = "_temp";
        } else if (ceContent && oEvt.sId === "change") {
          /* Save current string to LocalStorage on Change */
          this._workbenchStorage.setItem(this._storageKey, ceContent);
        }
      } else {
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
          MessageToast.show("No support for Local Storage API");
        });
      }
    },
  });
});
