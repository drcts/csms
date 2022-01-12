var Table = []; //사인파일리스트
var remain = 0;
var last_sign_url = "";//파일url
var last_etc = "";

var canvas;
var ctx;
var drawing;
var mousePos;
var lastPos;


$(document).on('pageinit', "#CfmSign",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#CfmSign",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("확인서명");

    //캔버스초기화
    canvas_init();

    initCfmSign();

});

$(document).on('pageshow', "#CfmSign",function (){
    // 사인조회
    wsSignInfo(GetRcvIdx());
});

$(document).on('pagehide', "#CfmSign",function () {
    $("#CfmSign").remove();
});



function initCfmSign() {
    last_sign_url = "";

    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btCfmSave").parent().prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btCfmSave").parent().prop("disabled", false).removeClass("ui-state-disabled");
    }

    // 이미지가 로드된 후에 캔버스에 표시
    /*
        document.getElementById("hidImg").onload = function(){
            var img = document.getElementById("hidImg");
            ctx.drawImage(img, 0, 0, 350, 200);
            $("#CfmSign").trigger("create");
        }
    */


    //저장
    $("#btCfmSave").click(function(){
        //사인파일저장
        sendSignFile();
    });

    //이전버튼
    $("#btnCfmSign").click(function(){
        PageNonChange("ReqCtnt.html");
    });


    //캔버스에 이미지 연결하는 이벤트걸기
    canvas_reset();
    var $img = $('#hidImg');
    if ($img.length > 0 && !$img.get(0).complete) {
       $img.on('load', function(){
            canvas_reset();
            var img = document.getElementById("hidImg");
            ctx.drawImage(img, 0, 0, 350, 200);
            $("#CfmSign").trigger("create");
       });
    }

}


//캔버스초기화
function canvas_init() {

    canvas = document.getElementById("sig-canvas");
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
      renderCanvas();
    })();



    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
            mousePos = getTouchPos(canvas, e);
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
function renderCanvas() {
  if (drawing) {
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lastPos = mousePos;
  }
}


// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}


// 캔버스리셋
var canvas_reset = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}



// 사인파일업로드
function sendSignFile() {
    var imgURL = canvas.toDataURL();
    var svc_fleNm = GetRcvIdx() + "_Sign"+getTime()+".jpg"; //서버로 전송되는 파일명

    // 0.파일 서버로 전송
    uploadFile(imgURL, svc_fleNm, function(){

        remain = Table.length; //삭제대상 남아있는 개수
        if(remain == 0){
            wsSignFile(GetRcvIdx(), svc_fleNm, $("#txCfmNm").val(), function(){
                alert("저장되었습니다.");
                wsSignInfo(GetRcvIdx());//재조회
            });
        }
        else{
            // 기존사인파일삭제
            $.each(Table, function(idx, val){

                var FLE_IDX = val.FLE_IDX;
                wsDelFile(FLE_IDX, function(){
                    remain--;
                    if(remain == 0){
                        // 사인정보 웹저장 - 다 지워진 경우 저장처리
                        wsSignFile(GetRcvIdx(), svc_fleNm, $("#txCfmNm").val(), function(){
                            alert("저장되었습니다.");
                            wsSignInfo(GetRcvIdx());//재조회
                        });
                    }
                });
            });
        }

    });


}



/// 서명사진파일리스트 웹서비스 ///////////////////////////////////////////
function wsSignInfo(rcvIdx, callback) {

    var url = ws_url + 'GetSignFile';
    var data = "{rcvIdx:'" + rcvIdx + "'}";
    $("#hidImg").attr("src","");

    var sucess = function(json){

        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            var FLE_IDX = val.FLE_IDX; //
            var FLE_NM = val.FLE_NM ; //
            var ETC = val.ETC ; //

            last_etc = ETC;
            last_sign_url = "http://cs.drcts.co.kr/CSMSWeb/Data/" + GetRcvIdx() + "/" + FLE_NM;
        });

        //마지막 사인정보
        try{
            $("#txCfmNm").val(last_etc);
            $("#hidImg").attr("src",last_sign_url);

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
function wsSignFile(rcvIdx, fleNm, etc, callback) {
    var url = ws_url + 'Save_Sign_File';
    var data = "{userId:'" + GetUserId() + "', rcvIdx:'" + rcvIdx +  "', etc:'" + etc+  "', fleCd:'F00099', fleNm:'" + fleNm + "'}";

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







