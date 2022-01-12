var last_file_url = "";//마지막파일url

$(document).on('pageinit', "#RefPhoto",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#RefPhoto",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

    SetNaviTitle("관련사진");
    initRefPhoto();

    //초기조회
    $("#imgPhoto").remove();
    $("#divImg").append("<img id='imgPhoto' src='' alt='' vspace='50' />");
    wsPhotoList(GetRcvIdx(), function(){
    log("last_file_url - " + last_file_url);
        //마지막파일로 썸네일표시
        $("#imgPhoto").attr("src",last_file_url);
    });
});

$(document).on('pagehide', "#RefPhoto",function () {
    $("#RefPhoto").remove();
});

//초기화
function initRefPhoto() {
    last_file_url = "";

    // 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnTakePic").prop("disabled", true).addClass("ui-state-disabled");
    }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
        $("#btnTakePic").prop("disabled", false).removeClass("ui-state-disabled");
    }


    $("#btnRefPhoto").click(function(){
        PageNonChange("ReqCtnt.html");
    });

}



// 사진촬영
function takePicture() {

    if(navigator.camera == undefined ) {
      //log("navigator.camera not defined ....");
      return;
    }
    navigator.camera.getPicture(
        function(imgURL) {
            var image = id('imgPhoto');
            image.src = imgURL;
            //image.setAttribute("data-fix", "yes");
            var fleNm = imgURL.substring(imgURL.lastIndexOf("/")+1);
            var svc_fleNm = GetRcvIdx() + "_" + getTime() +".jpg"; //서버로 전송되는 파일명


            // 0.파일 서버로 전송
            uploadFile(imgURL, svc_fleNm, function(){

                // 1.사진정보 웹서비스 저장
                wsPhotoFile(GetRcvIdx(), svc_fleNm, function(){

                    // 2.사진목록 리스트 재조회
                    wsPhotoList(GetRcvIdx());

                });
            });


        },
        function(err) {
            //log('takePicture Fail because: ' + err);
        },
        cameraOptions
    );
}




var delFile = function(fleIdx, fleNm){

    var file_url = "http://cs.drcts.co.kr/CSMSWeb/Data/" + GetRcvIdx() + "/" + fleNm;

     if(isDone == "B"){
        //섬네일변경
        try{
            $("#imgPhoto").attr("src",file_url);
        }catch(e){
            //log("image src not found...");
        }
        return;
    }

    if(confirm("파일을 삭제하시겠습니까?")) {
        //파일삭제
        wsDelFile(fleIdx, function(){
            //재조회
            wsPhotoList(GetRcvIdx(), function(){
              //마지막파일로 썸네일표시
              $("#imgPhoto").attr("src",last_file_url);
            });
        });
    }
    else{
        //섬네일변경
        try{
            $("#imgPhoto").attr("src",file_url);
        }catch(e){
            //log("image src not found...");
        }
        return;
    }
};




/// 사진정보 웹서비스 저장 ////////////////////////////////////////////
function wsPhotoFile(rcvIdx, fleNm, callback) {
    var url = ws_url + 'Save_File_Info';
    var data = "{userId:'" + GetUserId() + "', rcvIdx:'" + rcvIdx +  "', fleCd:'F00007', fleNm:'" + fleNm + "'}";

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



/// 사진파일리스트 웹서비스 ///////////////////////////////////////////
function wsPhotoList(rcvIdx, callback) {
    var url = ws_url + 'GetFileList';

    var data = "{rcvIdx:'" + rcvIdx + "'}";

    var sucess = function(json){

        var list = $("#list_photo");
        list.children().remove();

        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }


        $.each(Table, function(key, val){

            var FLE_IDX = val.FLE_IDX; //
            var FLE_NM = val.FLE_NM ; //

            var rslt = $("<li data-icon='delete' abbr='{0}'><a href='#' >{1}</a></li>".format(FLE_IDX, FLE_NM));
            rslt.on("click", function(e){
                e.preventDefault();
                delFile(FLE_IDX, FLE_NM);
            });

            list.append(rslt);
            last_file_url = "http://cs.drcts.co.kr/CSMSWeb/Data/" + rcvIdx + "/" + FLE_NM;
        });

        $("#list_photo").listview( "refresh" );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}


/// 사진파일 삭제 웹서비스 ///////////////////////////////////////////
function wsDelFile(fleIdx, callback){

    var url = ws_url + 'DelFileInfo';
    var data = "{fleIdx:'" + fleIdx+ "'}";

    var sucess = function(json){

        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}
