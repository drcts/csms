var pictureSource;
var destinationType;
var cameraOptions;

/*웹서비스 도메인*/
 //실서버
var ws_url = 'http://cs.drcts.co.kr/WSCSMS/ActionMng.asmx/';
 //개발서버
//var ws_url = 'http://192.168.0.51/WSCSMS/ActionMng.asmx/';

//SMS전용웹서비스주소
var ws_url2 = 'http://cs.drcts.co.kr/CSMSWeb/SmsService.asmx/';
//var ws_url2 = 'http://192.168.0.46/CSMSWeb/SmsService.asmx/';

var pageBase = "/android_asset/www/html/"; //화면절대경로

var  isDone = "A"; //미처리 A, 처리완료 B
var  isSearch = ""; //조회했는지 여부

var code_save_sucess = "ok";
var code_save_other ="pindupl";
var code_save_fail = "fail";
var code_save_error = "error";

var text_save_sucess = "정상등록되었습니다.";
var text_save_fail = "저장실패했습니다.";
var text_save_error = "시스템 에러입니다. 다시 시도해 주세요.";
var text_save_other = "이미 사용하고 있는 사용자가 있습니다. 다시 입력하십시오.";


$(document).on("mobileinit", function(){
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    $.mobile.loadingMessage = "Loading...";
    $.mobile.loadingMessageTextVisible = true;

    $.mobile.pageLoadErrorMessage = "페이지가 존재하지 않습니다.";

    $.mobile.defaultPageTransition = 'slide';
    $.mobile.defaultDialogTransition = 'slide';
    $.mobile.page.prototype.options.domCache = true;
    /*
    $.mobile.page.prototype.options.backBtnText = "이전";
    $.mobile.page.prototype.options.backBtnTheme = "a";
    $.mobile.page.prototype.options.addBackBtn = true;
    */
    // 깜박거림 문제해결
    var ua = navigator.userAgent;
    if( ua.indexOf("Android") != -1 ){
        var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
        if (androidversion < 4)
        {
            $.mobile.defaultPageTransition = 'none';
            $.mobile.defaultDialogTransition = 'none';
        }
    }
});

// 디바이스 준비 초기화
function onDeviceReady() {
    log("deviceready");

    // 카메라 설정초기화
    if(navigator.camera != undefined ) {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

        cameraOptions = {
            quality: 20,
            sourceType: pictureSource.CAMERA,
            destinationType: destinationType.FILE_URI,
            //destinationType: destinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true,
            saveToPhotoAlbum: true
        };
    }

    // 뒤로가기 버튼설정
    document.addEventListener("backbutton", onPressBack, true);
}
document.addEventListener("deviceready", onDeviceReady, false);

function exitApp() {
    log("Logout app");

    //localStorage.removeItem("SchComList-OK");

    if(navigator.app == undefined )
        log("exitApp");
    else
      navigator.app.exitApp();
}
function goBack() {
  history.back();
  return false;
}
function onPressBack(e) {
    if($.mobile.activePage.is('#Main') || $.mobile.activePage.is('#Login')) {
        if(navigator.notification)
          navigator.notification.confirm("앱을 종료하시겠습니까?", function(result){ if(result == 2){ exitApp(); } }, '종료', '취소, 종료');
        else {
          alert("앱을 종료합니다.");
          exitApp();
        }
    } else {
        goBack();
    }
}

// 메인화면 메뉴클릭
var goNotDone = function(){
//debugger;
    SetRcvIdx("");
     isDone = "A";
    //PageNonChange("html/NotDoneList.html");
    PageNonChange("NotDoneList.html");
};
var goDone = function(){
//debugger;
    SetRcvIdx("");
    isDone = "B";
    //PageNonChange("html/DoneList.html");
    PageNonChange("DoneList.html");
};

var goAsst= function(){
     isDone = "C";
    //PageNonChange("html/DoneList.html");
    PageNonChange("AsstMain.html");
  };

var goChange= function(){
     isDone = "C";
    //PageNonChange("html/DoneList.html");
    PageNonChange("AsstChgMain.html");
  };


function getAJAX(url, data, successFnc) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFnc,
        error: function(e){
        },
    });
}



/// 파일업로드 전송처리
function uploadFile(recFile, fleNm, callback){
//alert(recFile);
    var url = 'http://cs.drcts.co.kr/WSCSMS/CaptureSave.aspx';

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fleNm;
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {Connection: "close"};

    var sucess_pic = function(result) {
        var xmlDoc = $( $.parseXML( result.response ) );
        var code = xmlDoc.find( "string" ).text();
        log("sucess_pic - " + code);
    };

    var err_pic = function faildFileUpload(error) {
        switch (error.code) {
            case FileTransferError.FILE_NOT_FOUND_ERR:
                alert("에러:파일이 존재하지 않습니다.");
                break;
            case FileTransferError.INVALID_URL_ERR:
                alert("에러:파일 URL이 존재하지 않습니다.");
                break;
            case FileTransferError.CONNECTION_ERR:
                alert("에러:네트워크 오류입니다.");
                break;
            case FileTransferError.ABORT_ERR:
                alert("에러:기타 오류입니다.");
                break;
            case FileTransferError.NOT_MODIFIED_ERR:
                alert("에러:기타 오류입니다.");
                break;
        }
    };


    //파일전송
    var ft = new FileTransfer();
    ft.upload(recFile, url, sucess_pic, err_pic, options);



    //콜백처리
    if(  typeof callback === "function"){
        callback();
    }
}


/// 파일업로드 전송처리
function uploadAsstFile(recFile, fleNm, callback){
//alert(recFile);
    //실서버
    var url = 'http://cs.drcts.co.kr/WSCSMS/AsstPhotoSave.aspx';
    //개발서버
    //var url = 'http://1.221.243.162:7878/WSCSMS/AsstPhotoSave.aspx';

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fleNm;
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {Connection: "close"};

    var sucess_pic = function(result) {
        var xmlDoc = $( $.parseXML( result.response ) );
        var code = xmlDoc.find( "string" ).text();
        log("sucess_pic - " + code);
    };

    var err_pic = function faildFileUpload(error) {
        switch (error.code) {
            case FileTransferError.FILE_NOT_FOUND_ERR:
                alert("에러:파일이 존재하지 않습니다.");
                break;
            case FileTransferError.INVALID_URL_ERR:
                alert("에러:파일 URL이 존재하지 않습니다.");
                break;
            case FileTransferError.CONNECTION_ERR:
                alert("에러:네트워크 오류입니다.");
                break;
            case FileTransferError.ABORT_ERR:
                alert("에러:기타 오류입니다.");
                break;
            case FileTransferError.NOT_MODIFIED_ERR:
                alert("에러:기타 오류입니다.");
                break;
        }
    };


    //파일전송
    var ft = new FileTransfer();
    ft.upload(recFile, url, sucess_pic, err_pic, options);



    //콜백처리
    if(  typeof callback === "function"){
        callback();
    }
}


function uploadSignFile(recFile, fleNm, callback){
     //실서버
    var url = 'http://cs.drcts.co.kr/WSCSMS/SignSave.aspx';
     //개발
    //var url = 'http://1.221.243.162:7878/WSCSMS/SignSave.aspx';

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fleNm;
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {Connection: "close"};

    var sucess_pic = function(result) {
        var xmlDoc = $( $.parseXML( result.response ) );
        var code = xmlDoc.find( "string" ).text();
        log("sucess_pic - " + code);
    };

    var err_pic = function faildFileUpload(error) {
        switch (error.code) {
            case FileTransferError.FILE_NOT_FOUND_ERR:
                alert("에러:파일이 존재하지 않습니다.");
                break;
            case FileTransferError.INVALID_URL_ERR:
                alert("에러:파일 URL이 존재하지 않습니다.");
                break;
            case FileTransferError.CONNECTION_ERR:
                alert("에러:네트워크 오류입니다.");
                break;
            case FileTransferError.ABORT_ERR:
                alert("에러:기타 오류입니다.");
                break;
            case FileTransferError.NOT_MODIFIED_ERR:
                alert("에러:기타 오류입니다.");
                break;
        }
    };


    //파일전송
    var ft = new FileTransfer();
    ft.upload(recFile, url, sucess_pic, err_pic, options);



    //콜백처리
    if(  typeof callback === "function"){
        callback();
    }
}


/// 파일업로드 전송처리
function uploadWSSignFile(recFile, fleNm, callback){
//alert(recFile);
    //실서버
    var url = 'http://wel.pcasset.drcts.com/nWELSWeb/InstSignSave.aspx';
    //개발서버
    //var url = 'http://192.168.0.51/nWELSWeb/InstSignSave.aspx';

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fleNm;
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {Connection: "close"};

    var sucess_pic = function(result) {
        var xmlDoc = $( $.parseXML( result.response ) );
        var code = xmlDoc.find( "string" ).text();
        log("sucess_pic - " + code);
    };

    var err_pic = function faildFileUpload(error) {
        switch (error.code) {
            case FileTransferError.FILE_NOT_FOUND_ERR:
                alert("에러:파일이 존재하지 않습니다.");
                break;
            case FileTransferError.INVALID_URL_ERR:
                alert("에러:파일 URL이 존재하지 않습니다.");
                break;
            case FileTransferError.CONNECTION_ERR:
                alert("에러:네트워크 오류입니다.");
                break;
            case FileTransferError.ABORT_ERR:
                alert("에러:기타 오류입니다.");
                break;
            case FileTransferError.NOT_MODIFIED_ERR:
                alert("에러:기타 오류입니다.");
                break;
        }
    };


    //파일전송
    var ft = new FileTransfer();
    ft.upload(recFile, url, sucess_pic, err_pic, options);



    //콜백처리
    if(  typeof callback === "function"){
        callback();
    }
}




function SetNaviTitle(title) {
  $("[data-role='header'] h1").text(title);
}
function GetNaviTitle() {
  return $("[data-role='header'] h1").text();
}






/// 컨텍스트변수 저장

// 세션정보
function SetUserId(value) { localStorage.setItem("USER_ID", value); }
function GetUserId() { return localStorage.getItem("USER_ID"); }
function SetUserNm(value) { localStorage.setItem("USER_NM", value); }
function GetUserNm() { return localStorage.getItem("USER_NM"); }
function SetUserAuth(value) { localStorage.setItem("USER_AUTH", value); }
function GetUserAuth() { return localStorage.getItem("USER_AUTH"); }
function SetUserGbn(value) { localStorage.setItem("USER_GBN", value); }
function GetUserGbn() { return localStorage.getItem("USER_GBN"); }

function SetUserPW(value) { localStorage.setItem("USER_PW", value); }
function GetUserPW() { return localStorage.getItem("USER_PW"); }

function SetUserAutoLogin(value) { localStorage.setItem("AUTO_LOGIN", value); }
function GetUserAutoLogin() { return localStorage.getItem("AUTO_LOGIN"); }
function SetUserSaveLogin(value) { localStorage.setItem("SAVE_INFO", value); }
function GetUserSaveLogin() { return localStorage.getItem("SAVE_INFO"); }

function SetComCd(value) { localStorage.setItem("COM_CD",value); }
function GetComCd() { return localStorage.getItem("COM_CD"); }

function SetComNm(value) {localStorage.setItem("COM_NM",value); }
function GetComNm() { return localStorage.getItem("COM_NM"); }

function SetGijumCd(value) { localStorage.setItem("GIJUM_CD",value); }
function GetGijumCd() {return localStorage.getItem("GIJUM_CD"); }

function SetGijumNm(value) { localStorage.setItem("GIJUM_NM",value); }
function GetGijumNm() {return localStorage.getItem("GIJUM_NM"); }

function SetComType(value) { localStorage.setItem("COM_TYPE", value); }
function GetComType() { return localStorage.getItem("COM_TYPE");}
//페이지전달 파라미터
function SetRcvIdx(value) { localStorage.setItem("RCV_IDX", value); }
function GetRcvIdx() { return localStorage.getItem("RCV_IDX"); }

function SetPcIdx(value) { localStorage.setItem("PC_IDX",value); }
function GetPcIdx() {return localStorage.getItem("PC_IDX"); }

function SetPcSn(value) { localStorage.setItem("PC_SN", value); }
function GetPcSn() {return localStorage.getItem("PC_SN"); }

function SetPcNum(value) {localStorage.setItem("PC_NUM", value); }
function GetPcNum() {return localStorage.getItem("PC_NUM"); }

function SetSchTxt(value) {localStorage.setItem("SCH_TXT", value); }
function GetSchTxt() {return localStorage.getItem("SCH_TXT"); }






function RemoveUserLoginInfo() {
    SetUserId("");
    SetUserPW("");
}


