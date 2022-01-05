cordova.define("com.drcts.csms.webcall.web_call", function(require, exports, module) {
var exec = require('cordova/exec');

exports.printMethod = function (arg0, success, error) {
    exec(success, error, 'web_call', 'printMethod', [arg0]);
};

});
