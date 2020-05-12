sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "com/mrb/workbench/model/models",
    "com/mrb/workbench/model/utilStorage",
  ],
  function (UIComponent, models, UI5Storage) {
    "use strict";

    return UIComponent.extend("com.mrb.workbench.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);
        // enable routing
        this.getRouter().initialize();
        // set the device model
        this.setModel(models.createDeviceModel(), "device");
        // initialize UI5Storage-Instance for localStorage with prefix 'codeEditor'
        this._workbenchStorage = new UI5Storage("local", "codeEditor");
      },
      //return the initialized storage instance
      getStorageInstance: function () {
        if ("localStorage" in window) {
          return this._workbenchStorage;
        } else {
          throw "No support for Local Storage API";
        }
      },
    });
  }
);
