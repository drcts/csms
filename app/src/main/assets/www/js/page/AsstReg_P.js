$(document).on('pageinit', "#AsstReg_P",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#AsstReg_P",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle(GetComNm()+" - "+GetGijumNm());

    isDone = "C";
    isSearch = "";
    wsCodePopList("PCST", "#PCST_CD", "#PCST_CD_Popup", "RDO_PCST_CD", "장비상태", false, function(){
        initAsstReg_P();
    });
    //초기조회
        $("#imgPhoto").remove();
        $("#divImg").append("<img id='imgPhoto' src='' alt='' vspace='50' />");
         var list = $("#list_photo");
            list.children().remove();
});

$(document).on('pagehide', "#AsstReg_P",function () {
    $("#AsstReg_P").remove();
});

var initAsstReg_P = function() {
SetPcIdx("");
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
        $("#btnAsstReg_P").click(function(){
            SetPcIdx("");
            SetPcSn("");
             SetPcNum("");
             PageNonChange("AsstGJList.html");
        });

    // 품명클릭 이벤트 처리
         $("input[name='RDO_MDLC_CD']").bind( "change", function(event, ui) {
             // 선택항목 표시
             var input_txt =$("#MDLC_CD");
             input_txt.text($(this).attr("abbr"));
             input_txt.val($(this).val());
             $("#MDLC_CD_Popup").popup('close');

         });

         setRadioValue("#PCST_CD", "RDO_PCST_CD", "PCST01");

        $("#btnRegAsstTakePic").prop("disabled", true).addClass("ui-state-disabled");
        $("#btnSaveProc_P").prop("disabled", true); // 초기 저장버튼을 disabled한다

}

//자사기본정보 저장
var saveAsstDefalutReg = function(){
     wsSetNewAsstInfo_P(GetPcIdx(), "T", function(){
            alert("자산 기본정보가 저장 되었습니다.");
            wsRegAsstInfo_P(GetPcIdx(), function(){
            });
     });

};

/////////// 실사내용 저장
function wsSetNewAsstInfo_P(pcIdx, statCd, callback){
    var url = ws_url + 'SetSaveNewAsstInfo';
        var data = "{ pcIdx:'" + GetPcIdx()
                + "', comCd:'" + GetComCd()
                + "', gijumCd:'" + GetGijumCd()
                + "', pcSn:'"
                + "', pcNum:'"
                + "', partNm:'" + $("#partNm").val()
                + "', userNm:'" + $("#userNm").val()
                + "', floor:'" + $("#floor").val()
                + "', pcType:'" + $("#MDLC_CD").val()
                + "', pcModel:'"
                + "', yyyyMm:'"
                + "', cpu:'"
                + "', ssd:'"
                + "', hdd:'"
                + "', ram:'"
                + "', montr1:'"
                + "', montr2:'"
                + "', pcName:'"
                + "', os:'"
                + "', asstStickYn:'"
                + "', vacEndDd:'"
                + "', ip:'"
                + "', etc:'"
                + "', ie:'"
                + "', office:'"
                + "', vac:'"
                + "', hangul:'"
                + "', osLcs:'"
                + "', offiLcs:'"
                + "', pcUseStatus:'" + getRadioValue("RDO_PCST_CD")
                + "', pcStatus:'"+statCd
                + "', regId:'" + GetUserId()+ "'}";
        log("data - " + data);

            if(fn_isNull(getRadioValue("RDO_MDLC_CD"))){
                alert("장비구분을 선택해주세요");
                return;
            }
            if(fn_isNull(getRadioValue("RDO_PCST_CD"))){
                alert("장비상태를 선택해주세요");
                return;
            }

            var sucess = function(json) {

                if(json.d == "error")   return;

                var list = [];
                try{
                    list = JSON.parse(json.d);
                }catch(e){
                    return;
                }

                SetPcIdx(list.RtnCode);
                $("#btnSaveDefault_P").prop("disabled", true);

                //콜백처리
                if(  typeof callback === "function"){
                    callback();
                }


            };

            getAJAX(url, data, sucess);
}

/// 자산정보 웹서비스 //////////////////////////////////////////
function wsRegAsstInfo_P(pcIdx, callback) {
var url = ws_url + 'GetGijumAsstInfo';

    var data = "{comCd:'" + GetComCd() + "', pcIdx:'"+pcIdx+"'}";

    var sucess = function(json){

            // 1.기본정보
            var Table = [];
            try{
                Table = JSON.parse(json.d).Table;
            }catch(e){
                return;
            }

            $.each(Table, function(key, val){
            var PART_NM = val.PART_NM;
            var USER_NM = val.USER_NM;
            var FLOOR = val.FLOOR;
            var PC_TYPE = val.PC_TYPE;
            var PC_USE_STATUS = val.PC_USE_STATUS;


            $("#partNm").val(PART_NM);
            $("#userNm").val(USER_NM);
            $("#floor").val(FLOOR);
            setRadioValue("#MDLC_CD", "RDO_MDLC_CD", PC_TYPE);
            var input_txt =$("#MDLC_CD");
             input_txt.val(PC_TYPE);

            if(PC_USE_STATUS != "" && !fn_isNull(PC_USE_STATUS))
            {
                setRadioValue("#PCST_CD", "RDO_PCST_CD", PC_USE_STATUS);
                //alert('1');
//                var input_txt1 =$("#PCST_CD");
//                input_txt1.val(PC_USE_STATUS);
            }
            else
            {
                setRadioValue("#PCST_CD", "RDO_PCST_CD", "PCST01");
                //alert('2');
//                var input_txt1 =$("#PCST_CD");
//                input_txt1.val("PCST01");
            }

            if(val.PC_STATUS == "C")//실사완료
            {
                $("#btnSaveProc_P").prop("disabled", true);
                $("#btnRegAsstTakePic").prop("disabled", true).addClass("ui-state-disabled");
            }
            else{
                $("#btnSaveProc_P").prop("disabled", false);
                $("#btnRegAsstTakePic").prop("disabled", false).removeClass("ui-state-disabled");
            }
            });


           //콜백처리
           if(  typeof callback === "function"){
               callback();
           }
    };

    getAJAX(url, data, sucess);
}


// 사진촬영
function RegAsstTakePicture() {
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
            var svc_fleNm = GetGijumCd() + "_" +GetPcIdx() + "_" + getTime() +".jpg"; //서버로 전송되는 파일명

            //alert(svc_fleNm);
            // 0.파일 서버로 전송
            uploadAsstFile(imgURL, svc_fleNm, function(){

                // 1.사진정보 웹서비스 저장
                wsAsstPhotoFileReg(GetPcIdx(), svc_fleNm, function(){

                    // 2.사진목록 리스트 재조회
                    wsAsstPhotoListReg(GetPcIdx());

                });
            });


        },
        function(err) {
            //log('takePicture Fail because: ' + err);
        },
        cameraOptions
    );
}

/// 사진정보 웹서비스 저장 ////////////////////////////////////////////
function wsAsstPhotoFileReg(pcIdx, fleNm, callback) {
    var url = ws_url + 'Asst_Save_File_Info';
    var data = "{userId:'" + GetUserId() + "', pcIdx:'" + pcIdx + "', fleNm:'" + fleNm + "'}";

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
function wsAsstPhotoListReg(pcIdx, callback) {
    last_file_url = "";
    var url = ws_url + 'GetAsstFileList';

    var data = "{pcIdx:'" + pcIdx + "', gijumCd:'" + GetGijumCd() + "'}";

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
                delAsstFileReg(FLE_IDX, FLE_NM);
            });

            list.append(rslt);
            //실서버
            last_file_url = "http://cs.drcts.co.kr/CSMSWeb/Data/Asst/"+GetGijumCd()+ "/" + pcIdx + "/" + FLE_NM;
            //개발서버
            //last_file_url = "http://1.221.243.162:7878/CSMSWeb/Data/Asst/"+GetGijumCd()+ "/" + pcIdx + "/" + FLE_NM;
        });

        $("#list_photo").listview( "refresh" );


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}

var delAsstFileReg = function(fleIdx, fleNm){

    //실서버
    var file_url = "http://cs.drcts.co.kr/CSMSWeb/Data/Asst/"+GetGijumCd()+ "/" + GetPcIdx() + "/" + fleNm;
    //개발서버
    //var file_url = "http://1.221.243.162:7878/CSMSWeb/Data/Asst/"+GetGijumCd()+ "/" + GetPcIdx() + "/" + fleNm;

     if(isDone == "B"){
        //섬네일변경
        try{
            $("#imgPhoto").attr("src",file_url);
        }catch(e){
            //log("image src not found...");
        }
        return;
    }

    if(confirm("사진조회는 : 취소클릭, 파일삭제는 : 확인클릭")) {
        //파일삭제
        wsAsstDelFileReg(fleIdx, function(){
            //재조회
            wsAsstPhotoListReg(GetPcIdx(), function(){
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
function wsAsstDelFileReg(fleIdx, callback){

    var url = ws_url + 'DelAsstFileInfo';
    var data = "{fleIdx:'" + fleIdx+ "' , gijumCd:'" + GetGijumCd() + "'}";

    var sucess = function(json){

        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);
}

//실사완료 저장
var saveAsstReg_P = function(){
if($("#imgPhoto").attr("src").trim() == "")
    {
        alert("실사완료된 자산의 S/N을 사진찍어주십시오.");
        return;
    }
    else
    {

    if(!confirm("해당 자산의 실사내용을 저장하고 실사완료 하시겠습니까?")) return;
        wsSetNewAsstInfo_P(GetPcIdx(), "C", function(){
                   alert("실사완료 되었습니다.");
                               //재조회
                   wsRegAsstInfo_P(GetPcIdx(), function(){
                      wsAsstPhotoListReg(GetPcIdx(), function(){
                         //마지막파일로 썸네일표시
                         $("#imgPhoto").attr("src",last_file_url);
                       });
                   });
            });
      }
};