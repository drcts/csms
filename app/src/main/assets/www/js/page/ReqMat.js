
$(document).on('pageinit', "#ReqMat",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#ReqMat",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("자재요청");

    //진행상태 - 초기는 노트북 품목으로..
    _wsCodePopList("#EQP_STAT", "#EQP_STAT_Popup", "RDO_EQP_STAT", "진행상태", false, function(){
    });

    // 자재요청 조회
    wsSvcReqMatList(GetRcvIdx(), function(){
        //화면초기화
        initReqMat();
    });
});

$(document).on('pagehide', "#ReqMat",function () {
    $("#ReqMat").remove();
});

function initReqMat() {
    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
         $("#btnReqMatSave").prop("disabled", true).addClass("ui-state-disabled");
         $("#btnReqMqtDel").prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
         $("#btnReqMatSave").prop("disabled", false).removeClass("ui-state-disabled");
         $("#btnReqMqtDel").prop("disabled", false).removeClass("ui-state-disabled");
    }

    $("#btnReqMat").click(function(){
        PageNonChange("ReqCtnt.html");
    });


}


/// 자재요청 저장하고 재조회
var saveReqMat = function(){
       wsSetReqMatInfo(GetRcvIdx(), function(){
            wsSvcReqMatList(GetRcvIdx(), function(){
               alert("저장되었습니다.");
            });
       });

};


/// 자재요청 삭제하고 재조회
var delReqMat = function(eqpIdx){
       if(!confirm("삭제하시겠습니까?")) return;

       wsDelReqMatInfo(eqpIdx, function(){

            wsSvcReqMatList(GetRcvIdx(), function(){
               alert("삭제되었습니다.");
            });
       });
};

/// 자재요청조회 웹서비스 ///////////////////////////////////////////
function wsSvcReqMatList(rcvIdx, callback) {

    var url = ws_url + 'GetServiceEQPList';
    var data = "{rcvIdx:'" + rcvIdx + "'}";
    var sucess = function(json){

        var list = $("#ReqMatList");
        list.children().remove();

        // 0.입력창 클리어
        $("#EQP_NM").val('');
        $("#EQP_HP").val('');
        $("#EQP_ID").val('');
        setRadioValue("#EQP_STAT", "RDO_EQP_STAT", "", "[ 진행상태 ]");


        // 1.기존자재요청
        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            var EQP_HP = val.EQP_HP; //전화번호
            var EQP_STAT_NM = val.EQP_STAT_NM; //상태,
            var EQP_NM = val.EQP_NM; //처리내용,
            var EQP_IDX = val.EQP_IDX;
            var EQP_ID = val.EQP_ID;
            var rslt = $("<li ><div class='ui-grid-c ui-label'>	<div class='ui-block-a'><div class='ui-label-title'  >진행상태</div> 	</div>	<div class='ui-block-b'>  <input type='text' data-corners='false' class='ui-mini disabled' value='{1}'  /> 	</div>		<div class='ui-block-c'><div class='ui-label-title'  >삭제</div>  	</div>	<div class='ui-block-d'>  <button data-role='none' id='btnReqMqtDel' onclick='delReqMat({0});' >Delete</button>	</div></div></li><li ><div class='ui-grid-c ui-label'>	<div class='ui-block-a'><div class='ui-label-title'  >실사용자</div>	</div>	<div class='ui-block-b'><input type='text' data-corners='false' class='ui-mini disabled' value='{2}'  />	</div>	<div class='ui-block-c'><div class='ui-label-title'  >전화번호</div>	</div>	<div class='ui-block-d'><input type='text' data-corners='false' class='ui-mini disabled' value='{3}'  />	</div></div></li>	<li ><div class='ui-label'><textarea placeholder='부품명/규격' data-inline='true' class='ui-mini  disabled' >{4}</textarea></div> </li>	".format(EQP_IDX, EQP_STAT_NM, EQP_ID,  EQP_HP,  EQP_NM));
            list.append(rslt).trigger("create");
        });

        $("#ReqMatList").listview( "refresh" );

        // readonly 처리
        $( ".disabled" ).textinput( "option", "disabled", true );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }


    };

    getAJAX(url, data, sucess);
}





/// 자재요청 웹서비스 저장 ////////////////////////////////////////////
function wsSetReqMatInfo(rcvIdx, callback) {

    var url = ws_url + 'SetServiceEQP';
    var data = "{regId:'" + GetUserId()
            + "', rcvIdx:'" + rcvIdx
            + "', eqpId:'" + $("#EQP_ID").val()
            + "', eqpHp:'" + $("#EQP_HP").val()
            + "', eqpNm:'" + $("#EQP_NM").val()
            + "', eqpStat:'" + getRadioValue("RDO_EQP_STAT")
            + "'}";
    log("data - " + data);

    if(fn_isNull($("#EQP_ID").val())){
        alert("실사용자를 선택해주세요");
        return;
    }
    if(fn_isNull(getRadioValue("RDO_EQP_STAT"))){
        alert("진행상태를 선택해주세요");
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



/// 자재요청 웹서비스 삭제 ////////////////////////////////////////////
function wsDelReqMatInfo(eqpIdx, callback) {

    var url = ws_url + 'DelServiceEQP';
    var data = "{eqpIdx:'" + eqpIdx
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





/// 코드 - 팝업형태 ////////////////////////////////////////////
function _wsCodePopList(text_name, list_name, radio_name, def, isSelectAll, callback) {


        var list = [{codeCd:'A', codeNm:'선처리' },{codeCd:'B', codeNm:'요청' },{codeCd:'C', codeNm:'준비중' },{codeCd:'D', codeNm:'출고대기' },{codeCd:'E', codeNm:'출고' }
                    ,{codeCd:'F', codeNm:'취소' },{codeCd:'G', codeNm:'확인완료' },];

        var target = $(list_name);
        target.children().remove();

        var fieldset = $("<fieldset data-role='controlgroup' data-iconpos='right'></fieldset> ");
        fieldset.append($('<legend>'+ def +'를(을) 선택하세요</legend>'));

        if(isSelectAll) {
          var all = $("<input name='{0}' id='{0}All' type='radio' value='' checked='checked'><label for='{0}All'>[ {1} ]</label> ".format(radio_name, def));
          all.on("click", function(e) {
            e.preventDefault();

            var input_txt = $(text_name);
            input_txt.text(this.value);
            if(input_txt.hasClass("ui-input-empty-error"))
              input_txt.removeClass("ui-input-empty-error");
            $(list_name).popup('close');
          });
          fieldset.append(all);
        }

        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            var index = i+1;
            var Code = val.codeCd;
            var Name = val.codeNm;

            var button = $("<input name='{0}' id='{1}' type='radio' value='{1}' abbr='{2}'><label for='{1}'>{3}. {2}</label> ".format(radio_name, Code, Name, index));
            button.on("click", function(e) {
              e.preventDefault();

              var input_txt =$(text_name);
              input_txt.text($(this).attr("abbr"));
              input_txt.val(this.value);
              if(input_txt.hasClass("ui-input-empty-error"))
                input_txt.removeClass("ui-input-empty-error");

              $(list_name).popup('close');
            });

            fieldset.append(button);
        }

        target.append(fieldset);
        fieldset.controlgroup().controlgroup('refresh');

        $(text_name).text("[ " + def + " ]");


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }


}

