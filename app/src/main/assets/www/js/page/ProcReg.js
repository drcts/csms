var DISPTYP_CD = "";
var DISP_CD2 = "";
var SPT_CD = "";
var DISP_CD = "";

$(document).on('pageinit', "#ProcReg",function (e) {
    e.preventDefault();
});

$(document).on('pagehide', "#ProcReg",function () {
    $("#ProcReg").remove();
});

$(document).on('pagebeforeshow', "#ProcReg",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());

    SetNaviTitle("처리현황등록");



    //공통코드 콤보
    wsCodePopList("DS02", "#DISP_CD", "#DISP_CD_Popup", "RDO_DISP_CD", "처리코드", false, function(){
        wsCodePopList("OTCT", "#DISP_CD2", "#DISP_CD2_Popup", "RDO_DISP_CD2", "증상", false, function(){
            wsCodePopList("COST", "#SPT_CD", "#SPT_CD_Popup", "RDO_SPT_CD", "계약외", false, function(){
                wsCodePopList("DISP", "#DISPTYP_CD", "#DISPTYP_CD_Popup", "RDO_DISPTYP_CD", "처리형태", false, function(){

                    // 조치결과 조회
                    wsSvcRsltList(GetRcvIdx(), function(){

                        var buttonPicker2 =$("#RST_DD1").mobipick();
                        buttonPicker2.on( "change", function() {
                          var date = $( this ).val();
                          $("#RST_DD1").val(date);
                        });

                        //기본정보
                        wsProcInfo(GetRcvIdx(), function(){
                            var buttonPicker1 =$("#DISP_DD1").mobipick();
                            buttonPicker1.on( "change", function() {
                              var date = $( this ).val();
                              $("#DISP_DD1").val(date);
                            });

                            // 화면초기화
                            initProcReg();
                            gfn_endLoading();
                        });
                    });

                });
            });
        });
    });
    /*
        wsCodeList("DS02", "#DISP_CD","처리코드", function(){
            $("#DISP_CD").selectmenu('refresh');
        });
        wsCodeList("OTCT", "#DISP_CD2","증상코드", function(){
            $("#DISP_CD2")  .selectmenu('refresh');
        });
        wsCodeList("COST", "#SPT_CD","계약외", function(){
            $("#SPT_CD").selectmenu('refresh');
        });
        wsCodeList("DISP", "#DISPTYP_CD","처리형태", function(){
            $("#DISPTYP_CD").selectmenu('refresh');
        });
    */


    /// 기본정보 저장하고 재조회
    $("#btnSaveProc").click(function(e){
       e.preventDefault();
       wsSetProcInfo(GetRcvIdx(), function(){

            //기본정보
            wsProcInfo(GetRcvIdx(), function(){
                var buttonPicker1 =$("#DISP_DD1").mobipick();
                buttonPicker1.on( "change", function() {
                  var date = $( this ).val();
                  $("#DISP_DD1").val(date);
                });
            });
            gfn_endLoading();
            alert("저장되었습니다.");
       });
   });

    /// 조치결과 저장하고 재조회
    $("#btnSaveRslt").click(function(e){
       e.preventDefault();
       wsSetRsltInfo(GetRcvIdx(), function(){

            wsSvcRsltList(GetRcvIdx(), function(){

                var buttonPicker2 =$("#RST_DD1").mobipick();
                buttonPicker2.on( "change", function() {
                  var date = $( this ).val();
                  $("#RST_DD1").val(date);
                });
            });
            gfn_endLoading();
           alert("저장되었습니다.");
       });
   });


    $("#btnProcReg").click(function(){
        PageNonChange("ReqCtnt.html");
    });

});





function initProcReg() {
    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnSaveProc").hide();
        $("#btnSaveRslt").hide();
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnSaveProc").show();
        $("#btnSaveRslt").show();
    }

}





/// 처리현황 기본조회 웹서비스 ///////////////////////////////////////////
function wsProcInfo(rcvIdx, callback) {
    var url = ws_url + 'GetServiceProcessingInfo';

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

            var PROD_NM = val.PROD_NM;
            var DISPSTAT_CD = val.DISPSTAT_CD;
            var DISP_DD1 = fn_isNull(val.DISP_DD) ?  "" : fn_toDay(val.DISP_DD.substring(0,8)); //처리일시,
            var DISP_DD2 = fn_isNull(val.DISP_DD) ?  "" : val.DISP_DD.substring(8,10)+":"+val.DISP_DD.substring(10,12); //처리일시,
            var PROC_CNT = val.PROC_CNT; //건수
            var PROD_NO = val.PROD_NO; //제조번호
            var ASSET_NO = val.ASSET_NO;
            var PROD_ETC = val.PROD_ETC;
            DISPTYP_CD = val.DISPTYP_CD;
            DISP_CD2 = val.DISP_CD2;
            SPT_CD = val.SPT_CD;
            DISP_CD = val.DISP_CD;

             $("#PROD_NM").val(PROD_NM);
             $("#DISP_DD1").val(DISP_DD1);
             $("#DISP_DD2").val(DISP_DD2);
             $("#PROC_CNT").val(PROC_CNT);
             $("#PROD_NO").val(PROD_NO);
             $("#ASSET_NO").val(ASSET_NO);
             $("#PROD_ETC").val(PROD_ETC);



             if(DISPSTAT_CD == "C")
                $("#DISPSTAT_CD_01").prop("checked",true);
             else
                $("#DISPSTAT_CD_02").prop("checked",true);
            $("input[name='DISPSTAT_CD']").checkboxradio("refresh");

            setRadioValue("#DISPTYP_CD", "RDO_DISPTYP_CD", DISPTYP_CD, "[ 처리형태 ]");
            setRadioValue("#DISP_CD2", "RDO_DISP_CD2", DISP_CD2 ,"[ 증상코드 ]");
            setRadioValue("#SPT_CD", "RDO_SPT_CD", SPT_CD, "[ 계약외 ]");
            setRadioValue("#DISP_CD", "RDO_DISP_CD", DISP_CD, "[ 처리코드 ]");

        });


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }

    };

    getAJAX(url, data, sucess);
}


/// 조치결과조회 웹서비스 ///////////////////////////////////////////
function wsSvcRsltList(rcvIdx, callback) {
    gfn_startLoading();

    var url = ws_url + 'GetServiceResultList';
    var data = "{rcvIdx:'" + rcvIdx + "'}";

    var sucess = function(json){

        var list = $("#RstlList");
        list.children().remove();


        // 0.행추가
        //var button = $("<li><div class='ui-grid-a'><div class='ui-block-a'><input id='RST_DD1' value=''  type='text' data-corners='false' placeholder='처리일자' class='ui-mini'/><select name='RST_ID' id='RST_ID' data-mini='true' data-native-menu='false'></select></div><div class='ui-block-b'><input type='time' data-clear-btn='true' id='RST_DD2' value='' placeholder='처리시간' class='ui-mini'> <select name='RST_STAT' id='RST_STAT' data-mini='true' data-native-menu='false'><option value=''>[진행상태]</option><option value='I'>처리중</option><option value='C'>처리완료</option></select> </div></div><div class='ui-grid-solo'><div class='ui-block-a'><textarea id='RST_CNTS' placeholder='처리내용' style='width:98%;' class='ui-mini' ></textarea></div></div></li>");
        var button = $("<li><div class='ui-grid-a'><div class='ui-block-a'><input id='RST_DD1' value='{0}'  type='text' data-corners='false' placeholder='처리일자' class='ui-mini'/>        <a id='RST_ID' class='ui-btn ui-body-inherit ui-btn-icon-right ui-icon-carat-d' href='#rstPopup' data-rel='popup' data-position-to='window' data-transition='pop'  style='padding: .4em 1em!important;' >[ 엔지니어선택 ]</a><div id='rstPopup' data-role='popup'><div class='ui-popup-content'><div class='search-group'><input id='txtRstKey' type='text' data-clear-btn='true' placeholder='이름을 입력하세요.' data-corners='false'/><input id='btRstKey' type='button' value='검색' data-corners='false'/></div><div id='rstPopupList'></div></div></div>        </div><div class='ui-block-b'><input type='time' id='RST_DD2' value='{1}' data-corners='false' placeholder='처리시간' class='ui-mini' style='padding:.3em!important;'>                <select name='RST_STAT' id='RST_STAT' data-mini='true' data-native-menu='false' data-corners='false'><option value=''>[진행상태]</option><option value='I' selected >처리중</option><option value='C'>처리완료</option></select>         </div></div><div class='ui-grid-solo'><div class='ui-block-a'><textarea id='RST_CNTS' placeholder='처리내용' style='width:98%;' class='ui-mini' ></textarea></div></div></li>".format(fn_toDay(getTime().substring(0,8)), getTime().substring(8,10)+":"+getTime().substring(10,12)));
        list.append(button).trigger("create");


        // 1.기존조치결과
        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            var RST_ID = val.RST_ID; //조치담당자,
            var RST_DD1 = fn_isNull(val.RST_DD) ?  "" : fn_toDay(val.RST_DD.substring(0,8)); //처리일시,
            var RST_DD2 = fn_isNull(val.RST_DD) ?  "" : val.RST_DD.substring(8,10)+":"+val.RST_DD.substring(10,12); //처리일시,
            var RST_STAT = val.RST_STAT_NM; //상태,
            var RST_CNTS = val.RST_CNTS; //처리내용,

            var rslt = $("<li ><div class='ui-label'><div class='ui-label-title'>엔지니어</div><input type='text' data-corners='false' class='ui-mini disabled' value='{0}'/><div class='ui-label-title'>진행상태</div><input type='text' data-corners='false' class='ui-mini disabled' value='{1}' data-inline='true' /></div> </li> <li ><div class='ui-label'><div class='ui-label-title'>처리일자</div><input type='text' data-corners='false' class='ui-mini disabled' value='{2}'/><div class='ui-label-title'>처리시각</div><input type='text' data-corners='false' class='ui-mini disabled' value='{3}' data-inline='true' /></div> </li> <li ><div class='ui-label'><textarea placeholder='처리내용' data-inline='true' class='ui-mini  disabled' >{4}</textarea></div> </li>".format(RST_ID, RST_STAT, RST_DD1, RST_DD2, RST_CNTS));
            list.append(rslt).trigger("create");;
        });


        // 조치엔지니어선택 콤보 초기화
        wsUserPopList(GetUserId(), "RstList", "#rstPopupList", "#RST_ID", "#rstPopup", function(){

            //디폴트엔지니어
            setRadioValue("#RST_ID", "RstList", GetUserId());

            $("#RST_STAT").selectmenu('refresh');
            $("#RstlList").listview( "refresh" );

            // readonly 처리
            $( ".disabled" ).textinput( "option", "disabled", true );


        });

        /*
                wsUserList(GetUserId(), "#RST_ID","엔지니어 선택", function(){
                    $("#RST_ID").selectmenu('refresh');

                    //$("#RstlCol").trigger("create");
                    //$("#RstlList").trigger("create");
                    $("#RST_STAT").selectmenu('refresh');
                    $("#RstlList").listview( "refresh" );

                    // readonly 처리
                    $( ".disabled" ).textinput( "option", "disabled", true );
                });
        */


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
        else{
            gfn_startLoading();
        }


    };

    getAJAX(url, data, sucess);
}


/// 기본정보 웹서비스 저장 ////////////////////////////////////////////
function wsSetProcInfo(rcvIdx, callback) {
    gfn_startLoading();


    var url = ws_url + 'SetServiceProcessingInfo';
    var data = "{rcvIdx:'" + rcvIdx
            + "', dispStatCd:'" + getRadioValue("DISPSTAT_CD")
            + "', prodNm:'" + $("#PROD_NM").val()
            + "', prodNo:'" + $("#PROD_NO").val()
            + "', assetNo:'" + $("#ASSET_NO").val()
            + "', prodEtc:'" + $("#PROD_ETC").val()
            + "', dispTypCd:'" + getRadioValue("RDO_DISPTYP_CD")
            + "', dispDd:'" + $("#DISP_DD1").val().replace(/-/g,"") + $("#DISP_DD2").val().replace(/:/g,"")
            + "', sptCd:'" + fn_nvl(getRadioValue("RDO_SPT_CD"),"")
            + "', dispCd :'" + fn_nvl(getRadioValue("RDO_DISP_CD"),"")
            + "', dispCd2 :'" + fn_nvl(getRadioValue("RDO_DISP_CD2"),"")
            + "', procCnt:'" + $("#PROC_CNT").val()
            + "', revId:'" + GetUserId()
            + "'}";
    log("data - " + data);
    // 조건체크
    if(getRadioValue("DISPSTAT_CD") == "C" ){
        if(fn_isNull($("#PROD_NO").val())){
            alert("제조번호를 입력해주세요");
            gfn_endLoading();
            return;
        }
        if(fn_isNull(getRadioValue("RDO_DISPTYP_CD"))){
            alert("처리형태를 선택해주세요");
            gfn_endLoading();
            return;
        }
        if(fn_isNull(getRadioValue("RDO_DISP_CD2"))){
            alert("증상코드를 선택해주세요");
            gfn_endLoading();
            return;
        }
        if(fn_isNull(getRadioValue("RDO_DISP_CD"))){
            alert("처리코드를 선택해주세요");
            gfn_endLoading();
            return;
        }
    }

    if(!confirm("저장하시겠습니까?"))
        {
            gfn_endLoading();
            return;
        }

    var sucess = function(json) {

        if(json.d == "error"){
            alert("저장실패! 관리자에게 문의하세요" );
            return;
        }

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
        else{
            gfn_endLoading();
        }

    };

    getAJAX(url, data, sucess);
}



/// 조치결과 웹서비스 저장 ////////////////////////////////////////////
function wsSetRsltInfo(rcvIdx, callback) {
    gfn_startLoading();

    var url = ws_url + 'SetServiceResultInfo';
    var data = "{regId:'" + GetUserId()
            + "', rstStat:'" + $("#RST_STAT").val()
            + "', rcvIdx:'" + rcvIdx
            + "', rstId:'" + getRadioValue("RstList")
            + "', rstDd:'" + $("#RST_DD1").val().replace(/-/g,"") + $("#RST_DD2").val().replace(/:/g,"")
            + "', rstCnts:'" + $("#RST_CNTS").val()
            + "'}";
    log("data - " + data);

    if(fn_isNull($("#RST_CNTS").val())){
        alert("처리내용을 입력해주세요.");
        gfn_endLoading();
        return;
    }

    if($("#RST_STAT").val() == "C") //조치처리완료는 마스터 체크..
    {
        if(fn_isNull(getRadioValue("DISPSTAT_CD")))
        {
            alert("처리현황(기본정보)를 저장후 조치결과 처리가 가능합니다.");
            gfn_endLoading();
            return;
        }
    }

    if(!confirm("저장하시겠습니까?"))    return;


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
        else{
            gfn_endLoading();
        }
    };

    getAJAX(url, data, sucess);
}




