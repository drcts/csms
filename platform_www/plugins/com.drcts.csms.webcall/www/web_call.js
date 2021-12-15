cordova.define("com.drcts.csms.webcall.web_call", function(require, exports, module) {
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'web_call', 'coolMethod', [arg0]);
};

});
