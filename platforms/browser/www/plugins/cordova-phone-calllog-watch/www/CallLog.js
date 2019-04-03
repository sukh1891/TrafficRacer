cordova.define("cordova-phone-calllog-watch.CallLog", function(require, exports, module) { function CallLog() {
}

CallLog.prototype.list = function (period, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "CallLog", "list", [period]);
};

CallLog.prototype.contact = function (phoneNumber, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "CallLog", "contact", [phoneNumber]);
};

CallLog.prototype.show = function (phoneNumber, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "CallLog", "show", [phoneNumber]);
};

CallLog.prototype.delete = function (id, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "CallLog", "delete", [id]);
};

CallLog.prototype.insert = function (args, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "CallLog", "insert", args);
};

CallLog.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.callLogWatch = new CallLog();
  return window.callLogWatch;
};

cordova.addConstructor(CallLog.install);

});
