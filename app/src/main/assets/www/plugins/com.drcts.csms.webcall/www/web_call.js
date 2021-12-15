cordova.define("com.drcts.csms.webcall.web_call", function(require, exports, module) {
    var exec = require('cordova/exec');

    /**
    버전체크
    */
    exports.checkMethod = function (arg0, success, error) {
        exec(success, error, 'web_call', 'checkMethod', [arg0]);
    };


    /**
    프린터설정
    */
    exports.setMethod = function (arg0, success, error) {
        exec(success, error, 'web_call', 'setMethod', [arg0]);
    };
    /**
    라벨인쇄
    */
    exports.coolMethod = function (arg0, success, error) {
        exec(success, error, 'web_call', 'coolMethod', [arg0]);
    };

    /**
    프린터장비연결 백그라운드 서비스
    */
    exports.svcMethod = function (arg0, success, error) {
        exec(success, error, 'web_call', 'svcMethod', [arg0]);
    };

});
