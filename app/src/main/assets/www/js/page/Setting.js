$(document).on('pageinit', "#Setting",function () {
    $("#autoLogin").on('change', function( event, ui ) {
      log($(this).val());
        if ($(this).val() == 'on') {
            SetUserAutoLogin("yes");
        } else {
            SetUserAutoLogin("no");
        }
    });
});
$(document).on('pagebeforeshow', "#Setting",function () {
    SetNaviTitle("설정");

    if(GetUserAutoLogin() == "yes")
        $("#autoLogin").flipswitch(true);
    else
        $("#autoLogin").flipswitch(false);

    //createSettingCommpnyList();
});


function createSettingCommpnyList() {
    // 내가 속한 그룹(회사) 리스트 만들기
    // 회사 변경하기
    var popup = $("#companyControlgroup");
    popup.children().remove();

    //var curProjectCode = GetProjectCode();

    var list = localStorage.getArray("ProjInfo");
    for (var i = 0; i < list.length; i++) {
        var val = list[i];
        var index = i+1;

        var project = val.PJT_CD;

        var button = $('<input name="radio-choice" id="radio-choice-v-{0}a" value="on" type="radio" data-authidx="{1}" data-pjtcd="{2}" data-comcd="{3}" data-pjtnm="{4}" class="custom"> '.format(index, val.AUTH_IDX, val.PJT_CD, val.COM_CD, val.PJT_NM));
        //        if(curProjectCode == project)
        //          button.attr("checked", true);

        button.on("click", function(e){
            e.preventDefault();

            SetAuthorityGrade(this.getAttribute("data-authidx"));
            SetProjectCode(this.getAttribute("data-pjtcd"));
            SetCompanyCode(this.getAttribute("data-comcd"));

            PageNonChange("#Main");

            alert("프로젝트가 ' " + this.getAttribute("data-pjtnm") + " '으로 변경되었습니다.");
        });
        popup.append(button).append('<label for="radio-choice-v-{0}a">{1}</label> '.format(index, val.PJT_NM));

    }

    popup.trigger('create');
}
