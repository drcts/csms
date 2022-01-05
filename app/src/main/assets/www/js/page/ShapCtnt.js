var parameter;

$(document).on('pageinit', "#ShapCtnt",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#ShapCtnt",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;

if($(this).data("url").indexOf("?") != -1){
var parameters = $(this).data("url").split("?")[1];
parameter = parameters.replace("parameter=","");
    //alert(parameter);
}

    SetNaviTitle("처리결과등록");


    //정보조회
    wsShapReqInfo(GetRcvIdx(), function(){
            //화면초기화
            var buttonPicker2 =$("#RSLT_DD1").mobipick();
                buttonPicker2.on( "change", function() {
                  var date = $( this ).val();
                  $("#RSLT_DD1").val(date);
                });

            initShapCtnt();
            //초기조회
            $("#imgPhoto").remove();
            $("#divImg").append("<img id='imgPhoto' src='' alt='' vspace='50' />");
            wsShapPhotoList(GetRcvIdx(), function(){
            log("last_file_url - " + last_file_url);
                //마지막파일로 썸네일표시
                $("#imgPhoto").attr("src",last_file_url);
            });
            gfn_endLoading();
    });

});

$(document).on('pagehide', "#ShapCtnt",function () {
    $("#ShapCtnt").remove();
});

function initShapCtnt() {

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


    $("#btnShapCall").click(function(e){
            e.preventDefault();

            var hpno = $("#phoneNo").val();
            document.location.href = "tel:" + hpno;
            /*

                    if(!gfn_isValidHp(hpno) || !gfn_isValidTel(hpno)){
                        alert("잘못된 전화번호입니다.");
                    return;
                }
                else{
                    document.location.href = "tel:" + hpno;
                }
        */
    });

    /// 조치결과 저장하고 재조회
        $("#btnSaveShap").click(function(e){
           e.preventDefault();
           wsSetShapRsltInfo(GetRcvIdx(), function(){

                wsShapReqInfo(GetRcvIdx(), function(){

                    var buttonPicker2 =$("#RSLT_DD1").mobipick();
                    buttonPicker2.on( "change", function() {
                      var date = $( this ).val();
                      $("#RSLT_DD1").val(date);
                    });
                });
               gfn_endLoading();
               alert("저장되었습니다.");
           });
       });

//이전버튼
    $("#btnShapCtnt").click(function(){
        if( isDone == "B" ){
                PageNonChange("DoneList.html");
        }
        else{
             if(!fn_isNull(parameter)){
                ParamPageChange("NotDoneList.html",parameter);
             }else{
                PageNonChange("NotDoneList.html");
             }
        }
    });
}


// 사진촬영
function ShapCtntTakePicture() {

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
            var svc_fleNm = "SHAP"+ "_" + GetRcvIdx() + "_" + getTime() +".jpg"; //서버로 전송되는 파일명


            // 0.파일 서버로 전송
            uploadFile(imgURL, svc_fleNm, function(){

                // 1.사진정보 웹서비스 저장
                wsShapPhotoFile(GetRcvIdx(), svc_fleNm, function(){

                    // 2.사진목록 리스트 재조회
                    wsShapPhotoList(GetRcvIdx());

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

    var file_url = "http://cs.drcts.co.kr/CSMSWeb/Data/SHAP/" + GetRcvIdx() + "/" + fleNm;

     console.log(file_url);

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
        wsShapDelFile(fleIdx, function(){
            //재조회
            wsShapPhotoList(GetRcvIdx(), function(){
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

/// 사진파일 삭제 웹서비스 ///////////////////////////////////////////
function wsShapDelFile(fleIdx, callback){

    var url = ws_url + 'ShapDelFileInfo';
    var data = "{fleIdx:'" + fleIdx+ "'}";

    var sucess = function(json){

        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}


/// 사진정보 웹서비스 저장 ////////////////////////////////////////////
function wsShapPhotoFile(rcvIdx, fleNm, callback) {
    var url = ws_url + 'ShapSave_File_Info';
    var data = "{userId:'" + GetUserId() + "', rcvIdx:'" + rcvIdx +  "', fleNm:'" + fleNm + "'}";

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
function wsShapPhotoList(rcvIdx, callback) {
    var url = ws_url + 'ShapGetFileList';

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
            last_file_url = "http://cs.drcts.co.kr/CSMSWeb/Data/SHAP/" + rcvIdx + "/" + FLE_NM;
        });

        $("#list_photo").listview( "refresh" );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}

/// 요청정보 웹서비스 //////////////////////////////////////////
function wsShapReqInfo(rcvIdx, callback) {
gfn_startLoading();
var url = ws_url + 'GetShapSvcInfo';

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

            var DISP_DD1 = fn_isNull(val.NON_RSLT_DT) ?  "" : fn_toDay(val.NON_RSLT_DT.substring(0,8)); //처리일시,
            var DISP_DD2 = fn_isNull(val.NON_RSLT_DT) ?  "" : val.NON_RSLT_DT.substring(8,10)+":"+val.NON_RSLT_DT.substring(10,12); //처리일시,
            var DISPSTAT_CD = val.RSLT_STAT_GBN;

            $("#gijumNm").val(val.GIJUM_NM);
            $("#mngrNm").val(val.MNGR_NM);
            $("#phoneNo").val(val.PHONE_NO);
            $("#reqDt").val(val.RCV_DT);

            $("#prodNm").val(val.PROD_GBN_NM);
            $("#rcvTypNm").val(val.REQ_GBN_NM);
            $("#modelNm").val(val.MODEL_NM);
            $("#reqCmnt").val(val.REQ_CMNT);

            if(DISPSTAT_CD == "02")
                $("#RSLTSTAT_CD_02").prop("checked",true);
            else if(DISPSTAT_CD == "03")
                $("#RSLTSTAT_CD_03").prop("checked",true);
            else if(DISPSTAT_CD == "04")
                $("#RSLTSTAT_CD_04").prop("checked",true);
            else if(DISPSTAT_CD == "05")
                $("#RSLTSTAT_CD_05").prop("checked",true);
            else if(DISPSTAT_CD == "06")
                $("#RSLTSTAT_CD_06").prop("checked",true);
            else if(DISPSTAT_CD == "07")
                $("#RSLTSTAT_CD_07").prop("checked",true);
            else if(DISPSTAT_CD == "08")
                $("#RSLTSTAT_CD_08").prop("checked",true);
            else
                $("#RSLTSTAT_CD_01").prop("checked",true);

            $("input[name='RSLTSTAT_CD']").checkboxradio("refresh");

             $("#RSLT_DD1").val(DISP_DD1);
             $("#RSLT_DD2").val(DISP_DD2);
             $("#rsltCmnt").val(val.RSLT_CMNT);
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


/// 기본정보 웹서비스 저장 ////////////////////////////////////////////
function wsSetShapRsltInfo(rcvIdx, callback) {
    gfn_startLoading();


    var url = ws_url + 'SetShapRsltSave';
    var data = "{svcIdx:'" + rcvIdx
            + "', rsltStatGbn:'" + getRadioValue("RSLTSTAT_CD")
            + "', rsltDt:'" + $("#RSLT_DD1").val().replace(/-/g,"") + $("#RSLT_DD2").val().replace(/:/g,"")
            + "', rsltCmnt:'" + $("#rsltCmnt").val()
            + "', revId:'" + GetUserId()
            + "'}";
    log("data - " + data);
    // 조건체크



     if(fn_isNull($("#RSLT_DD1").val())){
         alert("처리일자를 입력해주세요");
         gfn_endLoading();
         return;
     }

     if(fn_isNull($("#RSLT_DD2").val())){
          alert("처리시간을 입력해주세요");
          gfn_endLoading();
          return;
      }

    if(fn_isNull($("#rsltCmnt").val())){
        alert("처리내역을 입력해주세요");
       gfn_endLoading();
        return;
    }


    if(!confirm("저장하시겠습니까?"))
    {
        gfn_endLoading();
        return;
    }

    var sucess = function(json) {

        if(json.d == "error"){
            alert("저장실패! 관리자에게 문의하세요" );
            gfn_endLoading();
            return;
        }

        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            gfn_endLoading();
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



