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
    
    //按钮组-结果导出
    $(document).on("click",".btn_group_result label",function(){
        var btn_group = $(this).parents(".btn_group_result");
        var result = "";
        setTimeout(function(){
            var btn_che = btn_group.find("label.active");
            for(var i=0;i<btn_che.length;i++){
                result += btn_che.eq(i).find("input").val() + ",";
            }
            result = result.substr(0,result.length-1);
            btn_group.attr("result",result);
        },50);
    });

    //checkbox-toggle
    $(document).on("click",".for_label_toggle",function(){
        var icon = $(this).find(".icon");
        if( icon.hasClass("icon-check-empty") ){
            icon.removeClass("icon-check-empty").addClass("icon-checked");
        } else {
            icon.removeClass("icon-checked").addClass("icon-check-empty");
        }
    });

    /*模态框-隐藏-重置[弃用]
    $(document).on("show.zui.modal",".modal",function(){
        $(this).find("form")[0].reset();
    });*/

    //…

});//预加载结尾

//变量声明----------------------------------------------------------------------------------
//正则规则
var reg_ip   = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
var reg_2_10 = /^.{2,10}$/;
var reg_tel  = /^[1][0-9]{10}$/;
/*正则使用
if (!reg_2_10.test(setup_base_add_comp.val())){ um_tip("公司名称格式错误","1500"   ,"text-danger"); return; }
if (!reg_2_10.test(setup_base_add_user.val())){ um_tip("企业管理人格式错误","1500" ,"text-danger"); return; }
if (!reg_2_10.test(setup_base_add_addr.val())){ um_tip("地区称格式错误","1500"     ,"text-danger"); return; }
if (!reg_ip.test(setup_base_add_ip.val()))    { um_tip("IP格式错误","1500"         ,"text-danger"); return; }
*/

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
//月日
var option_month_day = {
    autoclose: 1,
    startView: 3,
    minView  : 2,
    format   : "mm-dd"
}

//富文本编辑器(如需表情/地图/图片上传=>解压plugins.zip)
var option_editor = {
    basePath   : "./lib/kindeditor/",
    cssPath    : "./css/zui.min.css",
    bodyClass  : "article-content",
    width      : "100%",
    height     : "280",
    resizeType : 1,
    items      : [
        'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
        'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        'anchor', 'link', 'unlink', '|', 'about'
    ],
    uploadJson            : API.test_editor, 
    allowPreviewEmoticons : true,
    allowImageUpload      : true,
    allowFileManager      : true,
    afterBlur             : function(){ this.sync(); }  //失焦执行
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
function zui_datagrid_reset(datagrid_obj,datagrid_url,checkbox_clear){

    //延时调用
    setTimeout(function(){

        //面板关闭
        $(".modal").modal("hide");

        //表单重置
        var form = $(".modal form");
        for(var i=0;i<form.length;i++){
            form[i].reset();
        }

        //表格勾选去除
        if( checkbox_clear=="clear" ){
            for(var i=0;i<datagrid_obj.getCheckItems().filter(function(e){return e}).length;i++){
                datagrid_obj.checkRow(i,false);
            }
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

/* zui_upload_free()    自由上传
 * @param   upapi       string 上传路径接口
 * @param   upid        string 上传组件ID
 * @param   staticFiles array  静态文件
 * @param   maxSize     string 大小限定 (default : "1mb" )
 * @param   count       number 个数限制
 * @return              object 参数对象
 */
var zui_upload_free_path = "";
function zui_upload_free(upapi,upid,staticFiles,maxSize="1mb",type="img",fileList="grid",count=""){

    //修改赋值
    $("#"+upid).attr("path","");                                        //属性清空
    if( staticFiles && staticFiles!="" ){
        var staticFiles_result = "";
        for(var i=0;i<staticFiles.length;i++){
            staticFiles_result+=staticFiles[i].url+",";
        }
        staticFiles_result = staticFiles_result.substr(0,staticFiles_result.length-1);
        $("#"+upid).attr("path",staticFiles_result);
        console.log(staticFiles_result);
    }

    //类型设定
    var mime_types = [];
    if( type=="img" ){
        mime_types = [{title:"图片",extensions:"jpg,png"}]
    }

    //配置返回
    return {
        url                 : upapi,                                    //上传路径
        fileList            : fileList,                                 //列表配置
        previewImageIcon    : true ,                                    //图片预览
        autoUpload          : true,                                     //自动上传
        limitFilesCount     : count,                                    //个数限制
        filters             : {                                         //文件过滤
            mime_types         : mime_types,                            //类型限定
            max_file_size      : maxSize,                               //大小限定
            prevent_duplicates : true                                   //重传禁止
        },
        multipart_params    : function(file,params){                    //参数提交
            return { upid:upid };
        },
        responseHandler     : function(res,file){                       //远程响应
            var data = um_json(res.response);
            if( count==1 ){
                $("#"+data.upid).attr("path",data.file);
            } else {
                zui_upload_free_path+= data.file+",";
                $("#"+data.upid).attr("path",zui_upload_free_path);
            }
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
 */
function common_tree_staff(selector,company_id,is_open,is_check){

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
            result = result.substr(0,result.length-1);
            selector.attr("result",result);

        });

    }

}

/* common_tree_staff_read() 节点树员工读取
 * @param selector     object  DOM对象
 * @param edit_data    json    修改用数据
 */
function common_tree_staff_read(selector,edit_data){

    //节点树刷新
    selector.data("zui.tree").reload(edit_data);

    //结果导出
    var che = selector.find(".icon-checked");
    var result = "";
    for( var i=0;i<che.length;i++ ){
        var che_numb = $(che[i]).attr("numb");
        var che_type = $(che[i]).attr("type");
        if( che_type!="0" && che_numb!=undefined ){ result+=che_numb+","; }
    }
    result = result.substr(0,result.length-1);
    selector.attr("result",result);

}

/* common_tree_staff_reset() 节点树员工重置
 * @param selector     object  DOM对象
 */
function common_tree_staff_reset(selector){
    selector.find(".icon-checked").removeClass("icon-checked").addClass("icon-check-empty");
    selector.attr("result","");
    selector.find(".has-list").removeClass("open in");
}

/* common_for_label_toggle_reset() label-checkbox重置
 * @param selector     object  DOM对象
 */
function common_for_label_toggle_reset(selector){
    selector.find(".icon").removeClass("icon-checked").addClass("icon-check-empty");
}

/* common_form_reset() 表单重置
 * @param uploader     object  上传对象
 */
function common_form_reset(uploader){
    //表单重置
    var form = $("form");
    for( var i=0;i<form.length;i++ ){
        form[i].reset();
    }
    //上传重置
    if( uploader ){
        var upload_obj = uploader.data("zui.uploader");
        if( upload_obj!=undefined ){
            var files = upload_obj.getFiles();
            var dele_arr = []
            for( var i=0;i<files.length;i++ ){
                dele_arr.push(files[i]);
            }
            for( var i=0;i<dele_arr.length;i++ ){
                upload_obj.removeFile(dele_arr[i]);
            }
        }
    }
}

//跟踪日志---------------------------------------------------------------------------
$(function(){
    //图片查看
    $(document).on("click",".common_topic_imgs_btn",function(){
        $(this).next().is(":visible") ? $(this).next().hide() : $(this).next().show();
    });
    //回复点击
    $(document).on("click",".common_topic_answer_btn",function(){
        common_topic_answer_reset();
        $(this).next(".common_topic_answer_text_wrap").show();
    });
});
//回复重置
function common_topic_answer_reset(){
    $(".common_topic_imgs_box").hide();
    $(".common_topic_answer_text_wrap").hide();
    $(".common_topic_answer_text").val("");
    $(".common_topic_answer_submit").attr("tid","");
}