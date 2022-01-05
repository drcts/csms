var COM_CD = "";
var GiJUM_CD = "";
var COM_TYPE = "";

$(document).on('pageinit', "#AsstMain",function (e) {
    e.preventDefault();

});

$(document).on('pagebeforeshow', "#AsstMain",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle("자산실사 - 회사&지점 선택");



    wsComPopList("#COM_CD", "#COM_CD_Popup", "RDO_COM_CD", "회사", false, function(){
        setRadioValue("#COM_CD", "RDO_COM_CD", GetComCd());
    });

     wsGijumPopList(GetComCd(), "#GIJUM_CD", "#GIJUM_CD_Popup", "RDO_GIJUM_CD", "지점", false, function(){
                          setRadioValue("#GIJUM_CD", "RDO_GIJUM_CD", GetGijumCd());
                            initVisit();
            });

     if(!fn_isNull(GetGijumNm())){
     if(GetGijumNm().indexOf("실사종료") != -1){
        $("#btGEnd").show();
     }
     else
     {
         $("#btGEnd").hide();
     }
}

});


$(document).on('pagehide', "#AsstMain",function () {
    $("#AsstMain").remove();
});


function initVisit() {

    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='photo']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnVstSave").prop("disabled", true).addClass("ui-state-disabled");
        $("#btnVstDel").prop("disabled", true).addClass("ui-state-disabled");
    }
    else if(isDone == "C"){
             $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
             $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
             $(" a[data-icon='photo']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
             $(" a[data-icon='photo']").addClass("ui-btn-active").addClass("ui-state-persist");
            $("#btnVstSave").prop("disabled", true).addClass("ui-state-disabled");
            $("#btnVstDel").prop("disabled", true).addClass("ui-state-disabled");
        }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='photo']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnVstSave").prop("disabled", false).removeClass("ui-state-disabled");
        $("#btnVstDel").prop("disabled", false).removeClass("ui-state-disabled");
    }



    // 저장
        $("#btGStart").on("click", function (e) {
        //debugger;
            if(GetComCd() == "")
            {
              alert("자산실사할 회사를 선택해 주십시오.");
              return;
            }
            if(GetGijumCd() == "")
            {
              alert("자산실사할 지점을 선택해 주십시오.");
              return;
            }

            e.preventDefault();
            alert("지점 실사를 시작합니다.");
            //alert("getRadioValue - " + getRadioValue("TranList"));
            wsGijumStart(GetComCd(), GetGijumCd(), function(){

            });

            PageNonChange("AsstGJList.html");
        });

        $("#btGEnd").on("click", function (e) {

        if(GetComCd() == "")
        {
          alert("실사종료확인할 회사를 선택해 주십시오.");
          return;
        }
        if(GetGijumCd() == "")
        {
          alert("실사종료확인할 지점을 선택해 주십시오.");
          return;
        }

            e.preventDefault();
            PageNonChange("AsstGJSign.html");
        });
    // 지점클릭 이벤트 처리
         $("input[name='RDO_COM_CD']").bind( "change", function(event, ui) {
             // 회사 지점 코드 초기화
             SetGijumCd("");
             SetGijumNm("");


             $("#COM_CD_Popup").popup('close');
             SetComCd($(this).val());
             SetComNm($(this).attr("abbr"));
             SetComType($(this).attr("title"));
             //alert(GetComType());
             //alert(GetComNm());
             //지점콤보 가져오기
             wsGijumPopList($(this).val(), "#GIJUM_CD", "#GIJUM_CD_Popup", "RDO_GIJUM_CD", "지점", false, function(){
                    GijumBindChange();
             });

         });

         GijumBindChange();

        if(!fn_isNull(GetGijumNm())){
            if(getRadioText("RDO_GIJUM_CD",GetGijumCd()).indexOf("실사종료") != -1){
                $("#btGEnd").show();
             }
             else
             {
                 $("#btGEnd").hide();
             }
        }

}

function GijumBindChange()
{
        $("input[name='RDO_GIJUM_CD']").bind( "change", function(event, ui) {
            $("#GIJUM_CD_Popup").popup('close');
            SetGijumCd($(this).val());
            SetGijumNm($(this).attr("abbr"));
            //alert(GetGijumCd());
            //alert(GetGijumNm());

            if($(this).attr("abbr").indexOf("실사종료") != -1){
                $("#btGEnd").show();
             }
             else
             {
                 $("#btGEnd").hide();
             }
         });


}

function wsGijumStart(comCd, gijumCd, callback) {
     var url = ws_url + 'SetGijumStart';
     var data = "{comCd:'" + comCd +  "', gijumCd:'" + gijumCd+  "', userId:'" + GetUserId() + "' }";
     //debugger;
     var sucess = function(json) {
         if(json.d == "error")   return;

         var rtnCode;
         try{
             rtnCode = JSON.parse(json.d).RtnCode;
         }catch(e){
             return;
         }

         //콜백처리
         if(  typeof callback === "function"){
             callback();
         }
     };

     getAJAX(url, data, sucess);

}



//프린트 설정페이지
var fn_printer = function () {
    //백그라운드 서비스구동체크
    cordova.plugins.web_call.svcMethod([''],function(ret){
        //alert('svcMethod success - ' + ret);

        cordova.plugins.web_call.setMethod([''],function(ret){
            alert('setMethod success - ' + ret);
        },function(err){
            alert('setMethod error - ' + err);
        });

    },function(err){
        alert('svcMethod error 프린터장비 연결 백그라운드 서비스 실패...');
    });



}




