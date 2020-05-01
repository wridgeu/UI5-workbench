sap.ui.define(
  [
    "com/mrb/workbench/controller/BaseController",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/TextArea",
    "sap/m/Button",
    "sap/ui/util/Storage"
  ],
  function (BaseController, Dialog, Label, TextArea, Button, UI5Storage) {
    "use strict";

    return BaseController.extend("com.mrb.workbench.controller.MainContent", {
      onInit: function () {
        this._codeEditor = this.byId("aCodeEditor");
        this._languSelect = this.byId("aLanguageSelector");
        this._themeSelect = this.byId("aThemeSelector");
        this._workbenchStorage = new UI5Storage("local", "codeEditor")
        this._storageKey = "_temp";

        //manual initialization
        this._codeEditor.setType("abap");
        this._languSelect.setSelectedKey("abap");
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
            // this._storageKey = window.prompt();
            // var oDialog = new Dialog({
            //   title: "Save",
            //   type: "Message",
            //   content: [
            //     new Label({
            //       text: "Name your local storage file",
            //       labelFor: "saveDialogTextArea",
            //     }),
            //     new TextArea("saveDialogTextArea", {
            //       width: "100%",
            //       placeholder: "save as ...",
            //     }),
            //   ],
            //   beginButton: new Button({
            //     text: "Save",
            //     press: function () {
            //       var sText = sap.ui
            //         .getCore()
            //         .byId("saveDialogTextArea")
            //         .getValue();
            //       var _storageKey = sText;
            //       window.localStorage.setItem(_storageKey, ceContent);
            //       oDialog.close();
            //     },
            //   }),
            //   endButton: new Button({
            //     text: "Cancel",
            //     press: function () {
            //       oDialog.close();
            //     },
            //   }),
            //   afterClose: function () {
            //     oDialog.destroy();
            //   },
            // });

            // oDialog.open();
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
