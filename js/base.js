//底层代码----------------------------------------------------------------------------------
//PushMenu()
+function ($) {
    'use strict';

    var DataKey = 'lte.pushmenu';

    var Default = {
        collapseScreenSize   : 767,
        expandOnHover        : false,
        expandTransitionDelay: 200
    };

    var Selector = {
        collapsed     : '.sidebar-collapse',
        open          : '.sidebar-open',
        mainSidebar   : '.main-sidebar',
        contentWrapper: '.content-wrapper',
        searchInput   : '.sidebar-form .form-control',
        button        : '[data-toggle="push-menu"]',
        mini          : '.sidebar-mini',
        expanded      : '.sidebar-expanded-on-hover',
        layoutFixed   : '.fixed'
    };

    var ClassName = {
        collapsed    : 'sidebar-collapse',
        open         : 'sidebar-open',
        mini         : 'sidebar-mini',
        expanded     : 'sidebar-expanded-on-hover',
        expandFeature: 'sidebar-mini-expand-feature',
        layoutFixed  : 'fixed'
    };

    var Event = {
        expanded : 'expanded.pushMenu',
        collapsed: 'collapsed.pushMenu'
    };

    // PushMenu Class Definition
    var PushMenu = function (options) {
        this.options = options;
        this.init();
    };

    PushMenu.prototype.init = function () {
        if (this.options.expandOnHover
            || ($('body').is(Selector.mini + Selector.layoutFixed))) {
            this.expandOnHover();
            $('body').addClass(ClassName.expandFeature);
        }

        $(Selector.contentWrapper).click(function () {
            // Enable hide menu when clicking on the content-wrapper on small screens
            if ($(window).width() <= this.options.collapseScreenSize && $('body').hasClass(ClassName.open)) {
                this.close();
            }
        }.bind(this));

        // __Fix for android devices
        $(Selector.searchInput).click(function (e) {
            e.stopPropagation();
        });
    };

    PushMenu.prototype.toggle = function () {
        var windowWidth = $(window).width();
        var isOpen      = !$('body').hasClass(ClassName.collapsed);

        if (windowWidth <= this.options.collapseScreenSize) {
            isOpen = $('body').hasClass(ClassName.open);
        }

        if (!isOpen) {
            this.open();
        } else {
            this.close();
        }
    };

    PushMenu.prototype.open = function () {
        var windowWidth = $(window).width();

        if (windowWidth > this.options.collapseScreenSize) {
            $('body').removeClass(ClassName.collapsed)
                .trigger($.Event(Event.expanded));
        }
        else {
            $('body').addClass(ClassName.open)
                .trigger($.Event(Event.expanded));
        }
    };

    PushMenu.prototype.close = function () {
        var windowWidth = $(window).width();
        if (windowWidth > this.options.collapseScreenSize) {
            $('body').addClass(ClassName.collapsed)
                .trigger($.Event(Event.collapsed));
        } else {
            $('body').removeClass(ClassName.open + ' ' + ClassName.collapsed)
                .trigger($.Event(Event.collapsed));
        }
    };

    PushMenu.prototype.expandOnHover = function () {
        $(Selector.mainSidebar).hover(function () {
            if ($('body').is(Selector.mini + Selector.collapsed)
                && $(window).width() > this.options.collapseScreenSize) {
                this.expand();
            }
        }.bind(this), function () {
            if ($('body').is(Selector.expanded)) {
                this.collapse();
            }
        }.bind(this));
    };

    PushMenu.prototype.expand = function () {
        setTimeout(function () {
            $('body').removeClass(ClassName.collapsed)
                .addClass(ClassName.expanded);
        }, this.options.expandTransitionDelay);
    };

    PushMenu.prototype.collapse = function () {
        setTimeout(function () {
            $('body').removeClass(ClassName.expanded)
                .addClass(ClassName.collapsed);
        }, this.options.expandTransitionDelay);
    };

    // PushMenu Plugin Definition
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data(DataKey);

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option);
                $this.data(DataKey, (data = new PushMenu(options)));
            }

            if (option === 'toggle') data.toggle();
        });
    }

    var old = $.fn.pushMenu;

    $.fn.pushMenu             = Plugin;
    $.fn.pushMenu.Constructor = PushMenu;

    // No Conflict Mode
    $.fn.pushMenu.noConflict = function () {
        $.fn.pushMenu = old;
        return this;
    };

    // Data API
    $(document).on('click', Selector.button, function (e) {
        e.preventDefault();
        Plugin.call($(this), 'toggle');
    });
    $(window).on('load', function () {
        Plugin.call($(Selector.button));
    });
}(jQuery);

/*代码规范-------------------------------------------------------------
 +--------------+---------------------+--------------------------------+
 | 灵巧工具型   | um_json()           | 不依赖zui                      |
 +--------------+---------------------+--------------------------------+
 | 组件复用处理 | zui_upload_unique() | 依赖zui,复用方法,返回处理结果  |
 +--------------+---------------------+--------------------------------+
 | 涉及接口型   | common_tree_staff() | 依赖zui,固定接口,DOM组件推进   |
 +--------------+---------------------+--------------------------------+*/

//框架补丁
$(function(){

    //模拟label触发input的focus
    $(document).on("click",".im-label>span",function(){
        $(this).parent(".im-label").find("input").eq(0).focus();
    });

    //遮罩隐藏
    $(".modal-backdrop").click(function(){
        var mask = $(this);
        mask.removeClass("in");
        setTimeout(function(){
            mask.remove();
        },200);
    });

    //…

});//预加载结尾

//变量声明----------------------------------------------------------------------------------
//正则规则
var reg_ip   = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
var reg_2_10 = /^.{2,10}$/;
var reg_tel  = /^[1][0-9]{10}$/;

//时间格式化配置
//年月
var option_month = {
    autoclose: 1,
    startView: 3,
    minView  : 3,
    format   : "yyyy-mm"
}
//年月日
var option_date = {
    autoclose: 1,
    startView: 2,
    minView  : 2,
    format   : "yyyy-mm-dd"
}
//年月日时
var option_hour = {
    autoclose: 1,
    startView: 2,
    minView  : 1,
    format   : "yyyy-mm-dd hh:00"
}

//函数声明----------------------------------------------------------------------------------
//灵巧工具型--------------------------------------------------------------------------------
/* um_date()  当前时间获取(格式化)
 * @param fmt string 格式化参数
 * @return    string 时间字符串
 */
function um_date(fmt){
    var now = new Date();
    var o = {
        "M+": now.getMonth() + 1,                  //月
        "d+": now.getDate(),                       //日
        "H+": now.getHours(),                      //小时
        "m+": now.getMinutes(),                    //分
        "s+": now.getSeconds(),                    //秒
        "q+": Math.floor((now.getMonth() + 3) / 3),//季度
        "S": now.getMilliseconds()                 //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/* um_isinarray()  元素是否存在于数组中
 * @param arr      array         数组
 * @param value    string/number 元素
 */
function um_isinarray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

/* um_json() JSON转义
 * @param  data   object/string json对象
 * @return        object        object对象
 */
function um_json(data){
    while ( typeof data == "string" ){
        data = JSON.parse(data);
    }
    return data;
}

/* um_tip() 信息提示
 * @param text string 提示文本
 * @param time string 持续时间 (default:1500|0为不消失)
 * @param cls  string 提示字色 (default:"text-success")
 */
function um_tip(text,time,cls){
    $(".um-tip-mask").remove();
    var time = time || 1500;
    var cls  = cls  || "text-success";
    var html = '<div class="um-tip-mask"><div class="um-tip '+ cls +'">'+text+'</div></div>';
    $("body").append(html);
    if(time!=0){
        setTimeout(function(){
            $(".um-tip-mask").fadeOut(500);
        },time);
    }
}

//组件复用处理------------------------------------------------------------------------------
/*zui_datagrid_height() 数据表格高度
 * @param  datagrid object 数据表格DOM
 * @return          number 数据表格高度
 */
function zui_datagrid_height(datagrid){
    var height = window.innerHeight - datagrid.find(".datagrid-container").offset().top - 53;
    return height;
}

/*zui_datagrid_get_id() 数据表格行ID[注意：ID必须为列1]
 * @param  rowIndex number 行号
 * @return          string ID
 */
function zui_datagrid_get_id(rowIndex){
    return $(".datagrid").data("zui.datagrid").getCell(rowIndex,1).value;
}

/* zui_datagrid_reset() 重置操作
 * @param datagrid_obj object 数据表格对象
 * @param datagrid_url string 数据表格访问地址
 */
function zui_datagrid_reset(datagrid_obj,datagrid_url){

    //延时调用
    setTimeout(function(){

        //面板关闭
        $(".modal").modal("hide");

        //表单重置
        var form = $(".modal form");
        for(var i=0;i<form.length;i++){
            form[i].reset();
        }

        //表格刷新
        if( datagrid_obj!=undefined && datagrid_url!=undefined){
            zui_datagrid_render(datagrid_obj,datagrid_url);
        }

    },1500);

}

/*zui_datagrid_render() 数据表格刷新
 * @param datagrid_obj object 数据表格对象
 * @param datagrid_url string 数据表格访问地址
 */
function zui_datagrid_render(datagrid_obj,datagrid_url){
    datagrid_obj.setDataSource(datagrid_url);
    datagrid_obj.render();
}

/* zui_upload_fixed()   固定上传
 * @param   upapi       string 上传路径接口
 * @param   upid        string 上传组件ID
 * @param   staticFiles array  静态文件
 * @return              object 参数对象
 */
function zui_upload_fixed(upapi,upid,staticFiles){
    return {
        url                 : upapi,                                    //上传路径
        fileList            : "grid",                                   //列表配置
        previewImageIcon    : true ,                                    //图片预览
        autoUpload          : true,                                     //自动上传
        multi_selection     : true,                                     //多选限制
        limitFilesCount     : 1,                                        //个数限制
        filters             : {                                         //文件过滤
            mime_types         : [{title:"图片",extensions:"jpg,png"}], //类型限定
            max_file_size      : "1mb",                                 //大小限定
            prevent_duplicates : true                                   //重传禁止
        },
        multipart_params    : function(file,params){                    //参数提交
            return { upid:upid };
        },
        responseHandler     : function(res,file){                       //远程响应
            var data = um_json(res.response);
            $("#"+data.upid).attr("path",data.path);
        },
        staticFiles         : staticFiles || [],                        //静态文件
        deleteActionOnDone  : function(file,doRemoveFile){              //远程删除
            doRemoveFile();                                             //本地删除
            $("#"+upid).attr("path","");
        },
        uploadedMessage     : function(result){                         //上传结果
            return "上传成功";
        }
    }
}

/* zui_upload_free()    自由上传
 * @param   upapi       string 上传路径接口
 * @param   upid        string 上传组件ID
 * @param   staticFiles array  静态文件
 * @return              object 参数对象
 */
var zui_upload_free_path = "";
function zui_upload_free(upapi,upid,staticFiles){
    return {
        url                 : upapi,                                    //上传路径
        fileList            : "grid",                                   //列表配置
        previewImageIcon    : true ,                                    //图片预览
        autoUpload          : true,                                     //自动上传
        filters             : {                                         //文件过滤
            mime_types         : [{title:"图片",extensions:"jpg,png"}], //类型限定
            max_file_size      : "1mb",                                 //大小限定
            prevent_duplicates : true                                   //重传禁止
        },
        multipart_params    : function(file,params){                    //参数提交
            return { upid:upid };
        },
        responseHandler     : function(res,file){                       //远程响应
            var data = um_json(res.response);
            zui_upload_free_path = zui_upload_free_path+","+data.path;
            $("#"+data.upid).attr("path",zui_upload_free_path);
        },
        staticFiles         : staticFiles || [],                        //静态文件
        deleteActionOnDone  : function(file,doRemoveFile){              //远程删除
            doRemoveFile();                                             //本地删除
            $("#"+upid).attr("path","");
        }
    }
}

//涉及接口型--------------------------------------------------------------------------------
/* common_date_duration() 时间组件推进
 * @param selector object DOM对象
 */
function common_date_duration(selector){
    var common_tool_search_date_temp = `
        <span>时间：</span>
        <div class="input-group">
            <input type="text" class="form-control start" readonly> 
            <span class="input-group-addon fix-border fix-padding"></span>
            <input type="text" class="form-control end"   readonly>
        </div>
    `;
    selector.html(common_tool_search_date_temp);
}

/* common_select_linkage() 下拉联动
 * @param selector string  id/class
 * @param type     string  格式化类型
 */
function common_select_linkage(selector,type){

    //变量声明
    var temp_result  = "";
    var temp_company = '<label><span>分公司：</span><select class="form-control common_select_company"></select></label>';
    var temp_depart  = '<label><span>  部门：</span><select class="form-control common_select_depart" ></select></label>';
    var temp_post    = '<label><span>  职位：</span><select class="form-control common_select_post"   ></select></label>';

    //类型区分
    if( type=="1"   ){ temp_result = temp_company;                      } else
    if( type=="12"  ){ temp_result = temp_company+temp_depart;          } else
    if( type=="123" ){ temp_result = temp_company+temp_depart+temp_post;} else { console.log("无此组合"); }

    //节点推进
    $(selector).html(temp_result);

    //远程获取(分公司)
    $.ajax({
        url     : API.common_company,
        type    : "post",
        dataType: "json",
        success : function(data){
            if( data.status>0 ){
                console.log(data.data);
                //处理(分公司)
                var data = data.data;
                var option = '';
                for( var i=0;i<data.length;i++ ){
                    option += '<option value="'+ data[i].deparmenid +'">'+ data[i].deparmenname +'</option>';
                }
                $(selector).find(".common_select_company").html(option);

                //远程获取(部门)
                $.ajax({
                    url     : API.common_depart,
                    type    : "post",
                    dataType: "json",
                    data    : { id : data[0].deparmenid },      //公司ID
                    success : function(data){
                        if( data.status>0 ){

                            //处理(部门)
                            var data = data.data;
                            var option = '<option value="0">全部</option>';
                            for( var i=0;i<data.length;i++ ){
                                option += '<option value="'+ data[i].id +'">'+ data[i].name +'</option>';
                            }
                            $(selector).find(".common_select_depart").html(option);


                        }
                    }
                });//ajax

            }
        }
    });//ajax

    //远程获取(分公司->部门)---------------------------------------------------------
    $(document).on("change",selector+" .common_select_company",function(){

        //远程获取(部门)
        $.ajax({
            url     : API.common_depart,
            type    : "post",
            dataType: "json",
            data    : { id : $(this).val() },                   //公司ID

            success : function(data){
                if( data.status>0 ){
                    var data = data.data;
                    var option = '<option value="0">全部</option>';
                    for( var i=0;i<data.length;i++ ){
                        option += '<option value="'+ data[i].id +'">'+ data[i].name +'</option>';
                    }
                    $(selector).find(".common_select_depart").html(option);
                    $(selector).find(".common_select_post").html("");
                }
            }
        });

    });

    //远程获取(部门->职位)---------------------------------------------------------
    $(document).on("change",selector+" .common_select_depart",function(){

        //远程获取(职位)
        $.ajax({
            url     : API.common_post,
            type    : "post",
            dataType: "json",
            data    : { id : $(this).val() },                   //部门ID
            success : function(data){
                if( data.status>0 ){
                    var data = data.data;
                    if( data.length!=0 ){
                        var option = '<option value="0">全部</option>';
                        for( var i=0;i<data.length;i++ ){
                            option += '<option value="'+ data[i].id +'">'+ data[i].name +'</option>';
                        }
                        $(selector).find(".common_select_post").html(option);
                    } else {
                        $(selector).find(".common_select_post").html("");
                    }
                }
            }
        });

    });

}

/* common_tree_staff() 节点树员工
 * @param selector     object  DOM对象
 * @param company_id   string  公司ID
 * @param is_open      bool    是否展开
 * @param is_check     bool    是否可选
 * @param edit_data    json    修改用数据
 */
function common_tree_staff(selector,company_id,is_open,is_check,edit_data){

    //节点树生成
    $.ajax({
        url     : API.common_staff,
        type    : "post",
        dataType: "json",
        data    : { id : company_id },
        success : function(data){
            var data = um_json(data);
            if( data.status>0 ){
                selector.tree({
                    //参数配置
                    animate     : false,
                    initialState: "normal",
                    data        : data,
                    itemWrapper : true,
                    itemCreator : function($li,item){

                        //是否展开
                        if( is_open==true ){
                            $li.addClass("open");
                        }

                        //是否可选
                        if( is_check==true ){

                            //是否有工号(员工=>用户)
                            if( item.userid!="" ){
                                $li.append( $("<span>").html(`<i class="icon icon-${item.icon}" numb="${item.userid}" type="${item.type}"></i>${item.text}`) );
                            } else {
                                $li.append( $("<p class='text-muted'>").html(`${item.text}`) );
                            }

                        } else {
                            $li.append($("<span>").html(item.text));
                        }

                    }
                });
            }
        }
    });

    //节点树可选
    if( is_check==true ){
        selector.on("click","span",function(){

            //变量声明
            var empt = "icon-check-empty";
            var chec = "icon-checked";
            var midd = "icon-midd";
            var span = $(this);
            var icon = span.find(".icon");
            var numb = icon.attr("numb");
            var type = icon.attr("type");
            var son  = icon.parent().next("ul").find(".icon");

            //选中影响(父级对子级)
            if( icon.hasClass(empt) ){
                icon.removeClass(empt).addClass(chec);
                if( type=="0" ){ son.removeClass(empt).addClass(chec); }
            } else {
                icon.removeClass(chec).addClass(empt);
                if( type=="0" ){ son.removeClass(chec).addClass(empt); }
            }

            //选中影响(子级对父级)
            var all_dad = selector.parent().find("ul");
            all_dad.each(function(i){
                var che_son = all_dad.eq(i).children("li").children("span").children(".icon-checked");
                var has_empty = all_dad.eq(i).find(".icon-check-empty");
                if( has_empty.length==0 ){
                    che_son.parents("ul").siblings("span").children(".icon").removeClass(empt).addClass(chec);
                    che_son.parents("ul").find(".icon-check-empty").parent("span").parents("ul").siblings("span").children(".icon").removeClass(chec).addClass(empt);
                } else {
                    if( type=="0" ){
                        che_son.removeClass(chec).addClass(empt);
                    } else {
                        che_son.parents("ul").siblings("span").children(".icon").removeClass(chec).addClass(empt);
                    }
                }
            });

            //结果导出
            var che = selector.find(".icon-checked");
            var result = "";
            for( var i=0;i<che.length;i++ ){
                var che_numb = $(che[i]).attr("numb");
                var che_type = $(che[i]).attr("type");
                if( che_type!="0" && che_numb!=undefined ){ result+=che_numb+","; }
            }
            var result = result.substr(0,result.length-1);
            selector.attr("result",result);

        });

    }

}