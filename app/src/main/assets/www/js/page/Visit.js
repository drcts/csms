
$(document).on('pageinit', "#Visit",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#Visit",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("방문약속");

    // 방문약속 조회
    wsSvcVisitList(GetRcvIdx(), function(){

        var buttonPicker1 =$("#VST_DD1").mobipick();
        buttonPicker1.on( "change", function() {
          var date = $( this ).val();
          $("#VST_DD1").val(date);
        });
        var buttonPicker2 =$("#RST_DD1").mobipick();
        buttonPicker2.on( "change", function() {
          var date = $( this ).val();
          $("#RST_DD1").val(date);
        });
        //화면초기화
        initVisit();
    });

});

$(document).on('pagehide', "#Visit",function () {
    $("#Visit").remove();
});


function initVisit() {
    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnVstSave").prop("disabled", true).addClass("ui-state-disabled");
        $("#btnVstDel").prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnVstSave").prop("disabled", false).removeClass("ui-state-disabled");
        $("#btnVstDel").prop("disabled", false).removeClass("ui-state-disabled");
    }

    $("#btnVisit").click(function(){
        PageNonChange("ReqCtnt.html");
    });

}


/// 방문약속 저장하고 재조회
var saveVisit = function(){
       wsSetVisitInfo(GetRcvIdx(), function(){

            wsSvcVisitList(GetRcvIdx(), function(){

                var buttonPicker1 =$("#VST_DD1").mobipick();
                buttonPicker1.on( "change", function() {
                  var date = $( this ).val();
                  $("#VST_DD1").val(date);
                });
                var buttonPicker2 =$("#RST_DD1").mobipick();
                buttonPicker2.on( "change", function() {
                  var date = $( this ).val();
                  $("#RST_DD1").val(date);
                });
            });
           alert("저장되었습니다.");
       });

};


/// 방문약속 삭제하고 재조회
var delVisit = function(vstIdx){
       if(!confirm("삭제하시겠습니까?")) return;

       wsDelVisitInfo(vstIdx, function(){

            wsSvcVisitList(GetRcvIdx(), function(){

                var buttonPicker1 =$("#VST_DD1").mobipick();
                buttonPicker1.on( "change", function() {
                  var date = $( this ).val();
                  $("#VST_DD1").val(date);
                });
                var buttonPicker2 =$("#RST_DD1").mobipick();
                buttonPicker2.on( "change", function() {
                  var date = $( this ).val();
                  $("#RST_DD1").val(date);
                });
            });
           alert("삭제되었습니다.");
       });
};

/// 방문약속조회 웹서비스 ///////////////////////////////////////////
function wsSvcVisitList(rcvIdx, callback) {
    var url = ws_url + 'GetServiceVisitList';

    var data = "{rcvIdx:'" + rcvIdx + "'}";

    var sucess = function(json){

        var list = $("#VisitList");
        list.children().remove();


        // 0.행추가
        var button = $("<li><div class='ui-grid-b'><div class='ui-block-a'><div class='ui-label-title'  >처리일시</div><div class='ui-label-title'  >약속시간</div></div><div class='ui-block-b'><input id='RST_DD1' value='{0}'  type='text' data-corners='false' placeholder='처리일자' class='ui-mini'/>  <input id='VST_DD1' value='{0}'  type='text' data-corners='false' placeholder='약속시간' class='ui-mini'/>   </div> <div class='ui-block-c'><input type='time' id='RST_DD2' value='{1}' data-corners='false' placeholder='처리시간' class='ui-mini' style='padding:.3em!important;'>         <input type='time' id='VST_DD2' value='{1}' data-corners='false' placeholder='방문시간' class='ui-mini' style='padding:.3em!important;'>            </div></div> <div class='ui-grid-solo'>	<div class='ui-block-a'><textarea id='VST_CNTS' placeholder='처리내용' style='width:99%;' class='ui-mini' ></textarea></div></div><div class='ui-grid-a'><div class='ui-block-a'><select name='VST_STAT' id='VST_STAT'  data-native-menu='false' data-corners='false'><option value=''>[진행상태]</option><option value='C'>완료</option><option value='N'>통화불가</option></select></div><div class='ui-block-b'><a href='#' id='btnVstSave' onclick='saveVisit();' class='ui-btn ui-icon-plus ui-btn-icon-right ' >저장</a></div></div></li>".format(fn_toDay(getTime().substring(0,8)), getTime().substring(8,10)+":"+getTime().substring(10,12)));
        list.append(button).trigger("create");


        // 1.기존방문약속
        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            var RST_DD1 = fn_isNull(val.RST_DD) ?  "" : fn_toDay(val.RST_DD.substring(0,8)); //처리일시,
            var RST_DD2 = fn_isNull(val.RST_DD) ?  "" : val.RST_DD.substring(8,10)+":"+val.RST_DD.substring(10,12); //처리일시,
            var VST_DD1 = fn_isNull(val.VST_DD) ?  "" : fn_toDay(val.VST_DD.substring(0,8)); //일시,
            var VST_DD2 = fn_isNull(val.VST_DD) ?  "" : val.VST_DD.substring(8,10)+":"+val.VST_DD.substring(10,12); //일시,
            var VST_STAT = val.VST_STAT_NM; //상태,
            var VST_CNTS = val.VST_CNTS; //처리내용,
            var VST_IDX = val.VST_IDX;
            var rslt = $("<li ><div class='ui-grid-c ui-label'>	<div class='ui-block-a'><div class='ui-label-title'  >진행상태</div> 	</div>	<div class='ui-block-b'>  <input type='text' data-corners='false' class='ui-mini disabled' value='{0}'  /> 	</div>		<div class='ui-block-c'><div class='ui-label-title'  >삭제</div>  	</div>	<div class='ui-block-d'>  <button data-role='none' id='btnVstDel' onclick='delVisit({6});' >Delete</button>	</div></div></li><li ><div class='ui-grid-c ui-label'>	<div class='ui-block-a'><div class='ui-label-title'  >처리일자</div>	</div>	<div class='ui-block-b'><input type='text' data-corners='false' class='ui-mini disabled' value='{1}'  />	</div>	<div class='ui-block-c'><div class='ui-label-title'  >처리시각</div>	</div>	<div class='ui-block-d'><input type='text' data-corners='false' class='ui-mini disabled' value='{2}'  />	</div></div></li>	<li ><div class='ui-label'><textarea placeholder='처리내용' data-inline='true' class='ui-mini  disabled' >{5}</textarea></div> </li>	".format(VST_STAT, RST_DD1, RST_DD2, VST_DD1, VST_DD2, VST_CNTS, VST_IDX));
            list.append(rslt).trigger("create");
        });


        $("#VST_STAT").selectmenu('refresh');
        $("#VisitList").listview( "refresh" );

        // readonly 처리
        $( ".disabled" ).textinput( "option", "disabled", true );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }


    };

    getAJAX(url, data, sucess);
}





/// 방문약속 웹서비스 저장 ////////////////////////////////////////////
function wsSetVisitInfo(rcvIdx, callback) {

    var url = ws_url + 'SetServiceVisit';
    var data = "{regId:'" + GetUserId()
            + "', rcvIdx:'" + rcvIdx
            + "', rstDd:'" + $("#RST_DD1").val().replace(/-/g,"") + $("#RST_DD2").val().replace(/:/g,"")
            + "', vstDd:'" + $("#VST_DD1").val().replace(/-/g,"") + $("#VST_DD2").val().replace(/:/g,"")
            + "', vstCnts:'" + $("#VST_CNTS").val()
            + "', vstStat:'" + $("#VST_STAT").val()
            + "'}";
    log("data - " + data);

    if(fn_isNull($("#VST_STAT").val())){
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



/// 방문약속 웹서비스 삭제 ////////////////////////////////////////////
function wsDelVisitInfo(vstIdx, callback) {

    var url = ws_url + 'DelServiceVisit';
    var data = "{vstIdx:'" + vstIdx
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



