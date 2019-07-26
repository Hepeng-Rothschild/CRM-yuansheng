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
    // =========================
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
    // ==========================
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
    // ================
    $.fn.pushMenu.noConflict = function () {
      $.fn.pushMenu = old;
      return this;
    };
  
    // Data API
    // ========
    $(document).on('click', Selector.button, function (e) {
      e.preventDefault();
      Plugin.call($(this), 'toggle');
    });
    $(window).on('load', function () {
      Plugin.call($(Selector.button));
    });
}(jQuery);

if(false){
    //禁止右键
    //document.oncontextmenu = function(){ return false; }
    //禁止选中
    if (typeof(document.onselectstart) != 'undefined') {
        document.onselectstart = function(){ return false; }
    } else {
        document.write('<style type="text/css">body { -moz-user-select: none; }</style>');
    }
}

//正则规则
var reg_ip   = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
var reg_2_10 = /^.{2,10}$/;
var reg_tel  = /^[1][0-9]{10}$/;
 
//信息提示-警告
function mess_warning(text){
    new $.zui.Messager(text,{type:"warning",time:1000,close:false}).show();
}

//信息提示-成功
function mess_success(text){
    new $.zui.Messager(text,{type:"success",time:1500,close:false}).show();
}

//数据网格-取值(修改删除用)
function cell_value(rowIndex,colIndex){
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

/* um_reset()     重置操作
 * @param datagrid dom元素
 * @param datagrid_url url路径
 */
function um_reset(datagrid,datagrid_url){

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
        if( datagrid!=undefined && datagrid_url!=undefined){
            um_render(datagrid,datagrid_url);
        }

    },1500);

}

/*um_render()   数据表格刷新
 * datagrid     dom 数据表格
 * datagrid_url url 数据表格路径
 */
function um_render(datagrid,datagrid_url){
    datagrid.data("zui.datagrid").setDataSource(datagrid_url);
    datagrid.data("zui.datagrid").render();
}