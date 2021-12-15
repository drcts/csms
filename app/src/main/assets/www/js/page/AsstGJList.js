$(document).on('pagecreate', "#AsstGJList",function (e) {
// 좌우 스윕 이벤트
    $("#AsstGijumlistview").on("swipeleft", function(e) {
         if(last_page<2)    return; //한페이지면 필요없음

         if(cur_page == last_page){
             gfn_toast("마지막페이지 입니다.","success");
             return;
         }
         else{
             cur_page++;
             wsAsstGijumList(cur_page);
         }
    });

    $("#AsstGijumlistview").on("swiperight", function(e) {
         if(last_page<2)    return; //한페이지면 필요없음

        if(cur_page == 1){
            gfn_toast("처음페이지 입니다.","success");
            return;
        }
        else{
            cur_page--;
            wsAsstGijumList(cur_page);
        }
    });
});

$(document).on('pagebeforeshow', "#AsstGJList",function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle(GetComNm()+" - "+GetGijumNm());
     SetPcIdx("");
     isDone = "C";

   /*
    if(GetComType() == "Q"){
               $("tr").eq(0).find("th").eq(0).text("자산번호");
               $("tr").eq(0).find("th").eq(1).text("SN");
           }
           else
           {
               $("tr").eq(0).find("th").eq(0).text("부서");
               $("tr").eq(0).find("th").eq(1).text("사용자");
           }
   */


    initAsstGJList();

});

$(document).on('pageshow', "#AsstGJList",function (){
    wsAsstGijumList(1);
});

$(document).on('pagehide', "#AsstGJList",function () {
    $("#AsstGJList").remove();
});

var cur_page = 1;//current page
var last_page = 1;//last page

var initAsstGJList = function() {
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

    $("#btDoneSearch").on("click", function(e) {

            e.preventDefault();

            //        progress.show(function(){
            //
            //            }, function(){
            //            }, {"text": "Loading..."});

            //progress.show({"text": "Loading..."});

            wsAsstGijumList(1);

            $(".ui-header").removeClass("ui-fixed-hidden");
            $(".ui-footer").removeClass("ui-fixed-hidden");
        });
//이전버튼
    $("#btnAsstGJList").click(function(){
         SetPcIdx("");
         isDone = "C";
         PageNonChange("AsstMain.html");
    });

    $("#btAsstAdd").on("click", function (e) {
        if(GetComType() == "Q"){
            PageNonChange("AsstReg.html");
        }
        else{
            PageNonChange("AsstReg_P.html");
        }
    });
}


var goAsstInfoA = function(pcIdx){
    SetPcIdx(pcIdx);
    isDone = "C"; //자산정보 메뉴
    if(GetComType() == "Q"){
    PageNonChange("AsstInfo.html");
    }
    else{
    PageNonChange("AsstInfo_P.html");
    }
}

function wsAsstGijumList(page) {

gfn_startLoading();

cur_page = page;//현재페이지 동기화
    var url = ws_url + 'GetGijumAsstList';

    var strSearch = $('#txtSearch').val();
    var resentYn = "N";
    if($("#resentYn:checked").val() == "on"){
        resentYn = "Y";
    }

    var data = "{comCd:'" + GetComCd() + "', gijumCd:'"+GetGijumCd()+"', strSearch:'" + strSearch +"', resentYn:'"+resentYn+"', page: '"+page+"'}";

    var sucess = function(json){

        var list = $("#AsstGijumlistview");
        list.children().remove();

        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

       var cnt = 0; //for문 카운터
        $.each(Table, function(key, val){

           //마지막페이지 계산(한번만)
            if(cnt == 0)
            {
                try{
                    last_page = Math.ceil(parseInt(val.total)/10);
                }catch(e){}
            }
            cnt++;
            $("#pageInfo").html("(" +  page + "/" + last_page + ")"); //페이징표시
           // if(index == 0)
           // {
            $("#spnTot").text(val.TOT_CNT);
            $("#spnYTot").text(val.Y_CNT);
            $("#spnNTot").text(val.N_CNT);
           // }

            var pcIdx = val.PC_IDX; //자산IDX
            var pcNum = val.PC_NUM; //자산번호,
            var pcSn = val.PC_SN; //SN,
            var pcTyp = val.DTL_NM; //장비구분명(데스크탑,노트북...),
            var statNm = val.PC_STATUS_NM; //실사상태(T:미실사, C:실사완료),
            var pcModel = val.PC_MODEL; //모델명
            var gijumStatus = val.GIJUM_STATUS;
            var tcnt = val.TCNT;
            var partNm = val.PART_NM;
            var userNm = val.USER_NM;

            if(gijumStatus == "C")//실사완료
            {
               var button = $("<tr class='trow'><td style='width:150px;'>{1}</td><td>{2}</td></tr><tr><td style='width:150px;'>{3}</td><td>{4}</td></tr><tr><td style='width:150px;'>{5}</td><td>{6}</td></tr><tr><td colspan='2'>{7}</td></tr>".format(pcIdx, fn_nvl(pcNum,"&nbsp;" ), fn_nvl(pcSn,"&nbsp;" ), fn_nvl(pcTyp,"&nbsp;" ), fn_nvl(pcModel,"&nbsp;" ),fn_nvl(partNm,"&nbsp;" ), fn_nvl(userNm,"&nbsp;" ), fn_nvl(statNm,"&nbsp;" )));
               $("#btGijumEnd").prop("disabled", true);
               $("#btAsstAdd").prop("disabled", true);
              // $("#btnSnScan").hide();
               $("#btnPcNumScan").hide();
               $("#resentYn").prop("checked", false).checkboxradio('refresh');
            }
            else
            {
                 //방문순서 삭제 <td rowspan='3'><input name='visitNo' abbr='{4}' value='{3}' type='number' data-corners='false' class='ui-mini' style='width:20px;text-align:center;'/></td>
                 var button = $("<tr class='trow'><td onclick='goAsstInfoA({0});' style='width:150px;'>{1}</td><td onclick='goAsstInfoA({0});'>{2}</td></tr><tr><td onclick='goAsstInfoA({0});' style='width:150px;'>{3}</td><td onclick='goAsstInfoA({0});'>{4}</td></tr><tr><td onclick='goAsstInfoA({0});' style='width:150px;'>{5}</td><td onclick='goAsstInfoA({0});'>{6}</td></tr><tr><td colspan='2' onclick='goAsstInfoA({0});'>{7}</td></tr>".format(pcIdx, fn_nvl(pcNum,"&nbsp;" ), fn_nvl(pcSn,"&nbsp;" ), fn_nvl(pcTyp,"&nbsp;" ), fn_nvl(pcModel,"&nbsp;" ), fn_nvl(partNm,"&nbsp;" ), fn_nvl(userNm,"&nbsp;" ), fn_nvl(statNm,"&nbsp;" )));
                 $("#btGijumEnd").prop("disabled", false);
                 if(tcnt == 0)
                  $("#resentYn").prop("checked", false).checkboxradio('refresh');
            }

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

        $(".ui-header").removeClass("ui-fixed-hidden");
        $(".ui-footer").removeClass("ui-fixed-hidden");
    };

    getAJAX(url, data, sucess);
}

var GijumEnd = function(){
    if(!confirm("지점실사 완료후에는 정보를 수정할 수 없습니다. 지점실사완료 하시겠습니까?")) return;
        wsGijumEnd(GetComCd(), GetGijumCd(), function(){
            alert("지점 실사완료 되었습니다.");
            PageNonChange("AsstGJSign.html");
    });

}


function wsGijumEnd(comCd, gijumCd, callback) {
var url = ws_url + 'SetGijumEnd';
     var data = "{comCd:'" + comCd +  "', gijumCd:'" + gijumCd+  "', userId:'" + GetUserId() + "' }";
     debugger;
     var sucess = function(json) {
         if(json.d == "error")   return;

         var rtnCode;
         try{
             rtnCode = JSON.parse(json.d).RtnCode;
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

//var fn_list_sn_scan = function(){
//
//   SetPcSn("");
//
//   cordova.plugins.barcodeScanner.scan(
//      function (result) {
//        var SN = result.text;
//        var FMT = result.format;
//        var CAN = result.cancelled;
////SN = "B381156";
//        $("#txtPcSn").val(SN);
//
//        wsChkAsstSearCh(SN, $("#txtPcNum").val(), function(val, chkGijumCd){
//        //debugger;
//
//
//            if(val == 0)
//           {
//                if(!confirm("해당 SN으로 조회된 자산이 없습니다.\r\n신규 추가 하시겠습니까?"))
//                {
//                   SetPcIdx("");
//                   return;
//                }
//                else
//                {
//                    SetPcSn(SN);
//                    PageNonChange("AsstReg.html");
//                }
//           }
//           else
//           {
//                if(GetGijumCd() == chkGijumCd) //같은지점 자산일경우
//                {
//                    SetPcIdx("");
//                    wsAsstGijumList(1);
//                }
//                else
//                {
//                    if(!confirm("해당 SN의 장비는 타지점 자산입니다.\r\n현재 지점으로 이동추가 하시겠습니까?"))
//                    {
//                       SetPcIdx("");
//                       return;
//                    }
//                    else
//                    {
//                        SetPcSn(SN);
//                        PageNonChange("AsstReg.html");
//                    }
//                }
//           }
//        });
//      },
//      function (error) {
//          alert("Scanning failed: " + error);
//      }
//   );
//}

var fn_list_scan = function(){

   cordova.plugins.barcodeScanner.scan(
      function (result) {
        var SN = result.text;
        var FMT = result.format;
        var CAN = result.cancelled;
//SN = "B381156";
        $("#txtSearch").val(SN);
        //debugger;
        if(!fn_isNull(SN))
        {
           wsChkAsstSearCh(SN, function(val, chkGijumCd, chkPcStatus){
                   //debugger;
                   if(val == 0)
                  {
                       if(!confirm("조회된 자산이 없습니다.\r\n신규 추가 하시겠습니까?"))
                       {
                          SetPcIdx("");
                          SetPcSn("");
                          SetPcNum("");
                          return;
                       }
                       else
                       {
                           SetPcSn(SN);
                           SetPcNum(SN);
                           PageNonChange("AsstReg.html");
                       }
                  }
                  else
                  {
                       if(chkPcStatus == "C")
                       {
                            alert("해당 자산은 이미 실사완료된 자산입니다.");
                       }
                       else
                       {
                           if(GetGijumCd() == chkGijumCd) //같은지점 자산일경우
                           {
                               SetPcIdx("");
                               SetPcSn("");
                               SetPcNum("");
                               wsAsstGijumList(1);
                           }
                           else
                           {
                               if(!confirm("해당장비는 타지점 자산입니다.\r\n현재 지점으로 이동추가 하시겠습니까?"))
                               {
                                  SetPcIdx("");
                                  return;
                               }
                               else
                               {
                                   SetPcSn(SN);
                                   SetPcNum(SN);
                                   PageNonChange("AsstReg.html");
                               }
                           }
                       }
                  }
               });
           }

      },
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}


/// 자산정보 웹서비스 //////////////////////////////////////////
function wsChkAsstSearCh(txtSch, callback) {

var url = ws_url + 'GetAsstSearch';

    var data = "{comCd:'" + GetComCd() + "', txtSch:'" + txtSch + "'}";
    //var data = "{pcSn:'" + pcSn + "', pcNum:'2003A0001'}";

    var sucess = function(json){

            // 1.기본정보
            var Table = [];
            var chkGijumCd = "";
            var chkPcStatus = "";
            try{
                Table = JSON.parse(json.d).Table;
            }catch(e){
                return;
            }

            $.each(Table, function(key, val){
            SetPcIdx(val.PC_IDX);
            chkGijumCd = val.GIJUM_CD;
            chkPcStatus = val.PC_STATUS;
            });

           //콜백처리
           if(  typeof callback === "function"){
               callback(Table.length,chkGijumCd, chkPcStatus);
           }

    };

    getAJAX(url, data, sucess);
}

