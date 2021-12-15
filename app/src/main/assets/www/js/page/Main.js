$(document).on('pageinit', "#Main", function (e) {
    e.preventDefault();
    //$(document).off("pageinit", "#Main");
});
$(document).on('pagebeforeshow', "#Main",function () {
      SetRcvIdx("");
       isDone = "A";
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());
});

$(document).on('pageshow', "#Main", function (e) {
    e.preventDefault();

    startPrinterService();//프린터장비 연결 백그라운드 서비스
});




var startPrinterService = function(){
    /**
    프린터장비 연결 백그라운드 서비스
    */
    cordova.plugins.web_call.svcMethod([''],function(ret){
        alert('svcMethod success - ' + ret);
    },function(err){
        //alert('svcMethod error - ' + err);
    });
    //    setTimeout(3000, function(){
    //    });
}