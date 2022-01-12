var parameter;

$(document).on('pageinit', "#ReqCtnt",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#ReqCtnt",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

if($(this).data("url").indexOf("?") != -1){
var parameters = $(this).data("url").split("?")[1];
parameter = parameters.replace("parameter=","");
    //alert(parameter);
}

    SetNaviTitle("요청내용");

    //정보조회
    wsRcvInfo(GetRcvIdx(), function(){
        //엔지니어콤보
        wsUserPopList(GetUserId(), "TranList", "#tranPopupList", "#TRAN_ID", "#tranPopup", function(){
            setRadioValue("#TRAN_ID", "TranList", "");
            //화면초기화
            initReqCtnt();
            gfn_endLoading();
        });
    });

});

$(document).on('pagehide', "#ReqCtnt",function () {
    $("#ReqCtnt").remove();
});

function initReqCtnt() {
    // 화면모드처리
     if(isDone == "B"){
        $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btTranSave").prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
        $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btTranSave").prop("disabled", false).removeClass("ui-state-disabled");
    }

    // 탭초기화
    $("input[type='radio']").attr("checked",false).checkboxradio("refresh");

    // 요청내용 탭으로 가기
    $("input[name='procTab']").on("click", function (e) {
        e.preventDefault();
        switch($(this).val()){
            case "0" :
                 if(!fn_isNull(parameter)){
                    ParamPageChange("RclDev.html",parameter);
                }else{
                    PageNonChange("RclDev.html");
                }
                break;
            case "1" :
                if(!fn_isNull(parameter)){
                    ParamPageChange("RefPhoto.html",parameter);
                }else{
                    PageNonChange("RefPhoto.html");
                }
                break;
            case "2" :
                if(!fn_isNull(parameter)){
                    ParamPageChange("CfmSign.html",parameter);
                }else{
                    PageNonChange("CfmSign.html");
                }
                break;
            case "3" :
                if(!fn_isNull(parameter)){
                    ParamPageChange("ProcReg.html",parameter);
                }else{
                    PageNonChange("ProcReg.html");
                }
                break;
            default :
                if(!fn_isNull(parameter)){
                    ParamPageChange("ProcReg.html",parameter);
                }else{
                    PageNonChange("ProcReg.html");
                }
                break;
        }
    });



    // 저장
    $("#btTranSave").on("click", function (e) {
        e.preventDefault();
        //alert("getRadioValue - " + getRadioValue("TranList"));
        wsTranId(GetRcvIdx(), getRadioValue("TranList"), function(_rcvIdx, _tranId){
            //SMS발송
            wsSendSMS(_rcvIdx, _tranId, function(RtnCode){
                if(RtnCode == "1"){
                    gfn_toast("SMS가 발송되었습니다.");
                }
                else{
                    gfn_toast("SMS가 발송실패...");
                }
            });
            alert("저장되었습니다.");
        });
        //moveTop();
    });


    $("#Below01").on("click", function (e) {
        PageNonChange("Visit.html");
    });
    $("#Below02").on("click", function (e) {
        PageNonChange("ReqMat.html");
    });
    $("#Below03").on("click", function (e) {
        PageNonChange("UseMat.html");
    });

    //이전버튼
    $("#btnReqCtnt").click(function(){
        if( isDone == "B" ){
                PageNonChange("DoneList.html");
        }
        else{
             if(!fn_isNull(parameter)){
                ParamPageChange("NotDoneList.html",parameter);
             }else{
                PageNonChange("NotDoneList.html");
             }
        }
    });

    /// 조치결과 저장하고 재조회
    $("#btnCall").click(function(e){
        e.preventDefault();

        var hpno = $("#HP_NO").val();
        document.location.href = "tel:" + hpno;
        /*

                if(!gfn_isValidHp(hpno) || !gfn_isValidTel(hpno)){
                    alert("잘못된 전화번호입니다.");
                    return;
                }
                else{
                    document.location.href = "tel:" + hpno;
                }
        */
    });


    /// 주소 클립보드복사
    var clipboard = new ClipboardJS(".clipBtn");
    clipboard.on("success", function(e){

        gfn_toast("주소가 복사되었습니다.");
        e.clearSelection();
    });
    clipboard.on("error", function(e){
        alert("주소복사 실패");
    });
}




/// 요청정보 웹서비스 //////////////////////////////////////////
function wsRcvInfo(rcvIdx, callback) {
    gfn_startLoading();

    var url = ws_url + 'GetServiceReceiptInfo';

    var data = "{rcvIdx:'" + rcvIdx + "'}";

    var sucess = function(json){

        // 1.기본정보
        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            var RCV_NO = val.RCV_NO;
            var RCV_DD = val.RCV_DD;
            var RCV_ID = val.RCV_ID;
            var RCV_TYP_NM = val.RCV_TYP_NM;

            var ORG_NM = val.ORG_NM;
            var ADDR = val.ADDR;
            var CLET_NM = val.CLET_NM;
            var HP_NO = val.HP_NO;

            var RCV_CNTS = val.RCV_CNTS;
            var OTC_TYP_NM = val.OTC_TYP_NM;
            var OTC_CD_NM = val.OTC_CD_NM;
            var TRAN_NM = val.TRAN_NM;
            var ETC = val.ETC;


            $("#rcvNo").val(val.RCV_NO);
            $("#rcvDt").val(val.RCV_DD);
            $("#rcvNm").val(val.RCV_ID);
            $("#rcvTpNm").val(val.RCV_TYP_NM);

            $("#ORG_NM").val(val.ORG_NM);
            $("#ADDR").val(val.ADDR);
            $("#CLET_NM").val(val.CLET_NM);
            $("#CUST_NM").val(val.CUST_NM);
            $("#HP_NO").val(val.HP_NO);

            $("#RCV_CNTS").val(val.RCV_CNTS);
            $("#OTC_TYP_NM").val(val.OTC_TYP_NM);
            $("#OTC_CD_NM").val(val.OTC_CD_NM);
            $("#TRAN_NM").val(val.TRAN_NM);
            $("#ETC").val(val.ETC);

        });


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
        else{
            gfn_endLoading();
        }
    };

    getAJAX(url, data, sucess);
}


/// 엔지니어 이관 웹서비스 저장 ////////////////////////////////////////////
function wsTranId(rcvIdx, tranId, callback) {
    var url = ws_url + 'SetServiceTran';
    var data = "{userId:'" + GetUserId() + "', rcvIdx:'" + rcvIdx +  "', tranId:'" + tranId+  "'}";

    var sucess = function(json) {
        if(json.d == "error")   return;

        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        //콜백처리
        if(  typeof callback === "function"){
            callback(rcvIdx, tranId);
        }
    };

    getAJAX(url, data, sucess);

}

/// SMS발송 ////////////////////////////////////////////
function wsSendSMS(rcvIdx, tranId, callback) {

    var url = ws_url2 + 'SendSMS';
    var data = '{rcvIdx: "' + rcvIdx + '", tranId: "' + tranId + '"}';


    var sucess = function(json) {
        if(json.d == "error")   return;


        var RtnCode = "0";
        try{
            RtnCode = JSON.parse(json.d).RtnCode;
        }catch(e){}

        //콜백처리
        if(  typeof callback === "function"){
            callback(RtnCode);
        }
    };

    getAJAX(url, data, sucess);

}
