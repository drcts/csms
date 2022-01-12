



// 사용자(엔지니어) 웹서비스조회 - 팝업형태 /////////////////////////////////////////////////////
function wsUserPopList(userId, group_name, list_name, text_name, popup_name, callback) {
    var url = ws_url + 'Select_Trand_Id';
    var data = "{userId:'" + userId + "'}";

    var sucess = function(json) {
        if(json.d == "error")   return;

        var jsonAry = [];
        try{
            jsonAry = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        var list = $(list_name);
        list.children().remove();
        var text = $(text_name);
        var popup = $(popup_name);

        var key_name = list.attr("data-find-name");
        list.removeAttr("data-find-name");
        var key_id = list.attr("data-find-id");
        list.removeAttr("data-find-id");

        list.append($('<legend>엔지니어를 선택하세요.</legend>'));

        var fieldset = $("<fieldset data-role='controlgroup'></fieldset>");



        $.each(jsonAry, function(key, val) {
            var Code = val.USER_ID;
            var Name = val.USER_NM; //근로자명

            var button = $('<input name="{2}" id="{0}" value="{0}" type="radio" abbr="{1}"/><label for="{0}">{1}</label> '.format(Code, Name, group_name));
            button.on("click", function(e){
                e.preventDefault();

                text.text(this.value);
                popup.popup('close');
            });

            if(key_id == Code) {
                $(text_name).text(Name);
                button.attr("checked", true );
            }
            if(key_name == Name) {
                $(text_name).text(Name);
                button.attr("checked", true );
            }

            fieldset.append(button);
        });

        list.append(fieldset);
        fieldset.controlgroup().controlgroup('refresh');


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }

    }

    getAJAX(url, data, sucess);

}







/// 공통코드 웹서비스 - 팝업형태 ////////////////////////////////////////////
function wsCodePopList(clsCd, text_name, list_name, radio_name, def, isSelectAll, callback) {
    var url = ws_url + 'Select_Code_List';
    var data = "{clsCd:'" + clsCd + "'}";

    var sucess = function(json) {
        if(json.d == "error")   return;

        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }



        var target = $(list_name);
        target.children().remove();

        var fieldset = $("<fieldset data-role='controlgroup' data-iconpos='right'></fieldset> ");
        fieldset.append($('<legend>'+ def +'를(을) 선택하세요</legend>'));

        if(isSelectAll) {
          var all = $("<input name='{0}' id='{0}All' type='radio' value='' checked='checked'><label for='{0}All'>[ {1} ]</label> ".format(radio_name, def));
          all.on("click", function(e) {
            e.preventDefault();

            var input_txt = $(text_name);
            input_txt.text(this.value);
            if(input_txt.hasClass("ui-input-empty-error"))
              input_txt.removeClass("ui-input-empty-error");
            $(list_name).popup('close');
          });
          fieldset.append(all);
        }

        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            var index = i+1;
            var Code = val.codeCd;
            var Name = val.codeNm;

            var button = $("<input name='{0}' id='{1}' type='radio' value='{1}' abbr='{2}'><label for='{1}'>{3}. {2}</label> ".format(radio_name, Code, Name, index));
            button.on("click", function(e) {
              e.preventDefault();

              var input_txt =$(text_name);
              input_txt.text($(this).attr("abbr"));
              input_txt.val(this.value);
              if(input_txt.hasClass("ui-input-empty-error"))
                input_txt.removeClass("ui-input-empty-error");

              $(list_name).popup('close');
            });

            fieldset.append(button);
        }

        target.append(fieldset);
        fieldset.controlgroup().controlgroup('refresh');

        $(text_name).text("[ " + def + " ]");


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);

}




/// 공통코드 웹서비스 ////////////////////////////////////////////
function wsCodeList(clsCd, target, def, callback) {
    var url = ws_url + 'Select_Code_List';
    var data = "{clsCd:'" + clsCd + "'}";

    var sucess = function(json) {
        if(json.d == "error")   return;


        var _target = new Object();
        _target = $(target);
        _target.find("option").remove();

        if(!fn_isNull(def)) {
          var all = $("<option value='' >[ {0} ]</option>".format(def));
          _target.append(all);
        }



        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            var Code = val.codeCd;
            var Name = val.codeNm;

            var button = $("<option value='{0}'>{1}</option>".format(Code, Name));
            button.on("click", function(e) {
                e.preventDefault();
            });
            _target.append(button);
        }

        //_target.trigger("create");
        //_target.selectmenu('refresh');


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);

}




/// 사용자콤보 웹서비스 ////////////////////////////////////////////
function wsUserList(srcCond, target, def, callback) {
    var url = ws_url + 'Select_Trand_Id';
    var data = "{userId:'" + srcCond + "'}";

    var sucess = function(json) {
        if(json.d == "error")   return;


        var _target = new Object();
        _target = $(target);
        _target.find("option").remove();

        if(!fn_isNull(def)) {
          var all = $("<option value='' >[ {0} ]</option>".format(def));
          _target.append(all);
        }



        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            var Code = val.USER_ID;
            var Name = val.USER_NM;

            var button = $("<option value='{0}'>{1}</option>".format(Code, Name));
            button.on("click", function(e) {
                e.preventDefault();
            });
            _target.append(button);
        }

        //_target.trigger("create");
        //_target.selectmenu('refresh');


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);

}

/// 실사시작인 회사 코드 가져오기 ////////////////////////////////////////////////////
function wsComPopList(text_name, list_name, radio_name, def, isSelectAll, callback) {
    var url = ws_url + 'Select_ASST_STATUS_List';
    var data = "";

    var sucess = function(json) {
        if(json.d == "error")   return;

        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        var target = $(list_name);
        target.children().remove();

        var fieldset = $("<fieldset data-role='controlgroup' data-iconpos='right'></fieldset> ");
        fieldset.append($('<legend>'+ def +'를(을) 선택하세요</legend>'));

        if(isSelectAll) {
          var all = $("<input name='{0}' id='{0}All' type='radio' value='' checked='checked'><label for='{0}All'>[ {1} ]</label> ".format(radio_name, def));
          all.on("click", function(e) {
            e.preventDefault();

            var input_txt = $(text_name);
            input_txt.text(this.value);
            if(input_txt.hasClass("ui-input-empty-error"))
              input_txt.removeClass("ui-input-empty-error");
            $(list_name).popup('close');
          });
          fieldset.append(all);
        }

        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            var index = i+1;
            var Code = val.COM_CD;
            var Name = val.COM_NM;
            var sType = val.TYPE;
            //alert(sType);
            var button = $("<input name='{0}' id='{1}' type='radio' value='{1}' abbr='{2}' title='{4}'><label for='{1}'>{3}. {2}</label> ".format(radio_name, Code, Name, index, sType));
            button.on("click", function(e) {
              e.preventDefault();

              var input_txt =$(text_name);
              input_txt.text($(this).attr("abbr"));
              input_txt.val(this.value);
              if(input_txt.hasClass("ui-input-empty-error"))
                input_txt.removeClass("ui-input-empty-error");

              $(list_name).popup('close');
            });

            fieldset.append(button);
        }

        target.append(fieldset);
        fieldset.controlgroup().controlgroup('refresh');

        $(text_name).text("[ " + def + " ]");


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);

}

/// 실사시작인 회사 코드 가져오기 ////////////////////////////////////////////////////
function wsGijumPopList(com_cd, text_name, list_name, radio_name, def, isSelectAll, callback) {
    var url = ws_url + 'Select_COM_GIJUM_List';
    var data = "{comCd:'" + com_cd + "'}";

    var sucess = function(json) {
        if(json.d == "error")   return;

        var list = [];
        try{
            list = JSON.parse(json.d).Table;
        }catch(e){
            return;
        }

        var target = $(list_name);
        target.children().remove();

        var fieldset = $("<fieldset data-role='controlgroup' data-iconpos='right'></fieldset> ");
        fieldset.append($('<legend>'+ def +'를(을) 선택하세요</legend>'));

        if(isSelectAll) {
          var all = $("<input name='{0}' id='{0}All' type='radio' value='' checked='checked'><label for='{0}All'>[ {1} ]</label> ".format(radio_name, def));
          all.on("click", function(e) {
            e.preventDefault();

            var input_txt = $(text_name);
            input_txt.text(this.value);
            if(input_txt.hasClass("ui-input-empty-error"))
              input_txt.removeClass("ui-input-empty-error");
            $(list_name).popup('close');
          });
          fieldset.append(all);
        }

        for (var i = 0; i < list.length; i++) {
            var val = list[i];
            var index = i+1;
            var Code = val.HNDL_CD;
            var Name = val.HNDL_NM;

            var button = $("<input name='{0}' id='{1}' type='radio' value='{1}' abbr='{2}'><label for='{1}'>{3}. {2}</label> ".format(radio_name, Code, Name, index));
            button.on("click", function(e) {
              e.preventDefault();

              var input_txt =$(text_name);
              input_txt.text($(this).attr("abbr"));
              input_txt.val(this.value);
              if(input_txt.hasClass("ui-input-empty-error"))
                input_txt.removeClass("ui-input-empty-error");

              $(list_name).popup('close');
            });

            fieldset.append(button);
        }

        target.append(fieldset);
        fieldset.controlgroup().controlgroup('refresh');

        $(text_name).text("[ " + def + " ]");


        //콜백처리
        if(  typeof callback === "function"){
            callback();
        }
    };

    getAJAX(url, data, sucess);

}

