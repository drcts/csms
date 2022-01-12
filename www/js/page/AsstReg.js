$(document).on('pageinit', "#AsstReg",function (e) {
    e.preventDefault();
});

$(document).on('pagebeforeshow', "#AsstReg",function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle(GetComNm()+" - "+GetGijumNm());

    isDone = "C";
    isSearch = "";

    var buttonPicker1 =$("#VAC_END_DD").mobipick();
    buttonPicker1.on( "change", function() {
      var date = $( this ).val();
      $("#VAC_END_DD").val(date);
    });

    wsCodePopList("PCST", "#PCST_CD", "#PCST_CD_Popup", "RDO_PCST_CD", "장비상태", false, function(){
        initAsstReg();
    });

    //초기조회
    $("#imgPhoto").remove();
    $("#divImg").append("<img id='imgPhoto' src='' alt='' vspace='50' />");
     var list = $("#list_photo");
        list.children().remove();
});

$(document).on('pagehide', "#AsstReg",function () {
    $("#AsstReg").remove();
});


var initAsstReg = function() {
last_file_url = "";
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
        $("#btnAsstReg").click(function(){
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

        $("#btnRegAsstTakePic_1").prop("disabled", true).addClass("ui-state-disabled");
        $("#btnSaveProc").prop("disabled", true); // 초기 저장버튼을 disabled한다


        if(!fn_isNull(GetPcIdx()) && (!fn_isNull(GetPcSn()) || !fn_isNull(GetPcNum())))
        {
            isSearch = "Y";
            wsRegAsstInfo(GetPcIdx(), function(){
             });
        }
        else
        {
            setRadioValue("#PCST_CD", "RDO_PCST_CD", "PCST01");
            if(!fn_isNull(GetPcSn()))
            {
                isSearch = "Y";
                //$("#btnRegAsstTakePic_1").prop("disabled", false);
                $(".txtPcSn").val(GetPcSn());
                $(".txtPcNum").val(GetPcNum());
            }
        }
}

//자사기본정보 저장
var saveAsstDefalutReg_1 = function(){

    if(fn_isNull($("#txtPcNum").val())){
        alert("자산번호를 입력해주세요");
        $("#txtPcNum").focus();
        return;
    }

    if(fn_isNull($("#txtPcSn").val())){
        alert("SN을 입력해주세요");
        $("#txtPcSn").focus();
        return;
    }

    if(isSearch == "Y")
    {
        wsAsstDuplcate(function(val){
         if(val > 0)
           {
               alert("중복된 자산번호나 SN이 있습니다. 확인후 다시 수정하십시오.");
           }
           else
           {
                if(!confirm("해당 지점에 자산을 추가하시겠습니까?")) return;
                    wsSetNewAsstInfo(GetPcIdx(), "T", function(){
                            alert("자산 기본정보가 저장 되었습니다.");
                            wsRegAsstInfo(GetPcIdx(), function(){
                            });
                     });
           }
        });
    }
    else
    {
        alert("중복실사 방지를 위해서 SN이나 자산번호 입력후 조회해 주십시오.")
    }
};

// 사진촬영
function RegAsstTakePicture_1() {
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
//실사완료 저장
var saveAsstReg = function(){
    if($("#imgPhoto").attr("src").trim() == "")
    {
        alert("실사완료된 자산의 S/N을 사진찍어주십시오.");
        return;
    }
    else
    {
        if(!confirm("자산 실사완료 하시겠습니까?")) return;
            wsSetNewAsstInfo(GetPcIdx(), "C", function(){
                alert("자산추가 실사완료 되었습니다.");
                wsRegAsstInfo(GetPcIdx(), function(){
                   wsAsstPhotoListReg(GetPcIdx(), function(){
                    //마지막파일로 썸네일표시
                    $("#imgPhoto").attr("src",last_file_url);
                    PageNonChange("AsstGJList.html");
                  });
                });
         });
     }
};

//var chgPcNum = function(){
//        //$("#txtPcSn").val("");
//        isSearch = "";
//        $("#btnSaveProc").prop("disabled", true);
//}

var chgPcSn = function(){
        //$("#txtPcNum").val("");
        isSearch = "";
        //$("#btnSaveProc").prop("disabled", true);
}

var fn_sn_scan_reg = function(){
   SetPcIdx("");
   cordova.plugins.barcodeScanner.scan(
      function (result) {
        var SN = result.text;
        var FMT = result.format;
        var CAN = result.cancelled;

        $("#txtPcSn").val(SN);
        wsAsstSearCh(SN,  function(val){
            if(val == 0)
           {
               isSearch = "Y";
               //$("#btnSaveProc").prop("disabled", false);
               $("#txtPcSn").prop("disabled", false);
              // fnClear();
               alert("해당 SN으로 조회되는 자산내역이 없습니다.");
           }
        });

      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}

var fn_pcnum_scan_reg = function(){
//   SetPcIdx("");
   $("#txtPcSn").val("");
   cordova.plugins.barcodeScanner.scan(
      function (result) {
        var SN = result.text;
        var FMT = result.format;
        var CAN = result.cancelled;

        $("#txtPcNum").val(SN);
//        wsAsstSearCh($("#txtPcSn").val(), SN, function(val){
//
//            if(val == 0)
//            {
//                isSearch = "Y";
//                 $("#btnSaveProc").prop("disabled", false);
//                 //fnClear();
//                alert("해당 자산번호로 조회되는 자산내역이 없습니다.");
//            }
//        });

      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}

//qr스캔
var fn_qr_scan_reg = function () {
 cordova.plugins.barcodeScanner.scan(
      function (result) {
        var SN =  result.text;//"http://127.0.0.1/test.html?dept=&unm=&loc=&mdl=&ym=&ano=&ip=192.168.0.4&pcnm=DESKTOP-FG7F6L3&cpu=Intel%28R%29%20Core%28TM%29%20i7-8550U%20CPU%20%40%201.80GHz&hdd=512&ram=16&os=Microsoft%20Windows%2010%20Pro:LICENSED&ie=11.508.19041.0&offi=Office16:LICENSED &vac=AhnLab%20V3%20Lite&korn=%ED%95%9C%EC%BB%B4%EC%98%A4%ED%94%BC%EC%8A%A4%20%EB%B7%B0%EC%96%B4%209.6.1.0";
        var FMT = result.format;
        var CAN = result.cancelled;

        console.log(SN);
        var array = SN.split("?");
        var arrCode = array[1].split("&");

        for(var i=0; i<arrCode.length; i++)
        {
            var setCode = arrCode[i].split("=");
            switch(setCode[0])
            {
                case "dept":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#partNm").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "unm":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#userNm").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "loc":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#floor").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "mdl":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtPcModel").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "ym":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtYyyyMm").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "ano":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtPcNum").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "ip":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtIP").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "pcnm":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtPcName").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "cpu":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtCPU").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "hdd":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtHDD").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "ram":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtRAM").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "os":
                    var arrSetCode = setCode[1].split(":");
                    if(!fn_isNull(arrSetCode[0]))
                    {
                        $("#txtOS").val(decodeURIComponent(arrSetCode[0]));
                    }
                    if(!fn_isNull(arrSetCode[1]))
                    {
                        if(arrSetCode[1].trim() == "LICENSED")
                            $("#OS_LCS_02").prop("checked",true);
                        else
                            $("#OS_LCS_01").prop("checked",true);
                        $("input[name='OS_LCS']").checkboxradio("refresh");
                    }
                    break;
                case "ie":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtIe").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "offi":
                    var arrSetCode = setCode[1].split(":");
                    if(!fn_isNull(arrSetCode[0]))
                    {
                        $("#txtOffice").val(decodeURIComponent(arrSetCode[0]));
                    }
                    if(!fn_isNull(arrSetCode[1]))
                    {
                        if(arrSetCode[1].trim() == "LICENSED")
                            $("#OFFI_LCS_02").prop("checked",true);
                        else
                            $("#OFFI_LCS_01").prop("checked",true);
                        $("input[name='OFFI_LCS']").checkboxradio("refresh");
                    }
                    break;
                case "vac":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtVac").val(decodeURIComponent(setCode[1]));
                    }
                    break;
                case "korn":
                    if(!fn_isNull(setCode[1]))
                    {
                        $("#txtHangul").val(decodeURIComponent(setCode[1]));
                    }
                    break;
            }

        }


      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );

}

//var fn_pcnum_sch = function(){
//    SetPcIdx("");
//    var SN = $("#txtPcNum").val();
//    wsAsstSearCh($("#txtPcSn").val(), SN, function(val){
//        if(val == 0)
//        {
//            isSearch = "Y";
//             $("#btnSaveProc").prop("disabled", false);
//            // fnClear();
//            alert("해당 자산번호로 조회되는 자산내역이 없습니다.");
//        }
//    });
//}

var fn_sn_sch = function(){
    SetPcIdx("");
    var SN = $("#txtPcSn").val();
    if(SN.trim() == "")
    {
        alert("SN을 입력해 주십시오.");
    }
    else
    {
        wsAsstSearCh(SN, function(val){
            if(val == 0)
           {
               isSearch = "Y";
                //$("#btnSaveProc").prop("disabled", false);
                $("#txtPcSn").prop("disabled", false);
               alert("해당 SN으로 조회되는 자산내역이 없습니다.");
           }
        });
    }
}

/// 자산정보 웹서비스 //////////////////////////////////////////
function wsAsstSearCh(pcSn, callback) {

var url = ws_url + 'GetAsstSearch';

    var data = "{comCd:'" + GetComCd() + "', txtSch:'" + pcSn +"'}";
    //var data = "{pcSn:'" + pcSn + "', pcNum:'2003A0001'}";

    var sucess = function(json){

            // 1.기본정보
            var Table = [];
            try{
                Table = JSON.parse(json.d).Table;
            }catch(e){
                return;
            }

            $.each(Table, function(key, val){

            SetPcIdx(val.PC_IDX);
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
            var chkGijumCd = val.GIJUM_CD;

            $("#partNm").val(PART_NM);
            $("#userNm").val(USER_NM);
            $("#floor").val(FLOOR);
            setRadioValue("#MDLC_CD", "RDO_MDLC_CD", PC_TYPE);
            $("#txtPcNum").val(PC_NUM);
            $("#txtPcSn").val(PC_SN);
            $("#txtPcModel").val(PC_MODEL);
            $("#txtYyyyMm").val(YYYYMM);
            $("#txtCPU").val(CPU);
            $("#txtSSD").val(SSD);
            $("#txtHDD").val(HDD);
            $("#txtRAM").val(RAM);
            $("#txtMontr1").val(MONTR1);
            $("#txtMontr2").val(MONTR2);
            $("#txtPcName").val(PC_NAME);
            $("#txtOS").val(OS);
            $("#VAC_END_DD").val(VAC_END_DD);
            $("#txtIP").val(IP);
            $("#txtEtc").val(ETC);
            $("#txtIe").val(IE_VER);
            $("#txtOffice").val(OFFICE);
            $("#txtVac").val(VAC_NM);
            $("#txtHangul").val(HANGUL);

            if(ASST_STICK_YN == "Y")
                $("#ASST_STICK_02").prop("checked",true);
             else
                $("#ASST_STICK_01").prop("checked",true);
            $("input[name='ASST_STICK']").checkboxradio("refresh");

            if(OS_LCS == "Y")
                $("#OS_LCS_02").prop("checked",true);
            else
                $("#OS_LCS_01").prop("checked",true);
            $("input[name='OS_LCS']").checkboxradio("refresh");

            if(OFFICE_LSC == "Y")
                $("#OFFI_LCS_02").prop("checked",true);
            else
                $("#OFFI_LCS_01").prop("checked",true);
            $("input[name='OFFI_LCS']").checkboxradio("refresh");

            var input_txt =$("#MDLC_CD");
             input_txt.val(PC_TYPE);

            if(val.PC_STATUS == "C")//실사완료
            {
                alert("해당 자산은 이미 실사완료된 자산입니다.");
                $("#btnSaveDefault_P").prop("disabled", true);
            }
            else
            {
                if(GetGijumCd() == chkGijumCd) //같은지점 자산일경우
                {
                    isSearch = "Y";
                }
                else
                {
                    alert("해당 자산은 타지점 자산입니다. \r\n현재지점으로 정보를 가져옵니다.");
                    isSearch = "Y";
                }
            }

            });



            console.log(GetPcIdx());

           //콜백처리
           if(  typeof callback === "function"){
               callback(Table.length);
           }

    };

    getAJAX(url, data, sucess);
}

/// 자산정보 웹서비스 //////////////////////////////////////////
function wsRegAsstInfo(pcIdx, callback) {
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
            $("#txtPcSn").prop("disabled", true);

            $("#txtPcModel").val(PC_MODEL);
            $("#txtYyyyMm").val(YYYYMM);
            $("#txtCPU").val(CPU);
            $("#txtSSD").val(SSD);
            $("#txtHDD").val(HDD);
            $("#txtRAM").val(RAM);
            $("#txtMontr1").val(MONTR1);
            $("#txtMontr2").val(MONTR2);
            $("#txtPcName").val(PC_NAME);
            $("#txtOS").val(OS);
            $("#VAC_END_DD").val(VAC_END_DD);
            $("#txtIP").val(IP);
            $("#txtEtc").val(ETC);
            $("#txtIe").val(IE_VER);
            $("#txtOffice").val(OFFICE);
            $("#txtVac").val(VAC_NM);
            $("#txtHangul").val(HANGUL);

             if(ASST_STICK_YN == "Y")
                $("#ASST_STICK_02").prop("checked",true);
             else
                $("#ASST_STICK_01").prop("checked",true);
            $("input[name='ASST_STICK']").checkboxradio("refresh");

            if(OS_LCS == "Y")
                $("#OS_LCS_02").prop("checked",true);
            else
                $("#OS_LCS_01").prop("checked",true);
            $("input[name='OS_LCS']").checkboxradio("refresh");

            if(OFFICE_LSC == "Y")
                $("#OFFI_LCS_02").prop("checked",true);
            else
                $("#OFFI_LCS_01").prop("checked",true);
            $("input[name='OFFI_LCS']").checkboxradio("refresh");

            var input_txt =$("#MDLC_CD");
             input_txt.val(PC_TYPE);

            if(PC_USE_STATUS != "" && !fn_isNull(PC_USE_STATUS))
            {
                setRadioValue("#PCST_CD", "RDO_PCST_CD", PC_USE_STATUS);

            }
            else
            {
                setRadioValue("#PCST_CD", "RDO_PCST_CD", "PCST01");

            }

            if(val.PC_STATUS == "C")//실사완료
            {
                $("#btnSaveProc").prop("disabled", true);
                $("#btnRegAsstTakePic_1").prop("disabled", true).addClass("ui-state-disabled");
                $("#txtPcSn").prop("disabled", true);
                $("#txtPcNum").prop("disabled", true);
                $("#btnPcNumScan").hide();
                $("#btnSnScan").hide();
                $("#btnSnSch").hide();
            }
            else
            {
                $("#btnSaveProc").prop("disabled", false);
                $("#btnRegAsstTakePic_1").prop("disabled", false).removeClass("ui-state-disabled");
                $("#txtPcSn").prop("disabled", true);
                $("#txtPcNum").prop("disabled", true);
                $("#btnPcNumScan").hide();
                $("#btnSnScan").hide();
                $("#btnSnSch").hide();
            }
           });


               //콜백처리
               if(  typeof callback === "function"){
                   callback();
               }
    };

    getAJAX(url, data, sucess);
}


/////////// 실사내용 저장
function wsSetNewAsstInfo(pcIdx , statCd, callback){
//debugger;

    var url = ws_url + 'SetSaveNewAsstInfo';
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
                + "', cpu:'" + $("#txtCPU").val()
                + "', ssd:'" + $("#txtSSD").val()
                + "', hdd:'" + $("#txtHDD").val()
                + "', ram:'" + $("#txtRAM").val()
                + "', montr1:'" + $("#txtMontr1").val()
                + "', montr2:'" + $("#txtMontr2").val()
                + "', pcName:'" + $("#txtPcName").val()
                + "', os:'" + $("#txtOS").val()
                + "', asstStickYn:'" + getRadioValue("ASST_STICK")
                + "', vacEndDd:'" + $("#VAC_END_DD").val()
                + "', ip:'" + $("#txtIP").val()
                + "', etc:'" + $("#txtEtc").val()
                + "', ie:'" + $("#txtIe").val()
                + "', office:'" + $("#txtOffice").val()
                + "', vac:'" + $("#txtVac").val()
                + "', hangul:'" + $("#txtHangul").val()
                + "', osLcs:'" + getRadioValue("OS_LCS")
                + "', offiLcs:'" + getRadioValue("OFFI_LCS")
                + "', pcUseStatus:'" + getRadioValue("RDO_PCST_CD")
                + "', pcStatus:'"+statCd
                + "', regId:'" + GetUserId()+ "'}";
        log("data - " + data);

            if(fn_isNull($("#txtPcNum").val())){
                        alert("자산번호를 입력해주세요");
                        $("#txtPcNum").focus();
                        return;
            }

            if(fn_isNull($("#txtPcSn").val())){
                    alert("SN을 입력해주세요");
                    $("#txtPcSn").focus();
                    return;
            }

            if(fn_isNull($("#partNm").val())){
                    alert("부서명을 입력해주세요");
                    $("#partNm").focus();
                    return;
            }

            if(fn_isNull($("#userNm").val())){
                    alert("사용자를 입력해주세요");
                    $("#userNm").focus();
                    return;
            }

            if(fn_isNull($("#floor").val())){
                    alert("설치장소를 입력해주세요");
                    $("#floor").focus();
                    return;
            }

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


function fnClear(type)
{
//    if(type=="SN")
//    {
//        $("#txtPcNum").val("");
//    }
//    else
//    {
//        $("#txtPcSn").val("");
//    }

   $("#partNm").val("");
   $("#userNm").val("");
   $("#floor").val("");
   setRadioValue("#MDLC_CD", "RDO_MDLC_CD", "", "[ 장비구분 ]");
   $("#txtPcModel").val("");
   $("#txtYyyyMm").val("");
   $("#txtCPU").val("");
   $("#txtSSD").val("");
   $("#txtHDD").val("");
   $("#txtRAM").val("");
   $("#txtMontr1").val("");
   $("#txtMontr2").val("");
   $("#txtPcName").val("");
   $("#txtOS").val("");

}


/// 자산정보 웹서비스 //////////////////////////////////////////
function wsAsstDuplcate(callback) {

var url = ws_url + 'GetAsstDuplcate';
var pcSn = $("#txtPcSn").val();
var pcNum = $("#txtPcNum").val();

    var data = "{comCd:'" + GetComCd() + "' , pcIdx:'" + GetPcIdx() +"', pcSn:'" + pcSn +"', pcNum:'" + pcNum +"'}";
    //var data = "{pcSn:'" + pcSn + "', pcNum:'2003A0001'}";

    var sucess = function(json){

            // 1.기본정보
            var Table = [];
            try{
                Table = JSON.parse(json.d).Table;
            }catch(e){
                return;
            }

            $.each(Table, function(key, val){

            if(val.PC_STATUS == "C")//실사완료
            {
                alert("해당 자산은 이미 실사완료된 자산입니다.");
                $("#btnSaveProc").prop("disabled", true);
            }

            });



            console.log(GetPcIdx());

           //콜백처리
           if(  typeof callback === "function"){
               callback(Table.length);
           }

    };

    getAJAX(url, data, sucess);
}