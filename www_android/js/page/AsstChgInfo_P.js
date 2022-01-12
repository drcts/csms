$(document).on('pageinit', "#AsstChgInfo_P",function (e) {
    e.preventDefault();
});
$(document).on('pagebeforeshow', "#AsstChgInfo_P",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle(GetComNm()+" - "+GetGijumNm());
    isDone = "C";
    wsCodePopList("PCST", "#PCST_CD", "#PCST_CD_Popup", "RDO_PCST_CD", "장비상태", false, function(){
        wsAsstChgInfo_P(GetPcIdx(), function(){
            initAsstChgInfo_P();
        });
    });
    //초기조회
    $("#imgPhoto").remove();
    $("#divImg").append("<img id='imgPhoto' src='' alt='' vspace='50' />");
    wsAsstPhotoList(GetPcIdx(), function(){
            log("last_file_url - " + last_file_url);
                //마지막파일로 썸네일표시
                $("#imgPhoto").attr("src",last_file_url);

            });
});

$(document).on('pagehide', "#AsstChgInfo_P",function () {
    $("#AsstChgInfo_P").remove();
});

var initAsstChgInfo_P = function() {
last_file_url = "";
// 화면모드처리
     if(isDone == "B"){
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='photo']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
        //$("#btnAsstTakePic").prop("disabled", false).addClass("ui-state-disabled");
    }
    else if(isDone == "C"){
             $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
             $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
             $(" a[data-icon='photo']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
             $(" a[data-icon='photo']").addClass("ui-btn-active").addClass("ui-state-persist");
            //$("#btnAsstTakePic").prop("disabled", true).addClass("ui-state-disabled");
        }
    else{
         $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='photo']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
         $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
       //$("#btnAsstTakePic").prop("disabled", false).addClass("ui-state-disabled");
    }

    //이전버튼
        $("#btnAsstChgInfo_P").click(function(){
             PageNonChange("AsstGJChgList.html");
        });

    // 품명클릭 이벤트 처리
         $("input[name='RDO_MDLC_CD']").bind( "change", function(event, ui) {
             // 선택항목 표시
             var input_txt =$("#MDLC_CD");
             input_txt.text($(this).attr("abbr"));
             input_txt.val($(this).val());
             $("#MDLC_CD_Popup").popup('close');

         });

}

/// 자산정보 웹서비스 //////////////////////////////////////////
function wsAsstChgInfo_P(pcIdx, callback) {
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
            var PC_NUM = val.PC_NUM;
            var PC_SN = val.PC_SN;
            var PC_MODEL = val.PC_MODEL;
            var YYYYMM = val.YYYYMM;
            var CPU = val.CPU;
            var SSD = val.SSD;
            var HDD = val.HDD;
            var RAM = val.RAM;
            var MONTR1 = val.MONTR1;
            var MONTR2 = val.MONTR2;
            var PC_NAME = val.PC_NAME;
            var OS = val.OS;
            var ASST_STICK_YN = val.ASST_STICK_YN;
            var VAC_END_DD = val.VAC_END_DD;
            var IP = val.IP;
            var ETC = val.ETC;
            var IE_VER = val.IE_VER;
            var OFFICE = val.OFFICE;
            var VAC_NM = val.VAC_NM;
            var HANGUL = val.HANGUL;
            var OS_LCS = val.OS_LCS;
            var OFFICE_LSC = val.OFFICE_LSC;
            var PC_USE_STATUS = val.PC_USE_STATUS;



            $("#partNm").val(PART_NM);
            $("#userNm").val(USER_NM);
            $("#floor").val(FLOOR);
            setRadioValue("#MDLC_CD", "RDO_MDLC_CD", PC_TYPE);
            $("#txtPcNum").val(PC_NUM);
            $("#txtPcSn").val(PC_SN);
            $("#txtPcModel").val(PC_MODEL);
            $("#txtYyyyMm").val(YYYYMM);

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

            if(val.PC_STATUS == "C")//설치완료
                $("#btnPhotoSaveProcChg").prop("disabled", true);
           });
               //콜백처리
               if(  typeof callback === "function"){
                   callback();
               }
    };

    getAJAX(url, data, sucess);
}

// 사진촬영
function AsstChgTakePicture() {
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
                wsAsstPhotoFile(GetPcIdx(), svc_fleNm, function(){

                    // 2.사진목록 리스트 재조회
                    wsAsstPhotoList(GetPcIdx());

                });
            });


        },
        function(err) {
            //log('takePicture Fail because: ' + err);
        },
        cameraOptions
    );
}


//실사완료 저장
var savePhotoAsstChgInfo = function(){
    if($("#txtPcSn").val().trim() == "")
    {
        alert("설치완료된 자산의 S/N을 입력해주십시오.");
        $("#txtPcSn").focus();
        return;
    }
    else if($("#imgPhoto").attr("src").trim() == "")
    {
         alert("설치완료된 자산의 S/N을 사진찍어주십시오.");
         return;
    }
    else
    {
      if(!confirm("해당 자산의 정보를 저장하고 설치완료 하시겠습니까?")) return;
        wsSetPhotoAsstChgInfo(GetPcIdx(), function(){
            alert("설치완료 되었습니다.");
            //재조회
            wsAsstChgInfo_P(GetPcIdx(), function(){
                 wsAsstPhotoList(GetPcIdx(), function(){
                   //마지막파일로 썸네일표시
                   $("#imgPhoto").attr("src",last_file_url);

                   PageNonChange("AsstGJChgList.html");
                 });
            });

        });
    }
};

/////////// 실사내용 저장
function wsSetPhotoAsstChgInfo(pcIdx, callback){

    var url = ws_url + 'SetSavePhotoAsstChgInfo';
        var data = "{ pcIdx:'" + GetPcIdx()
                + "', comCd:'" + GetComCd()
                + "', gijumCd:'" + GetGijumCd()
                + "', pcSn:'" + $("#txtPcSn").val()
                + "', pcNum:'" + $("#txtPcNum").val()
                + "', partNm:'" + $("#partNm").val()
                + "', userNm:'" + $("#userNm").val()
                + "', floor:'" + $("#floor").val()
                + "', pcType:'" + $("#MDLC_CD").val()
                + "', pcModel:'" + $("#txtPcModel").val()
                + "', yyyyMm:'" + $("#txtYyyyMm").val().replace(/-/g,"")
                + "', pcUseStatus:'" + getRadioValue("RDO_PCST_CD")
                + "', pcStatus:'C', regId:'" + GetUserId()+ "'}";
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

var fn_chg_sn_scan = function(){

   cordova.plugins.barcodeScanner.scan(
      function (result) {
        var SN = result.text;
        var FMT = result.format;
        var CAN = result.cancelled;

        $("#txtPcSn").val(SN);


      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}