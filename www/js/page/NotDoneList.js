$(document).on('pagecreate', "#NotDoneList",function () {

    // 좌우 스윕 이벤트
    $("#NotDoneListview").on("swipeleft", function(e) {
         if(last_page<2)    return; //한페이지면 필요없음

         if(cur_page == last_page){
             gfn_toast("마지막페이지 입니다.","success");
             return;
         }
         else{
             cur_page++;
             wsNotDoneList(cur_page);
         }
    });

    $("#NotDoneListview").on("swiperight", function(e) {
         if(last_page<2)    return; //한페이지면 필요없음

        if(cur_page == 1){
            gfn_toast("처음페이지 입니다.","success");
            return;
        }
        else{
            cur_page--;
            wsNotDoneList(cur_page);
        }
    });
});


$(document).on('pagebeforeshow', "#NotDoneList", function () {
    //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle("미처리 현황");
    SetRcvIdx("");
     isDone = "A";


if($(this).data("url").indexOf("?") != -1){
     var parameters = $(this).data("url").split("?")[1];
     var parameter = parameters.replace("parameter=","");
     $('#txtRcvNo').val(parameter);
}


    initNotDoneList();
});

$(document).on('pageshow', "#NotDoneList",function (){
    wsNotDoneList(1);
});

$(document).on('pagehide', "#NotDoneList",function () {
    $("#NotDoneList").remove();
});

var cur_page = 1;//current page
var last_page = 1;//last page


var initNotDoneList = function(){
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

    wsNotDoneList_Count();

    //조회
    $("#btELSearch").on("click", function(e) {

        e.preventDefault();

        //        progress.show(function(){
        //
        //            }, function(){
        //            }, {"text": "Loading..."});

        //progress.show({"text": "Loading..."});

        wsNotDoneList(1);

        $(".ui-header").removeClass("ui-fixed-hidden");
        $(".ui-footer").removeClass("ui-fixed-hidden");
    });
    //방문순서 저장
    $("#btOrdSave").on("click", function(e) {
        e.preventDefault();
        wsVisitNo(function(){
            showAlert("저장", "저장되었습니다.");
        });
    });
}


var goReqCtntA = function(rcvIdx){
    SetRcvIdx(rcvIdx);
    isDone = "A"; //미처리현황 메뉴
    //PageNonChange("ReqCtnt.html");
    ParamPageChange("ReqCtnt.html",$('#txtRcvNo').val());
}

var goWelsCtntA = function(rcvIdx){
  SetRcvIdx(rcvIdx);
  isDone = "A"; //미처리현황 메뉴
  //PageNonChange("WSInstCtnt.html");
  ParamPageChange("WSInstCtnt.html",$('#txtRcvNo').val());
}

var goShapCtntA = function(rcvIdx){
 SetRcvIdx(rcvIdx);
 isDone = "A"; //미처리현황 메뉴
 //PageNonChange("WSInstCtnt.html");
 ParamPageChange("ShapCtnt.html",$('#txtRcvNo').val());
}

function wsNotDoneList_Count(){
 var url = ws_url + 'GetNotDoneList_Count';

    var srcTxt = $('#txtRcvNo').val();

    var data = "{userId:'" + GetUserId() + "', rcvStatYn:'N', srcTxt:'" + srcTxt + "', resentYn:'', userAuth:'"+GetUserAuth()+"', userGbn:'"+GetUserGbn()+"'}";

    var sucess = function(json){

        var list1 = $("#NotDoneView1");
        list1.children().remove();
        var list2 = $("#NotDoneView2");
        list2.children().remove();

        var Table = [];
        try{
            Table = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }


        var cnt = 0; //for문 카운터
        $.each(Table, function(key, val){

            var bCnt = val.B_CNT; //기술지원
            var dCnt = val.D_CNT; //실사
            var eCnt = val.E_CNT; //기타
            var lCnt = val.L_CNT; //납품
            var oCnt = val.O_CNT; //A/S
            var rCnt = val.R_CNT; //회수
            var sCnt = val.S_CNT; //설치
            var uCnt = val.U_CNT; //업그레이드
            var shapCnt = val.SHAPCNT; //샵캐스트

            var button1;
            var button2;

            button1 = $("<tr class='trow'><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>".format(bCnt, oCnt, dCnt, sCnt, lCnt));
            button2 = $("<tr class='trow'><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>".format(rCnt, uCnt, eCnt, shapCnt));

            list1.append(button1);
            list2.append(button2);

        });
        $("#NotTable1").table("refresh");
        $("#NotTable2").table("refresh");

    };

    getAJAX(url, data, sucess);
}
/// 미처리현황조회 웹서비스 ///////////////////////////////////////////
function wsNotDoneList(page) {
    gfn_startLoading();
    cur_page = page;//현재페이지 동기화

    var url = ws_url + 'GetNotDoneList_NEW';

    var srcTxt = $('#txtRcvNo').val();

    var data = "{userId:'" + GetUserId() + "', rcvStatYn:'N', srcTxt:'" + srcTxt + "', resentYn:'', userAuth:'"+GetUserAuth()+"', userGbn:'"+GetUserGbn()+"', page: '"+page+"'}";

    var sucess = function(json){

        var list = $("#NotDoneListview");
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
                    last_page = Math.ceil(parseInt(val.total)/100);
                }catch(e){}
            }
            cnt++;
            $("#pageInfo").html("(" +  page + "/" + last_page + ")"); //페이징표시

            var rcvIdx = val.rcvIdx; //접수
            var rcvDd = val.rcvDd; //접수일자,
            var custNm = val.custNm; //고객명
            try{
                custNm = custNm.substring(0,3) + "/" + val.userNm; //고객명 /엔지니어,
            }catch(e){}
            var rcvCnts = val.rcvCnts; //주소,
            var visitNo = val.visitNo; //파일건수,
            var cletNm = val.cletNm; //고객사
            var areaNm = val.areaNm; //지역
            var rstDiff = val.RST_DIFF;//현재시간 기준으로 처리내용을 등록한 시간차
            var viewType = val.TYPE;

            //alert(rstDiff);
            //방문순서 삭제 <td rowspan='3'><input name='visitNo' abbr='{4}' value='{3}' type='number' data-corners='false' class='ui-mini' style='width:20px;text-align:center;'/></td>
            //width세팅삭제 var button = $("<tr class='trow'><td onclick='goReqCtntA({4});' style='width:150px;'>{0}</td><td onclick='goReqCtntA({4});'>{1}</td></tr><tr><td onclick='goReqCtntA({4});' style='width:150px;'>{5}</td><td onclick='goReqCtntA({4});'>{6}</td></tr><tr><td colspan='2' onclick='goReqCtntA({4});'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
            var button;
            if(parseInt(rstDiff) <= 12)
            {
                if(viewType == "CSMS")
                {
                     button = $("<tr class='trow'><td onclick='goReqCtntA({4});' style='color:red' >{0}</td><td onclick='goReqCtntA({4});' style='color:red'>{1}</td></tr><tr><td onclick='goReqCtntA({4});' style='color:red'>{5}</td><td onclick='goReqCtntA({4});' style='color:red'>{6}</td></tr><tr><td colspan='2' onclick='goReqCtntA({4});' style='color:red'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
                }
                else if(viewType == "SHAP")
                {
                     button = $("<tr class='trow'><td onclick='goShapCtntA({4});' style='color:red' >{0}</td><td onclick='goShapCtntA({4});' style='color:red'>{1}</td></tr><tr><td onclick='goShapCtntA({4});' style='color:red'>{5}</td><td onclick='goShapCtntA({4});' style='color:red'>{6}</td></tr><tr><td colspan='2' onclick='goShapCtntA({4});' style='color:red'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
                }
                else{
                    button = $("<tr class='trow'><td onclick='goWelsCtntA({4});' style='color:red' >{0}</td><td onclick='goWelsCtntA({4});' style='color:red'>{1}</td></tr> <tr><td onclick='goWelsCtntA({4});' style='color:red'>{5}</td><td onclick='goWelsCtntA({4});' style='color:red'>{6}</td></tr><tr><td colspan='2' onclick='goWelsCtntA({4});' style='color:red'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
                }
            }
            else{
                if(viewType == "CSMS")
                {
                     button = $("<tr class='trow'><td onclick='goReqCtntA({4});' >{0}</td><td onclick='goReqCtntA({4});'>{1}</td></tr> <tr><td onclick='goReqCtntA({4});' >{5}</td><td onclick='goReqCtntA({4});'>{6}</td></tr> <tr><td colspan='2' onclick='goReqCtntA({4});'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
                }
                else if(viewType == "SHAP")
                {
                     button = $("<tr class='trow'><td onclick='goShapCtntA({4});' >{0}</td><td onclick='goShapCtntA({4});'>{1}</td></tr> <tr><td onclick='goShapCtntA({4});' >{5}</td><td onclick='goShapCtntA({4});'>{6}</td></tr> <tr><td colspan='2' onclick='goShapCtntA({4});'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
                }
                else{
                    button = $("<tr class='trow'><td onclick='goWelsCtntA({4});' >{0}</td><td onclick='goWelsCtntA({4});'>{1}</td></tr><tr><td onclick='goWelsCtntA({4});' >{5}</td><td onclick='goWelsCtntA({4});'>{6}</td></tr><tr><td colspan='2' onclick='goWelsCtntA({4});'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
                }
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


/// 방문정보 웹서비스 저장 ////////////////////////////////////////////
function wsVisitNo(callback) {

    var url = ws_url + 'SetVisitOrder';

    var visitNos = $("input[name='visitNo']");
    if(visitNos.length < 1){
        alert("저장할 데이터가 없습니다.");
        return;
    }
    var arrList = "";
    var cnt = 0;
     visitNos.each(function(d){
        if(cnt == visitNos.length || visitNos.length == 1){
            arrList += $(this).attr("abbr") + "^" + $(this).val();
        }
        else{
            arrList += $(this).attr("abbr")  + "^" + $(this).val() + "|";
        }
        cnt++;
     });
    var data = "{arrList:'" + arrList + "'}";

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





/*
    $(document).on("scrollstart",function(){
      console.log("Started scrolling!");
    });
    $(document).on("scrollstop",function(){
      console.log("Stopped scrolling!");
    });
*/

