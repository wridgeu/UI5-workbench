sap.ui.define([
  "sap/ui/util/Storage"
], function (Storage) {
  //extend prototype with new method
  //as API doesn't offer .extend method:
  //https://sapui5.hana.ondemand.com/#/api/module%3Asap%2Fui%2Futil%2FStorage
  Storage.prototype.getItems = function () {
    var items = {};
    for (var i = 0; i < window.localStorage.length; i++) {
      var itemKey = window.localStorage.key(i),
          itemValue = window.localStorage.getItem(itemKey);
      //enhance object items with props/values
      Object.defineProperty(items, itemKey, {
        value: itemValue,
        enumerable: true,
      });
    }
    return items;
  };
  return Storage;
});
