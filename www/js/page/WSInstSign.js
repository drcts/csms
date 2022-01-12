var parameter;

$(document).on('pageinit', "#WSInstSign",function (e) {
  e.preventDefault();
});

$(document).on('pagebeforeshow', "#WSInstSign",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("설치확인서명");

    if($(this).data("url").indexOf("?") != -1){
    var parameters = $(this).data("url").split("?")[1];
    parameter = parameters.replace("parameter=","");
        //alert(parameter);
    }

    //캔버스초기화
    canvas_init3();
    initInstSign();
});

$(document).on('pageshow', "#WSInstSign",function (){
    wsWSInstSignInfo(GetRcvIdx());
});

$(document).on('pagehide', "#WSInstSign",function () {
    $("#WSInstSign").remove();
});


var initInstSign = function() {
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

    //이전버튼
    $("#btnWSInstSign").click(function(){
        //PageNonChange("WSInstCtnt.html");
        if(!fn_isNull(parameter)){
            ParamPageChange("NotDoneList.html",parameter);
        }else{
            PageNonChange("NotDoneList.html");
        }
    });


    //캔버스에 이미지 연결하는 이벤트걸기
    canvas_reset3();
    var $img = $('#insthidImg');
    if ($img.length > 0 && !$img.get(0).complete) {
       $img.on('load', function(){
            canvas_reset3();
            var img = document.getElementById("insthidImg");
            ctx.drawImage(img, 0, 0, 350, 200);
            $("#WSInstSign").trigger("create");
       });
    }

}


var InstSignCfm = function(){
      if(!confirm("설치확인서명을 저장하시겠습니까?")){
               return;
        }
        else{
            var instOldAsstNo = $("#txInstOldAsstNo").val();
            var instCfmNm = $("#txInstCfmNm").val();
                if(instOldAsstNo.trim() == "")
                {
                    alert("회수장비 자산번호를 입력해 주십시오.");
                    return;
                }
                if(instCfmNm.trim() == "")
                {
                    alert("확인자를 입력해 주십시오.");
                    return;
                }
                else
                {
                    sendWSInstSignFile();
                }
        }
}


//캔버스초기화
function canvas_init3() {


    canvas = document.getElementById("inst_sig-canvas");
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
      renderCanvas3();
    })();



    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
            mousePos = getTouchPos3(canvas, e);
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
}

// Draw to the canvas
function renderCanvas3() {

  if (drawing) {
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lastPos = mousePos;
  }
}


// Get the position of a touch relative to the canvas
function getTouchPos3(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}


// 캔버스리셋
var canvas_reset3 = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

// 사인파일업로드
function sendWSInstSignFile() {
    var imgURL = canvas.toDataURL();
    var svc_fleNm = GetRcvIdx() + "_Sign"+getTime()+".jpg"; //서버로 전송되는 파일명

    // 0.파일 서버로 전송
    uploadWSSignFile(imgURL, svc_fleNm, function(){

        remain = Table.length; //삭제대상 남아있는 개수
        if(remain == 0){
            wsWSInstSignFile(GetRcvIdx(), svc_fleNm, $("#txInstCfmNm").val(),$("#txInstOldAsstNo").val(),  function(){
                alert("저장되었습니다.");
                wsWSInstSignInfo(GetRcvIdx());//재조회
            });
        }
        else{
            // 기존사인파일삭제
            $.each(Table, function(idx, val){
                // 사인정보 웹저장 - 다 지워진 경우 저장처리
                wsWSInstSignFile(GetRcvIdx(), svc_fleNm, $("#txInstCfmNm").val(),$("#txInstOldAsstNo").val(),  function(){
                    alert("저장되었습니다.");
                    wsWSInstSignInfo(GetRcvIdx());//재조회
                });

            });
        }

    });
}



/// 서명사진파일리스트 웹서비스 ///////////////////////////////////////////
function wsWSInstSignInfo(rcvIdx, callback) {
//alert(rcvIdx);
    var url = ws_url + 'GetWelsInstInfo';
    var data = "{rcvIdx:'" + rcvIdx + "'}";
    $("#insthidImg").attr("src","");

    var sucess = function(json){

        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        $.each(Table, function(key, val){

            if(val.SIGN_FILE != null)
            {
                var FLE_NM = val.SIGN_FILE ; //
                var ETC = val.COMP_RCPT_NM ; //
                 var array = FLE_NM.split("_");


                last_etc = ETC;
                //실서버
                last_sign_url = "http://wel.pcasset.drcts.com/nWELSWeb/Data/ATCHFILE/" + GetRcvIdx() + "/" + FLE_NM;
                //개발
                //last_sign_url = "http://192.168.0.51/nWELSWeb/Data/ATCHFILE/" + GetRcvIdx() + "/" + FLE_NM;

                 $("#btInstCfmSave").prop("disabled", true);
                 $("#btnWSInstDelSign").css("display", "none");
            }
        });

        //마지막 사인정보
        try{
            $("#txInstCfmNm").val(last_etc);
            $("#insthidImg").attr("src",last_sign_url);

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

function wsWSInstSignFile(rcvIdx, fleNm, etc, oldAsstNo, callback) {
         var url = ws_url + 'Wels_Save_Sign_File';
         var data = "{userId:'" + GetUserId() + "', rcvIdx:'" + rcvIdx +  "', etc:'" + etc+  "',oldAsstNo:'" + oldAsstNo+  "', fleNm:'" + fleNm + "'}";

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
