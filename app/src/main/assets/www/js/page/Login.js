$(document).on('pageshow', "#Ready", function (e) {
    e.preventDefault();
    $.mobile.changePage("#Login");
    //PageNonChange("#Login");

});

$(document).on('pageinit', "#Login", function (e) {
    e.preventDefault();

    var screen = $.mobile.getScreenHeight();
    var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
    var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
    var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
    var content = screen - header - footer - contentCurrent;
    $(".ui-content").outerHeight(content);

    $( "#btLogin" ).on("click", function() {
        e.preventDefault();
        onLogIn();
    });

    //프린터출력
    $( "#divTitle" ).on("click", function() {
        //        e.preventDefault();
        //        cordova.plugins.web_call.printMethod('Alsokyun',function(ret){
        //            alert('success - ' + ret);
        //        },function(err){
        //            alert('error - ' + err);
        //        });


    });

    $('#cbSaveInfo').on("change", function(event, ui) {
        if(this.checked == true) {
          SetUserId( $("#txUserId").val());
          SetUserPW( $("#txUserPW").val());
          SetUserSaveLogin("yes");
        }
        else {
          RemoveUserLoginInfo();
          SetUserSaveLogin("no");
        }
    });

    $('#cbAutoLogin').on("change", function(event, ui) {
        if(this.checked == true) {
            SetUserId( $("#txUserId").val());
            SetUserPW( $("#txUserPW").val());
            SetUserAutoLogin("yes");
        }
        else
          SetUserAutoLogin("no");
    });

    $(document).off("pageinit", "#Login");
});

$(document).on('pagebeforeshow', "#Login",function () {

});

$(document).on('pageshow', "#Login",function () {
    //navigator.splashscreen.hide();
    //log("pageshow login");


    /*
    0.업데이트여부처리
    */
    var url = ws_url + 'Select_Code_List';
    var data = "{clsCd:'PRGM'}";
    getAJAX(url, data, function(ret){
        //alert('ret = ' + ret);
        var versionCode = "10010";
        try{
            versionCode = JSON.parse(ret.d).Table[0].codeNm;
        }catch(e){}

        // 안드로이드 브리지호출
        cordova.plugins.web_call.checkMethod([versionCode],function(ret){

            if(ret == 'Y'){
                //1.로그인페이지 로딩처리
                onInitLogin();
            }
            else{
                //2.버전체크실패... 앱종료?
                alert('버전체크실패.. 관리자에게 문의하세요');
           }
        },function(err){
            alert('checkMethod error - ' + err);
        });
    });


});

function onInitLogin() {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetRcvIdx("");
     isDone = "A";


    $('#txUserId').val("");
    $('#txUserPW').val("");

    var userId = GetUserId();
    var userPw = GetUserPW();
    var autoLogin = GetUserAutoLogin();
    var saveInfo = GetUserSaveLogin();

    $("#cbSaveInfo").prop("checked", false).checkboxradio('refresh');;
    $("#cbAutoLogin").prop("checked", false).checkboxradio('refresh');;

    if(autoLogin != null && autoLogin == "yes") {
        $('#txUserId').val(userId);
        $('#txUserPW').val(userPw);
        $("#cbAutoLogin").prop("checked", true).checkboxradio('refresh');
    }
    if(saveInfo != null && saveInfo == "yes") {
        $('#txUserId').val(userId);
        $('#txUserPW').val(userPw);
        $("#cbSaveInfo").prop("checked", true).checkboxradio('refresh');
    }

    if(autoLogin == "yes")
      onLogIn();
}




/*웹서비스 ---------------------------------------------------------------*/
function onLogIn() {

    var username=$("#txUserId").val();
    var password=$("#txUserPW").val();

    if(username == "" && password == "")
      alert("ID, 비밀번호를 입력해 주세요!");
    else if(username == "")
      alert("ID를 입력해 주세요!");
    else if(password == "")
      alert("비밀번호를 입력해 주세요!");

    if(username != "" && password != "") {

      var url = ws_url + 'Check_Join_System';
      var data = "{userId:'" + username + "', userPw:'"+password+"'}";

      var sucess = function(json) {

          var root = JSON.parse(json.d);
          var RtnCode = root.RtnCode;
          var UserId = root.UserId; //사용자 ID
          var UserNm = root.UserNm;
          var UserAuth = root.UserAuth; //권한값
          var UserGbn = root.UserGbn; //회사구분값

          if(RtnCode == "1" ) {
              SetUserId(UserId);
              SetUserNm(UserNm);
              SetUserAuth(UserAuth);
              SetUserGbn(UserGbn);

              //PageNonChange("#Main");
              $.mobile.changePage("#Main");

          }
          else {
              showErrorMessage(RtnCode);
          }
      };
      getAJAX(url, data, sucess);
    }
}


function showErrorMessage(RtnCode)
{
    if(RtnCode == "-2") {
        alert("비밀번호를 확인해 주세요!");
    }
    else if(RtnCode == "-1") {
        alert("ID를 확인해 주세요!");
    }
    else if(RtnCode == "3") {
        alert("시스템 점검중입니다. 관리자에게 문의하십시오!");
    }
    else if(RtnCode == "4") {
        alert("권한이 없습니다. 관리자에게 문의하십시오!");
    }
    else{
        alert(".에러코드 : " + RtnCode);
    }

    pageRefrash();
}
function pageRefrash() {
    //RefreshCurrentPage();

    RemoveUserLoginInfo();

    $('#txUserId').val("");
    $('#txUserPW').val("");
}
