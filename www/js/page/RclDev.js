$(document).on('pageinit', "#RclDev",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#RclDev",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("회수장비");

    initRclDev();

    //초기조회
    wsRclDevList(GetRcvIdx());
});

$(document).on('pagehide', "#RclDev",function () {
    $("#RclDev").remove();
});


function initRclDev() {


    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnScan").prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnScan").prop("disabled", false).removeClass("ui-state-disabled");
    }

    $("#btnRclDev").click(function(){
            PageNonChange("ReqCtnt.html");
    });

}



var fn_scan = function(){

   cordova.plugins.barcodeScanner.scan(
      function (result) {
        var SN = result.text;
        var FMT = result.format;
        var CAN = result.cancelled;

        // 1.회수장비 웹서비스 저장
        wsRclDevFile(GetRcvIdx(), SN, function(){

            // 2.사진목록 리스트 재조회
            wsRclDevList(GetRcvIdx());
        });

        /*
                var list = $("#list_barcode");
                var rslt = $("<li data-icon='delete' id='{0}'><a href='#'  onclick='delDev({0});'>{0}</a></li>".format(SN));
                list.append(rslt).trigger("create");;
                $("#list_barcode").listview( "refresh" );
        */

      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}



var delDev = function(rtnIdx, PROD_NM){

     if(isDone == "B"){
        return;
    }

    if(confirm("회수장비를 삭제하시겠습니까?")) {
        //장비삭제
        wsDelDev(rtnIdx, function(){
            //재조회
            wsRclDevList(GetRcvIdx());
        });
    }
};








/// 회수장비 웹서비스 저장 ////////////////////////////////////////////
function wsRclDevFile(rcvIdx, prodNo , callback) {
    var url = ws_url + 'SetOtcCollection';
    var data = "{rcvIdx:'" + rcvIdx + "', rtnDd:'" + getTime() +  "', rtnId:'" + GetUserId() + "', prodNo:'" + prodNo +   "'}";

    var sucess = function(json) {
        if(json.d == "error"){
            alert("등록에 실패했습니다. 관리자에게 문의하세요.");
            return;
        }


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);

}



/// 회수장비리스트 웹서비스 ///////////////////////////////////////////
function wsRclDevList(rcvIdx, callback) {
    var url = ws_url + 'GetOtcCollectionList';

    var data = "{rcvIdx:'" + rcvIdx + "'}";

    var sucess = function(json){

        var list = $("#list_barcode");
        list.children().remove();

        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }


        $.each(Table, function(key, val){

            var RTN_IDX = val.RTN_IDX; //
            var PROD_NO = val.PROD_NO; //
            var PROD_NM = val.PROD_NM; //

            var rslt = $("<li data-icon='delete' abbr='{0}'><a href='#' >{1}</a></li>".format(RTN_IDX, PROD_NO));
            rslt.on("click", function(e){
                e.preventDefault();
                delDev(RTN_IDX, PROD_NM);
            });

            list.append(rslt);
        });

        $("#list_barcode").listview( "refresh" );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}


/// 회수장비 삭제 웹서비스 ///////////////////////////////////////////
function wsDelDev(rtnIdx, callback){

    var url = ws_url + 'DelOtcCollection';
    var data = "{rtnIdx:'" + rtnIdx+ "'}";

    var sucess = function(json){

        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}
