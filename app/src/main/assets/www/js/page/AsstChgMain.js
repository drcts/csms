var COM_CD = "";
var GiJUM_CD = "";
var COM_TYPE = "";

$(document).on('pageinit', "#AsstChgMain",function (e) {
    e.preventDefault();

});

$(document).on('pagebeforeshow', "#AsstChgMain",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle("자산신규설치 - 회사&지점 선택");



    wsComPopList("#COM_CD", "#COM_CD_Popup", "RDO_COM_CD", "회사", false, function(){
        setRadioValue("#COM_CD", "RDO_COM_CD", GetComCd());
    });

     wsGijumPopList(GetComCd(), "#GIJUM_CD", "#GIJUM_CD_Popup", "RDO_GIJUM_CD", "지점", false, function(){
                          setRadioValue("#GIJUM_CD", "RDO_GIJUM_CD", GetGijumCd());
                            initChgVisit();
            });

     /*if(!fn_isNull(GetGijumNm())){
     if(GetGijumNm().indexOf("실사종료") != -1){
        $("#btGEnd").show();
     }
     else
     {
         $("#btGEnd").hide();
     }
}*/

});


$(document).on('pagehide', "#AsstChgMain",function () {
    $("#AsstChgMain").remove();
});


function initChgVisit() {

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
        $("#btChgStart").on("click", function (e) {
            if(GetComCd() == "")
            {
              alert("자산신규설치할 회사를 선택해 주십시오.");
              return;
            }
            if(GetGijumCd() == "")
            {
              alert("자산신규설치할 지점을 선택해 주십시오.");
              return;
            }

            e.preventDefault();
            alert("지점 자산신규설치를 시작합니다.");
            //alert("getRadioValue - " + getRadioValue("TranList"));
           /* wsChgGijumStart(GetComCd(), GetGijumCd(), function(){

            });*/

            PageNonChange("AsstGJChgList.html");
        });

//        $("#btGEnd").on("click", function (e) {
//
//        if(GetComCd() == "")
//        {
//          alert("실사종료확인할 회사를 선택해 주십시오.");
//          return;
//        }
//        if(GetGijumCd() == "")
//        {
//          alert("실사종료확인할 지점을 선택해 주십시오.");
//          return;
//        }
//
//            e.preventDefault();
//            PageNonChange("AsstGJSign.html");
//        });
    // 지점클릭 이벤트 처리
         $("input[name='RDO_COM_CD']").bind( "change", function(event, ui) {
             // 회사 지점 코드 초기화
             SetGijumCd("");
             SetGijumNm("");


             $("#COM_CD_Popup").popup('close');
             SetComCd($(this).val());
             SetComNm($(this).attr("abbr"));
             SetComType($(this).attr("title"));
             //alert(GetComCd());
             //alert(GetComNm());
             //지점콤보 가져오기
             wsGijumPopList($(this).val(), "#GIJUM_CD", "#GIJUM_CD_Popup", "RDO_GIJUM_CD", "지점", false, function(){
                    ChgGijumBindChange();
             });

         });

         ChgGijumBindChange();

        /*if(!fn_isNull(GetGijumNm())){
            if(getRadioText("RDO_GIJUM_CD",GetGijumCd()).indexOf("실사종료") != -1){
                $("#btGEnd").show();
             }
             else
             {
                 $("#btGEnd").hide();
             }
        }*/

}

function ChgGijumBindChange()
{
        $("input[name='RDO_GIJUM_CD']").bind( "change", function(event, ui) {
            $("#GIJUM_CD_Popup").popup('close');
            SetGijumCd($(this).val());
            SetGijumNm($(this).attr("abbr"));
            //alert(GetGijumCd());
            //alert(GetGijumNm());

            /*if($(this).attr("abbr").indexOf("실사종료") != -1){
                $("#btGEnd").show();
             }
             else
             {
                 $("#btGEnd").hide();
             }*/
         });


}







