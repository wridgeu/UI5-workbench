sap.ui.define(["sap/ui/util/Storage"], function (Storage) {
  //extend prototype with new method
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
