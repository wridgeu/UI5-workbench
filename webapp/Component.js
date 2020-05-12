sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/mrb/workbench/model/models",
    "sap/ui/util/Storage",
  ],
  function (UIComponent, Device, models, UI5Storage) {
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
        
        //add "read-all"-method to prototype
        UI5Storage.prototype.getItems = function () {
          if (!window.localStorage) throw "No localStorage support for this browser";
          var items = {};
          for (var i = 0; i < window.localStorage.length; i++) {
            var itemKey = window.localStorage.key(i),
              itemValue = window.localStorage.getItem(itemKey);

            Object.defineProperty(items, itemKey, {
              value: itemValue,
              enumerable: true
            });
          }
          return items;
        };
        
        // initialize UI5Storage-Instance for localStorage with prefix 'codeEditor'
        this._workbenchStorage = new UI5Storage("local", "codeEditor");
      },
      /**
       * Returns the initialized storage Instance.
       * @public
       * @returns {sap.ui.util.Storage}
       */
      getStorageInstance: function () {
        return this._workbenchStorage;
      },
    });
  }
);
