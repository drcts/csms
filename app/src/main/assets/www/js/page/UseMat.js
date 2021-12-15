var MDLC_CD = "";
var JAJAE_CD = "";

$(document).on('pageinit', "#UseMat",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#UseMat",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("사용자재");

    //부품콤보 - 초기는 노트북 품목으로..
    wsCodePopList("NTPC", "#JAJAE_CD", "#JAJAE_CD_Popup", "RDO_JAJAE_CD", "부품", false, function(){
    });


    // 사용자재 조회
    wsSvcUseMatList(GetRcvIdx(), function(){
        //화면초기화
        initUseMat();
    });
});

$(document).on('pagehide', "#UseMat",function () {
    $("#UseMat").remove();
});

function initUseMat() {

    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
         $("#btnUseMatSave").prop("disabled", true).addClass("ui-state-disabled");
         $("#btnUseMatDel").prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
         $("#btnUseMatSave").prop("disabled", false).removeClass("ui-state-disabled");
         $("#btnUseMatDel").prop("disabled", false).removeClass("ui-state-disabled");

        $("#btnUseMat").click(function(){
            PageNonChange("ReqCtnt.html");
        });

    }




    // 품명클릭 이벤트 처리
     $("input[name='RDO_MDLC_CD']").bind( "change", function(event, ui) {
         // 선택항목 표시
         var input_txt =$("#MDLC_CD");
         input_txt.text($(this).attr("abbr"));
         input_txt.val($(this).val());
         $("#MDLC_CD_Popup").popup('close');

         //부품콤보 가져오기
         wsCodePopList($(this).attr("data-grp"), "#JAJAE_CD", "#JAJAE_CD_Popup", "RDO_JAJAE_CD", "부품");

     });
 }


/// 사용자재 저장하고 재조회
var saveUseMat = function(){
       wsSetUseMatInfo(GetRcvIdx(), function(){

            wsSvcUseMatList(GetRcvIdx(), function(){
               alert("저장되었습니다.");
            });
       });
};


/// 사용자재 삭제하고 재조회
var delUseMat = function(jajaeIdx){
       if(!confirm("삭제하시겠습니까?")) return;

       wsDelUseMatInfo(jajaeIdx, function(){

            wsSvcUseMatList(GetRcvIdx(), function(){
               alert("삭제되었습니다.");
            });
       });
};






/// 사용자재조회 웹서비스 ///////////////////////////////////////////
function wsSvcUseMatList(rcvIdx, callback) {
    var url = ws_url + 'GetServiceJajaeList';

    var data = "{rcvIdx:'" + rcvIdx + "'}";

    var sucess = function(json){

        // 행추가부분 클리어
        $("#JAJAE_DESC").val('');
        $("#MDLC_CD").val('');
        setRadioValue("#MDLC_CD", "RDO_MDLC_CD", "", "[ 품명 ]");
        setRadioValue("#JAJAE_CD", "RDO_JAJAE_CD", "", "[ 부품 ]");

        // 리스트부분 클리어
        var list = $("#UseMatList");
        list.children().remove();

        // 1.기존사용자재
        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            var MDLC_CD = val.MDLC_CD; //품목,
            var MDLC_NM = val.MDLC_NM; //품목,
            var JAJAE_CD = val.JAJAE_CD; //자재,
            var JAJAE_NM = val.JAJAE_NM; //자재,
            var JAJAE_DESC = val.JAJAE_DESC; //처리내용,
            var JAJAE_IDX = val.JAJAE_IDX;
            var rslt = $("<li ><div class='ui-grid-d ui-label'>	<div class='ui-block-a'><div class='ui-label-title'  >품명</div> 	</div>	<div class='ui-block-b'><input type='text' data-corners='false' class='ui-mini disabled' value='{0}'  /> 	</div>		<div class='ui-block-c'><div class='ui-label-title'  >부품</div>  	</div>	<div class='ui-block-d'>  <input type='text' data-corners='false' class='ui-mini disabled' value='{1}'  />	</div>	<div class='ui-block-e'>  <button id='btnUseMatDel' data-role='none' onclick='delUseMat({3});' >Delete</button>	</div></div></li><li ><div class='ui-label'><textarea placeholder='Description' data-inline='true' class='ui-mini  disabled' >{2}</textarea></div> </li>".format(MDLC_NM, JAJAE_NM, JAJAE_DESC, JAJAE_IDX));
            list.append(rslt).trigger("create");
        });


        $("#UseMatList").listview( "refresh" );

        // readonly 처리
        $( ".disabled" ).textinput( "option", "disabled", true );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }


    };

    getAJAX(url, data, sucess);
}





/// 사용자재 웹서비스 저장 ////////////////////////////////////////////
function wsSetUseMatInfo(rcvIdx, callback) {

    var url = ws_url + 'SetServiceJajae';
    var data = "{regId:'" + GetUserId()
            + "', rcvIdx:'" + rcvIdx
            + "', jajaeDesc:'" + $("#JAJAE_DESC").val()
            + "', mdlcCd:'" + $("#MDLC_CD").val()
            + "', jajaeCd:'" + $("#JAJAE_CD").val()
            + "'}";
    log("data - " + data);

    if(fn_isNull(getRadioValue("RDO_MDLC_CD"))){
        alert("품명을 선택해주세요");
        return;
    }
    if(fn_isNull(getRadioValue("RDO_JAJAE_CD"))){
        alert("부품을 선택해주세요");
        return;
    }

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
            callback();
        }
    };

    getAJAX(url, data, sucess);
}



/// 사용자재 웹서비스 삭제 ////////////////////////////////////////////
function wsDelUseMatInfo(jajaeIdx, callback) {

    var url = ws_url + 'DelServiceJajae';
    var data = "{jajaeIdx:'" + jajaeIdx
            + "'}";
log("data - " + data);

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
            callback();
        }
    };

    getAJAX(url, data, sucess);
}



