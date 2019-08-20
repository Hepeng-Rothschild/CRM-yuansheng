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

//框架补丁----------------------------------------------------------------------------------
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

//配置声明----------------------------------------------------------------------------------
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
//当前时间
Date.prototype.Format = function (fmt){
    var o = {
        "M+": this.getMonth() + 1,                  //月
        "d+": this.getDate(),                       //日 
        "H+": this.getHours(),                      //小时 
        "m+": this.getMinutes(),                    //分 
        "s+": this.getSeconds(),                    //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3),//季度 
        "S": this.getMilliseconds()                 //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

//数据网格-取值(修改删除用)
function cell_value(rowIndex,colIndex){
  //return datagrid_obj.getCell(rowIndex,colIndex).value;
    return $(".datagrid").data("zui.datagrid").getCell(rowIndex,colIndex).value;
}

/* um_json() JSON转义
 * @param  data (object|string)
 * @return object
 */
function um_json(data){
    while ( typeof data == "string" ){
        data = JSON.parse(data);
    }
    return data;
}

/* um_tip() 信息提示
 * @param text  提示文本 string 
 * @param time  持续时间 string (default:1500|0为不消失)
 * @param cls   提示字色 string (default:"text-success")
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

/*um_height() 数据表格高度
 * @param  datagrid object
 * @return height   number
 */
function um_height(datagrid){
    var height = window.innerHeight - datagrid.find(".datagrid-container").offset().top - 53;
    return height;
}

/* um_reset() 重置操作
 * @param datagrid_obj object
 * @param datagrid_url string
 */
function um_reset(datagrid_obj,datagrid_url){

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
            um_render(datagrid_obj,datagrid_url);
        }

    },1500);

}

/*um_render() 数据表格刷新
 * @param datagrid_obj object
 * @param datagrid_url string
 */
function um_render(datagrid_obj,datagrid_url){
    datagrid_obj.setDataSource(datagrid_url);
    datagrid_obj.render();
}

/* upload_fixed()   固定上传
 * @param   upapi   上传路径接口
 * @param   upid    上传组件ID
 * @param   array   静态文件
 * @return  object  参数对象
 */
function upload_fixed(upapi,upid,staticFiles){
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

/* upload_free()    自由上传
 * @param   upapi   上传路径接口
 * @param   upid    上传组件ID
 * @param   array   静态文件
 * @return  object  参数对象
 */
var upload_free_path = "";
function upload_free(upapi,upid,staticFiles){
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
            upload_free_path = upload_free_path+","+data.path;
            $("#"+data.upid).attr("path",upload_free_path);
        },
        staticFiles         : staticFiles || [],                        //静态文件
        deleteActionOnDone  : function(file,doRemoveFile){              //远程删除
            doRemoveFile();                                             //本地删除
            $("#"+upid).attr("path","");
        }
    }
}

/* um_tree_check() 可选择节点树
 * @param  object selector (id/class)
 */
function um_tree_check(selector){
    selector.on("click","span",function(){

        //变量声明
        var empt = "icon-check-empty";
        var chec = "icon-checked";
        var span = $(this);
        var icon = span.find(".icon");
        var type = icon.parent().attr("type");
        var son  = icon.parent().next("ul").find(".icon");
        var dad  = span.parent().parent().siblings("span").find(".icon");
        var bro  = span.parent().parent().find("span");

        //选中影响(父级对子级)
        if( icon.hasClass(empt) ){
            icon.removeClass(empt).addClass(chec);
            if( type=="level1" ){ son.removeClass(empt).addClass(chec); }
        } else {
            icon.removeClass(chec).addClass(empt);
            if( type=="level1" ){ son.removeClass(chec).addClass(empt); }
        } 

        //选中影响(子级对父级)
        var brod = bro.find(".icon-checked").parent();
        if( type=="level2" ){
            if( brod.length==bro.length ){
                dad.removeClass(empt).addClass(chec);
            } else {
                dad.removeClass(chec).addClass(empt);
            }
        }
       
        //结果导出
        var che = selector.find("ul .icon-checked");
        var arr = [];
        for( var i=0;i<che.length;i++ ){ arr.push( $(che[i]).parent().attr("numb") ) }
        selector.attr("result",arr);
    
    });
}

/* um_tree_check_read()  可选择节点树读取(修改用)
 * @param  object selector (id/class)
 * @param  json   data
 */
function um_tree_read(selector,data){

    //节点读取
    selector.tree({
        animate     : false,
        initialState: "normal",
        data        : data || [],
        itemWrapper : true,
        itemCreator : function($li,item){
            $li.addClass("open");
            $li.append($("<span>",{type:item.type,numb:item.numb}).html(
            "<i class='icon icon-"+item.icon+"'></i> "+item.title
            ));
        }
    });
       
    //结果导出
    var che = selector.find("ul .icon-checked");
    var arr = [];
    for( var i=0;i<che.length;i++ ){ arr.push( $(che[i]).parent().attr("numb") ) }
    selector.attr("result",arr);

}

//
function common_tool_search_date(selector){
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