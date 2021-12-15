var parameter;

$(document).on('pageinit', "#WSInstCtnt",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#WSInstCtnt",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

if($(this).data("url").indexOf("?") != -1){
var parameters = $(this).data("url").split("?")[1];
parameter = parameters.replace("parameter=","");
    //alert(parameter);
}

    SetNaviTitle("납품내용");


    //정보조회
    wsWelsInstInfo(GetRcvIdx(), function(){
                //화면초기화
                initWSInstCtnt();
                gfn_endLoading();
        });

});

$(document).on('pagehide', "#WSInstCtnt",function () {
    $("#WSInstCtnt").remove();
});


function initWSInstCtnt(){
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

    //이전버튼
        $("#btnWSInstCtnt").click(function(){
            if(!fn_isNull(parameter)){
                ParamPageChange("NotDoneList.html",parameter);
            }else{
                PageNonChange("NotDoneList.html");
            }
        });

        setTimeout(function () { $('#memo').css({ 'height': 'auto' }); }, 500);
}

var InstSign = function(){

    if(!confirm("해당장비의 설치확인사인을 진행하시겠습니까?")) return;
    ParamPageChange("WSInstSign.html",parameter);
    //PageNonChange("WSInstSign.html");

}

/// 요청정보 웹서비스 //////////////////////////////////////////
function wsWelsInstInfo(rcvIdx, callback) {
    gfn_startLoading();

    var url = ws_url + 'GetWelsInstInfo';

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
            var compReqDD = val.COMP_REQ_DD;
            var instReqDD = val.INST_REQ_DD;
            var compMngrNm = val.COMP_MNGR_NM;
            var compMngrHp = val.COMP_MNG_HP;
            var memo = val.MEMO;
            var asstNo = val.ASST_NO;
            var asstNm = val.ASST_NM;
            var mdlNm = val.PC_MDL;
            var sn = val.SN;
            var gubnNm = val.GUBN_NM;
            var orgNm = val.ORG_NM;
            var teamNm = val.TEAM_NM;
            var areaNm = val.AREA_NM;
            var deptCd = val.DEPT_CD;
            var empNo = val.EMP_NO;
            var empNm = val.EMP_NM;
            var instStatCd = val.INST_STAT_CD;

            $("#compReqDd").val(compReqDD);
            $("#instReqDd").val(instReqDD);
            $("#compMngrNm").val(compMngrNm);
            $("#compMngrHp").val(compMngrHp);
            $("#memo").val(memo);
            $("#asstNo").val(asstNo);
            $("#asstNm").val(asstNm);
            $("#mdlNm").val(mdlNm);
            $("#sn").val(sn);
            $("#gubnNm").val(gubnNm);
            $("#orgNm").val(orgNm);
            $("#teamNm").val(teamNm);
            $("#areaNm").val(areaNm);
            $("#deptCd").val(deptCd);
            $("#empNo").val(empNo);
            $("#empNm").val(empNm);

            if(instStatCd == "C")
            {
                 $("#btInstSign").prop("disabled", true);
            }

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
