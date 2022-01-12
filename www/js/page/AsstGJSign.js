//var Table = []; //사인파일리스트
//var remain = 0;
//var last_sign_url = "";//파일url
//var last_etc = "";
//
//var canvas;
//var ctx;
//var drawing;
//var mousePos;
//var lastPos;


$(document).on('pageinit', "#AsstGJSign",function (e) {

});

$(document).on('pagebeforeshow', "#AsstGJSign",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle(GetComNm()+" - "+GetGijumNm());
    //캔버스초기화
    canvas_init2();

     isDone = "C";
    initAsstGJSign();
});

$(document).on('pageshow', "#AsstGJSign",function (){
    wsAsstGijumSign();
    wsAsstSignInfo();
});

$(document).on('pagehide', "#AsstGJSign",function () {
    $("#AsstGJSign").remove();
});

var initAsstGJSign = function() {
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

    //이전버튼
        $("#btnAsstGJSign").click(function(){
             SetPcIdx("");
             isDone = "C";
             PageNonChange("AsstMain.html");
        });


//캔버스에 이미지 연결하는 이벤트걸기
    canvas_reset2();
    var $img = $('#hidImg1');
    if ($img.length > 0 && !$img.get(0).complete) {
       $img.on('load', function(){
            canvas_reset2();
            var img = document.getElementById("hidImg1");
            ctx.drawImage(img, 0, 0, 350, 200);
            $("#AsstGJSign").trigger("create");
       });
    }
}


var GijumEndCfm = function(){
      if($("#txCfmNm1").val().trim() == "")
      {
          alert("지점실사종료 확인자를 입력해 주십시오.");
          $("#txCfmNm1").focus();
      }
      else
      {
          if(!confirm("해당 지점의 실사완료 확인하시겠습니까?")) return;
          {
            sendAsstSignFile();
          }
      }
}

function wsAsstGijumSign() {

gfn_startLoading();

    var url = ws_url + 'GetGijumAsstRslt';

    var data = "{comCd:'" + GetComCd() + "', gijumCd:'"+GetGijumCd()+"'}";

    var sucess = function(json){

        var list = $("#AsstGijumSignView");
        list.children().remove();

        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

        var gb = val.GB; //장비구분
        var cnt1 = val.CNT1; //이전실사자산수,
        var cnt2 = val.CNT2; //실사완료자산수,
        var cnt3 = val.CNT3; //미실사자산수
        var cnt4 = val.CNT4; //실사완료자산수,
        var cnt5 = val.CNT5; //미실사자산수
        var cnt6 = val.CNT6; //합계

        var button = $("<tr class='trow'><td style='width:14%;'>{0}</td><td style='width:14%;'>{1}</td><td style='width:14%;'>{2}</td><td style='width:14%;'>{3}</td><td style='width:14%;'>{4}</td><td style='width:14%;'>{5}</td><td style='width:16%;'>{6}</td></tr>".format( fn_nvl(gb,"&nbsp;" ), fn_nvl(cnt1,"&nbsp;" ), fn_nvl(cnt2,"&nbsp;" ),fn_nvl(cnt3,"&nbsp;" ), fn_nvl(cnt4,"&nbsp;" ), fn_nvl(cnt5,"&nbsp;" ), fn_nvl(cnt6,"&nbsp;" )));


        //var button = $("<tr class='trow'><td onclick='goAsstInfoA({0});' style='width:150px;'>{1}</td><td onclick='goAsstInfoA({0});'>{2}</td></tr><tr><td onclick='goAsstInfoA({0});' style='width:150px;'>{3}</td><td onclick='goAsstInfoA({0});'>{4}</td></tr><tr><td colspan='2' onclick='goAsstInfoA({0});'>{5}</td></tr>".format(pcIdx, fn_nvl(pcNum,"&nbsp;" ), fn_nvl(pcSn,"&nbsp;" ), fn_nvl(pcTyp,"&nbsp;" ), fn_nvl(pcModel,"&nbsp;" ), fn_nvl(statNm,"&nbsp;" )));


            list.append(button);
            /*
                        button.on("click", function(e){
                            e.preventDefault();
                            goReqCtntA(rcvIdx);
                        });
            */
        });

        $("#myTable").table("refresh");

        gfn_endLoading();
    };

    getAJAX(url, data, sucess);
}

//캔버스초기화
function canvas_init2() {


    canvas = document.getElementById("sig-canvas1");
    ctx = canvas.getContext("2d");
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;

    // Set up mouse events for drawing
    drawing = false;
    mousePos = { x:0, y:0 };
    lastPos = mousePos;
    canvas.addEventListener("mousedown", function (e) {
            drawing = true;
      lastPos = getMousePos(canvas, e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
      drawing = false;
    }, false);
    canvas.addEventListener("mousemove", function (e) {
      mousePos = getMousePos(canvas, e);
    }, false);

    // Get the position of the mouse relative to the canvas
    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      };
    }


    // Get a regular interval for drawing to the screen
    window.requestAnimFrame = (function (callback) {
            return window.requestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimaitonFrame ||
               function (callback) {
            window.setTimeout(callback, 1000/60);
               };
    })();


    // Allow for animation
    (function drawLoop () {
      requestAnimFrame(drawLoop);
      renderCanvas2();
    })();



    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
            mousePos = getTouchPos2(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);




    // Prevent scrolling when touching the canvas
    /*
        document.body.addEventListener("touchstart", function (e) {
          if (e.target == canvas) {
            e.preventDefault();
          }
        }, false);
        document.body.addEventListener("touchend", function (e) {
          if (e.target == canvas) {
            e.preventDefault();
          }
        }, false);
        document.body.addEventListener("touchmove", function (e) {
          if (e.target == canvas) {
            e.preventDefault();
          }
        }, false);
    */

}


// Draw to the canvas
function renderCanvas2() {

  if (drawing) {
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lastPos = mousePos;
  }
}


// Get the position of a touch relative to the canvas
function getTouchPos2(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}


// 캔버스리셋
var canvas_reset2 = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}


// 사인파일업로드
function sendAsstSignFile() {

    var imgURL = canvas.toDataURL();
    var svc_fleNm = GetGijumCd()+"_"+getYearMonth()+ "_Sign"+getTime()+".jpg"; //서버로 전송되는 파일명


    // 0.파일 서버로 전송
   // uploadSignFile(imgURL, svc_fleNm, function(){

uploadSignFile(imgURL, svc_fleNm, function(){
        remain = Table.length; //삭제대상 남아있는 개수
        if(remain == 0){
            wsAsstSignFile(svc_fleNm, $("#txCfmNm1").val(), function(){
                alert("저장되었습니다.");
                wsAsstSignInfo();//재조회
            });
        }
        else{
            // 기존사인파일삭제
            $.each(Table, function(idx, val){

                //var FLE_IDX = val.FLE_IDX;
//                wsDelFile(FLE_IDX, function(){
//                    remain--;
//                    if(remain == 0){
                        // 사인정보 웹저장 - 다 지워진 경우 저장처리
                        wsAsstSignFile(svc_fleNm, $("#txCfmNm1").val(), function(){
                            alert("저장되었습니다.");
                            wsAsstSignInfo();//재조회
                        });
//                    }
//                });
            });
        }

    });


}



/// 서명사진파일리스트 웹서비스 ///////////////////////////////////////////
/// 서명사진파일리스트 웹서비스 ///////////////////////////////////////////
function wsAsstSignInfo(callback) {

    var url = ws_url + 'GetAsstSignFile';
    var data = "{comCd:'" + GetComCd() + "', gijumCd:'"+GetGijumCd()+"'}";
    $("#hidImg1").attr("src","");

    var sucess = function(json){

        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            if(val.SIGN_FILE_NM != null)
            {
                var FLE_NM = val.SIGN_FILE_NM ; //
                var ETC = val.SIGN_MNG_NM ; //
                 var array = FLE_NM.split("_");


                last_etc = ETC;
                //실서버
                last_sign_url = "http://cs.drcts.co.kr/CSMSWeb/Data/" + array[0] + "/"+ array[1] + "/" + FLE_NM;
                //개발
                //last_sign_url = "http://1.221.243.162:7878/CSMSWeb/Data/" + array[0] + "/"+ array[1] + "/" + FLE_NM;

                 $("#btGijumEndCfm").prop("disabled", true);
                 $("#btnDelSign").css("display", "none");
            }
        });

        //마지막 사인정보
        try{
            $("#txCfmNm1").val(last_etc);
            $("#hidImg1").attr("src",last_sign_url);

        }catch(e){
            //log("image src not found...");
        }


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}



/// 사진정보 웹서비스 저장 ////////////////////////////////////////////
function wsAsstSignFile(fleNm, etc, callback) {
    var url = ws_url + 'Save_ASST_Sign_File';
    var data = "{comCd:'" + GetComCd() + "', gijumCd:'"+GetGijumCd()+"', userId:'" + GetUserId() + "', etc:'" + etc+  "',  fleNm:'" + fleNm + "'}";

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