$(document).on('pagecreate', "#DoneList",function (e) {
// 좌우 스윕 이벤트
    $("#DoneListview").on("swipeleft", function(e) {
         if(last_page<2)    return; //한페이지면 필요없음

         if(cur_page == last_page){
             gfn_toast("마지막페이지 입니다.","success");
             return;
         }
         else{
             cur_page++;
             wsDoneList(cur_page);
         }
    });

    $("#DoneListview").on("swiperight", function(e) {
         if(last_page<2)    return; //한페이지면 필요없음

        if(cur_page == 1){
            gfn_toast("처음페이지 입니다.","success");
            return;
        }
        else{
            cur_page--;
            wsDoneList(cur_page);
        }
    });
});

$(document).on('pagebeforeshow', "#DoneList", function () {
      //log("isDone, rcvIdx - " + isDone + ", " + GetRcvIdx());;
    SetNaviTitle("처리완료 현황");
    SetRcvIdx("");
     isDone = "B";

    initDoneList();


});

$(document).on('pageshow', "#DoneList",function (){
    wsDoneList(1);
});

$(document).on('pagehide', "#DoneList",function () {
    $("#DoneList").remove();
});

var cur_page = 1;//current page
var last_page = 1;//last page

var initDoneList = function(){

    // 화면모드처리
     if(isDone == "B"){
        $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='attendance']").addClass("ui-btn-active").addClass("ui-state-persist");
    }
    else{
        $(" a[data-icon='employee'] ").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='attendance']").removeClass("ui-btn-active").removeClass("ui-state-persist") ;
        $(" a[data-icon='employee'] ").addClass("ui-btn-active").addClass("ui-state-persist");
    }


    //조회
    $("#btDoneSearch").on("click", function(e) {

//        if(!($("#resentYn:checked").val() == "on")){
//            if(fn_isNull($("#txtRcvNo").val()) && fn_isNull($("#txtCustNm").val())){
//                alert("검색어를 입력해주세요.");
//                return;
//            }
//        }



        e.preventDefault();
        wsDoneList(1);

        $(".ui-header").removeClass("ui-fixed-hidden");
        $(".ui-footer").removeClass("ui-fixed-hidden");
    });
};




var goReqCtntB = function(rcvIdx){

    SetRcvIdx(rcvIdx);
    isDone = "B"; //처리완료 메뉴
    PageNonChange("ReqCtnt.html");
}

/// 처리완료현황조회 웹서비스 ///////////////////////////////////////////
function wsDoneList(page) {

    gfn_startLoading();

    cur_page = page;//현재페이지 동기화

    var url = ws_url + 'GetNotDoneList';

    var srcTxt = $('#txtRcvNo').val();
    var resentYn = "N";
    if($("#resentYn:checked").val() == "on"){
        resentYn = "Y";
    }

    var data = "{userId:'" + GetUserId() + "', rcvStatYn:'Y', srcTxt:'" + srcTxt + "', resentYn:'"+resentYn+"', userAuth:'"+GetUserAuth()+"', userGbn:'"+GetUserGbn()+"', page: '"+page+"'}";

    var sucess = function(json){

        var list = $("#DoneListview");
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
            var custNm = val.custNm; //고객명,
            var rcvCnts = val.rcvCnts; //주소,
            var visitNo = val.visitNo; //파일건수,
            var cletNm = val.cletNm; //고객사
            var areaNm = val.areaNm; //지역
            var custNm = val.custNm; //고객명
            try{
                custNm = custNm.substring(0,3) + "/" + val.userNm; //고객명 /엔지니어,
            }catch(e){}

            //var button = $("<tr class='trow'><td onclick='goReqCtntB({4});' style='width:150px;'>{0}</td><td onclick='goReqCtntB({4});'>{1}</td></tr><tr><td colspan='2' onclick='goReqCtntB({4});'>{2}</td></tr>".format(rcvNo, fn_nvl(custNm,"&nbsp;"), fn_nvl(rcvCnts,"&nbsp;"), visitNo, rcvIdx));
            var button = $("<tr class='trow'><td onclick='goReqCtntB({4});' style='width:150px;'>{0}</td><td onclick='goReqCtntB({4});'>{1}</td></tr><tr><td onclick='goReqCtntB({4});' style='width:150px;'>{5}</td><td onclick='goReqCtntB({4});'>{6}</td></tr><tr><td colspan='2' onclick='goReqCtntB({4});'>{2}</td></tr>".format(rcvDd, fn_nvl(custNm,"&nbsp;" ), fn_nvl(rcvCnts,"&nbsp;" ), visitNo, rcvIdx, fn_nvl(cletNm,"&nbsp;" ), fn_nvl(areaNm,"&nbsp;" )));
            list.append(button);
            /*
                        button.on("click", function(e){
                            e.preventDefault();
                            goReqCtntB(rcvIdx);
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



