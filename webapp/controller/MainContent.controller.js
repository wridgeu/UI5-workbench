sap.ui.define(["com/mrb/workbench/controller/BaseController"], function (
  BaseController
) {
  "use strict";

  return BaseController.extend("com.mrb.workbench.controller.MainContent", {
    onInit: function () {
      this._codeEditor  = this.byId("aCodeEditor");
      this._languSelect = this.byId("aLanguageSelector");
      this._themeSelect = this.byId("aThemeSelector")
      
      //manual initialization - TODO: replace by json binding
      this._codeEditor.setType("abap");
      this._languSelect.setSelectedKey("abap");
    },
    onMenuSaves: function () {
       // TODO: add saving functionality - browser
    },
    onThemeSelection: function(oEvt){
      var boundItemValues = oEvt.getParameters().selectedItem.getBindingContext().getProperty();
      this._codeEditor.setColorTheme(boundItemValues.name);
    },
    onLanguageSelection: function(oEvt){
      var boundItemValues = oEvt.getParameters().selectedItem.getBindingContext().getProperty();
      this._codeEditor.setType(boundItemValues.value)
    },
    _updateListBinding: function(){
      // TODO: dynamically upate the binding of list per menu-button
    },
    onListItemPress: function (oEvt) {
      // TODO: dynamic bind -> CE Type, Theme or ReadSavedItems
    }
  });
});
