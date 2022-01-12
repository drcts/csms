
function id(element) {
    return document.getElementById(element);
}
function log(msg) {
    console.log(msg);
}



function showAlert(title, message, callback) {
  if(navigator.notification == undefined) {
    if(callback != null)
      callback();
    alert(message);
  }
  else {
    navigator.notification.alert(message, callback, title, '확인');
  }
}
function moveTop() {
  $(window).scrollTop(0);
}


function scaleContentToDevice(){
    scroll(0, 0);
    var screen = $.mobile.getScreenHeight(),
    header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
    footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
    contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),

    row1 = $(".row:first-child").outerHeight(),
    row2 = $(".row").outerHeight(),

    content = screen - header - footer - contentCurrent;
    $("#noticeContent").height(content);
}

function RefreshCurrentPage() {
  $.mobile.changePage(
    window.location.href,
    {
      allowSamePageTransition : true,
      transition              : 'none',
      showLoadMsg             : false,
      reloadPage              : true
    }
  );
}

function PageNonChange(pageURL) {
  //var path = "#" + pageURL.replace(".html", "");
  //$.mobile.changePage(pageBase + pageURL);

  $.mobile.changePage(pageBase + pageURL, {
        transition: "none",
        reverse: false,
        changeHash: true,
        allowSamePageTransition: false// 같은 페이지로 페이지 전환 요청 허용
  });

}

function ParamPageChange(pageURL, strParam)
{
 var strUrl = pageBase + pageURL;
$.mobile.changePage(strUrl,
{
dataUrl : strUrl+"?parameter="+strParam,
data : { 'parameter' : strParam },
reloadPage : true,
changeHash : true }
);
}

/*
function MoveToHTML(pageURL)
{
  var path = pageURL.replace("#", "");
  location.href = path + ".html";
}

function PageNaviChange(pageURL)
{
  $.mobile.changePage(pageURL, {
    transition: "slide"
  });
}
function PageChange(pageURL) {
  $.mobile.changePage(pageURL, {
    transition: "pop",
    reverse: false,
    changeHash: false,
    allowSamePageTransition: true	// 같은 페이지로 페이지 전환 요청 허용
  });
}
*/




function SetCurrentDay(target) {
    var today = new Date();

    var yyyy = today.getFullYear();
    var mm = today.getMonth()+1; //January is 0!
    var dd = today.getDate();

    if(mm < 10) {
      mm = '0' + mm;
    }

    if(dd < 10) {
      dd = '0' + dd;
    }

    $(target).val(yyyy + '-' + mm + '-' + dd);
}





String.prototype.format = String.prototype.f = function () {
	var s = this,
	i = arguments.length;

	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};
String.prototype.contains = function() {
    return String.prototype.indexOf.apply( this, arguments ) !== -1;
};
Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

function CheckButtonState(id, value) {
  if(value == "Y")
    $(id).prop( "checked", true ).checkboxradio('refresh');
  else
    $(id).prop( "checked", false ).checkboxradio('refresh');
}
function GetCheckButtonState(id) {
   if( $(id).is(":checked") )
    return "Y";
  else
    return "N";
}




function fn_isNull(str) {
	if (str == null)
		return true;
	if (str == "NaN")
		return true;
	if (new String(str).valueOf().replace(/-/g,"").search("undef") > -1)
		return true;
	var chkStr = new String(str);
	if (chkStr.valueOf().replace(/-/g,"").search("undef") > -1)
		return true;
	if (chkStr == null)
		return true;
	if (chkStr.toString().length == 0)
		return true;
	return false;
}


function fn_nvl(str, def){

    if(fn_isNull(str))
        return def;
    else
        return str;
}

/**
 * 날짜에 구분자 형식으로 변환
 * @param date_str
 * @param gubun
 * @returns
 */
function fn_toDay(date_str, gubun)
{
	if(fn_isNull(gubun))	gubun = "-";

    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(4,6);
    var sDate = yyyyMMdd.substring(6,8);

    return sYear + gubun + sMonth + gubun + sDate;
}



Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";

	var weekName = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "am" : "pm";
			default: return $1;
		}
	});
};


/*라디오 해당값으로 선택하기*/
function setRadioValue(text_name, radio_name, sel_value, defTxt){
    var rdo = $('input:radio[name="'+radio_name+'"]');

    //rdo.filter('[value="'+sel_value+'"]').prop('checked',true).checkboxradio('refresh');
    //rdo.filter('[value="'+sel_value+'"]').next().click();
    //rdo.filter('[value="'+sel_value+'"]').parent().find("label[for].ui-btn").click();

    $('input:radio[name="'+radio_name+'"]:checked').prop( "checked", false ).checkboxradio('refresh');
    rdo .filter('[value="'+sel_value+'"]').prop('checked',true).checkboxradio('refresh');

    var sel_text = defTxt;
    if(!fn_isNull(sel_value)){
        sel_text = rdo .filter('[value="'+sel_value+'"]').attr("abbr");
    }
    $(text_name).text(sel_text);
}

function getRadioValue(radio_name){
    var rdo = $('input:radio[name="'+radio_name+'"]');
    return $('input:radio[name="'+radio_name+'"]:checked').val();
}

function getRadioText(radio_name, sel_value){
    var rdo = $('input:radio[name="'+radio_name+'"]');
        return $('input:radio[name="'+radio_name+'"]:checked').attr("abbr");
}





function getTime() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) +
    leadingZeros(d.getMonth() + 1, 2) +
    leadingZeros(d.getDate(), 2) +

    leadingZeros(d.getHours(), 2) +
    leadingZeros(d.getMinutes(), 2) +
    leadingZeros(d.getSeconds(), 2);

  return s;
}

function getYearMonth() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) +
    leadingZeros(d.getMonth() + 1, 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}




function gfn_startLoading() {
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(document).height();
//  var maskWidth = $(document).width();
    var maskWidth = window.document.body.clientWidth;

    var mask = "<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; left:0; top:0;'></div>";
    var loadingImg = '';

    loadingImg += "<div id='loadingImg' style='position:absolute; left:50%; top:50%;  margin-left: -50px; margin-top: -50px; display:none; z-index:10000;'>";
    //loadingImg += " <img src='../img/ajax-loader.gif'/>";
    loadingImg += " <img src='../img/loading.gif'/>";
    loadingImg += "</div>";

    //화면에 레이어 추가
    $('body')
        .append(mask)
        .append(loadingImg)

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#mask').css({
            'width' : maskWidth
            , 'height': maskHeight
            , 'opacity' : '0.3'
    });

    //마스크 표시
    $('#mask').show();

    //로딩중 이미지 표시
    $('#loadingImg').show();
}

function gfn_endLoading() {
    $('#mask, #loadingImg').hide();
    $('#mask, #loadingImg').remove();
}

//글자수 줄이기
function gfn_strLen(str, len){
    var _len = 0;
    try{
        _len = parseInt(len);
    }catch(e){}
    var _str = new String(str);
    return  _str.substring(0,len) + "..";
}

//핸드폰번호 체크
function gfn_isValidHp(_hp){
    var regExp = /^\d{3}-\d{3,4}-\d{4}$/;

    var hp = new String(_hp);
    return regExp.test(hp);
}

//일반전화번호 체크
function gfn_isValidTel(_hp){
var regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;

    var hp = new String(_hp);
    return regExp.test(hp);
}

var gfn_toast = function(msg, _type){
    var type = "info"; //"success","error","info","warning"
    if(_type != null)   type = _type;

   $.toast({text: msg
        ,icon: type
        ,loader: false
        ,hideAfter: 3000
        ,stack: false
        ,position: "bottom-left"
        //,position: "mid-center"
        //,textAlign: 'center'
    });
}