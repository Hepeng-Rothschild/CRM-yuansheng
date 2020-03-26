//表单函数-----------------------------------------------------------------------------------
//表单重置
function common_form_reset(){
    var form = $(".modal form");
    for( var i=0;i<form.length;i++ ){
        form[i].reset();
    }
}

/* 下拉选项
 * @param dom object 节点对象
 * param  object     参数对象
 */
function um_select_option(object){
    //接收参数
    object = {
        dom  : object.dom,              //DOM对象
        url  : object.url,              //接口url
        type : object.type,             //接口type
        value: object.value || 'id',    //字段值
        field: object.field || 'name',  //字段名称
        use  : object.use   || '',      //使用用途
        data : object.data  || {        //请求参数
            // "posttype": object.type,
            // "postdata": [
            //     {
            //         "pageCount":"1",
            //         "pageSize" :"20"
            //     }
            // ]
        }
    }
    //远程请求
    $.ajax({
        url     : object.url,
        data    : JSON.stringify(object.data),
        type    : "post",
        dataType: "json",
        success : function(data){
            var data = data.data;
            var option = '';
            if( object.use=='search' ){
                option="<option value=''>全部</option>";
            } else if( object.use=='select' ){
                option="<option value=''>-- 请选择 --</option>";
            }
            for(var i=0;i<data.length;i++){
                if( data[i][object.field] ){
                    option += "<option value='"+data[i][object.value]+"'>"+data[i][object.field]+"</option>";
                }
            }
            object.dom.html(option);
        }
    });
}

// 下拉菜单-二级联动
function um_distpicker(object){
    var object = {
        url : object.url, // 请求地址
        data : object.data || {}, // 请求参数
        select1 : object.select1, // 下拉选择1
        select2 : object.select2, // 下拉选择2
        field_id : object.field_id || 'id', // 字段id
        field_name : object.field_id || 'name', // 字段name
        field_children : object.field_children || 'children', // 字段chidren
    }
    $.ajax({
        url : object.url,
        data : object.data,
        success : function(res){
            var json = res.data;
            for (var k1 in json){
                object.select1.append("<option index='" + k1 + "' value='" + json[k1][object.field_id] + "'>" + json[k1][object.field_name] + "</option>");
            }
            object.select1.change(function(){
                object.select2.html('<option value="">-- 请选择 --</option>');
                var index = $(this).find("option:selected").attr("index");
                if(index !== undefined){
                    var children = json[index][object.field_children];
                    for(var k2 in children){
                        object.select2.append('<option value="' + children[k2][object.field_id] + '">' + children[k2][object.field_name] + '</option>');
                    }
                }
            });
        }
    });
}

/* 表单赋值
 * param form_dom 表单DOM
 * param json JSON数据
 */
function um_data_set(form_dom, json){
    $.each(json, function(key,val){
        $.each(form_dom.find("[name]"), function(i){
            var input_dom = form_dom.find("[name=" + key + "]");
            // 单选框赋值
            if( input_dom.attr('type') == 'radio' ) {
                form_dom.find("[type='radio'][name=" + key + "][value="+ val + "]").attr('checked','checked');
            // 复选框赋值(val须是数组)
            } else if ( input_dom.attr('type') == 'checkbox' ) {
                $.each(val, function(k,v){
                    form_dom.find("[type='checkbox'][name=" + key + "][value="+ v + "]").attr('checked','checked');
                });
            // 表单赋值 input textarea select
            } else {
                input_dom.val(val);
            }
        });
    });
}

/* 表单取值
 * param form_dom 表单DOM
 * return string  表单参数
 */
function um_data_get(form_dom){
    var data = form_dom.serializeArray();   // 表单序列化
    var json = arrayGroupCount(data);       // 数组分组统计(复选框用)
    return json;
}

// 数组分组统计
function arrayGroupCount(data){
    var json = [];
    var objs = {};
    data.forEach(function(i){
        if (!objs[i.name]) {
        　　json.push(i);
        　　objs[i.name] = i;
        } else {
            json.forEach(function(a){
                if(a.name == i.name){
                    a.value = a.value +','+i.value;
                }
        　　});
        }
    });
    return json;
}

/* 表单提交
 * param object 参数对象
 */
function um_data_submit(object){
    var object = {
        url         : object.url  || '',                        //接口url
        type        : object.type || '',                        //接口type
        form        : object.form || '',                        //操作表单
        datagridDom : object.datagridDom || object.form.parents('.page-wrapper').find('.datagrid'), //表格DOM
        dataSource  : object.dataSource  || '',                 //表格数据源对象
        checkClear  : object.checkClear  || false,              //表格复选框清理
        close_modal : object.close_modal || $(".modal:visible"),//应关闭模态框
        stringify   : object.stringify   || false,              //代码格式化
    }
    var data = um_data_get(object.form);
    if( object.stringify === true ){
        var stringifyData = {};
        data.forEach(function(i){
            stringifyData[i.name] = i.value;
        });
        data = {
            requestJson: JSON.stringify(stringifyData)
        }
    }
    $.ajax({
        url     : object.url,
        data    : data,
        type    : "post",
        dataType: "json",
        success : function(data){
            if( data.status==1 ){
                um_tip(data.message);
                setTimeout(function(){
                    object.close_modal.modal("hide");
                    for(var i=0;i<object.form.length;i++){ object.form[i].reset(); }
                    var datagrid_obj = object.datagridDom.data("zui.datagrid");
                    if( object.checkClear ){
                        for(var i=0;i<datagrid_obj.getCheckItems().filter(function(e){return e}).length;i++){
                            datagrid_obj.checkRow(i,false);
                        }
                    }
                    zui_datagrid_render({
                        datagrid_obj : datagrid_obj,
                        dataSource   : object.dataSource
                    });
                },1500);
            } else {
                um_tip(data.message,"1500","text-danger");
            }
        },
        error: function(){
            console.log('提交失败');
        }
    });
}

//数据表格-----------------------------------------------------------------------------------

/* 配置参数
 * param object     参数对象
 *       datagrid   数据表格DOM对象
 *       dataSource 数据表格数据源对象
         height     数据表格高度
 * return object    配置参数
 */
function zui_datagrid_option(object){
    var option = {
        height      : object.height || window.innerHeight - object.datagrid.find(".datagrid-container").offset().top - 53,
        sortable    : false,
        cache       : false,
        showRowIndex: true,
        checkByClickRow: false,
        configs     : { R0:{className:"text-center"} },
        states      : { pager : { page : 1, recPerPage : 20 } },
        checkable   : object.checkable  || false,
        selectable  : false,
        dataSource  : object.dataSource,
        rowDefaultHeight : object.rowDefaultHeight || 36,
        totalFlag   : object.totalFlag || false,
        valueOperator : {
            string : {
                getter : function(dataValue,cell,dataGrid){
                    if( dataValue==null ){ dataValue = ''; }
                    return dataValue;
                }
            }
        }
    }
    return option;
}

/* 数据刷新
 * param object       参数对象
 *       datagrid_obj 数据表格实例化对象
 *       dataSource   数据表格数据源对象
 */
function zui_datagrid_render(object){
    object.datagrid_obj.setDataSource(object.dataSource);
    object.datagrid_obj.render();
}

/* 数据请求
 * param  object   参数对象
 *        page_dom 页面对象
 *        url      接口url
 *        type     接口type
 * return object   请求参数
 */
function zui_datagrid_remote(object){
    var defaultValue = (STATE == 'local') ? false : true;
    var object = {
        page_dom : object.page_dom,
        url      : object.url,
        mode     : object.mode || defaultValue // false对接JSON true对接后台[###]
    }
    var pager_state = object.page_dom.find('.pager').data('zui.pager').state;
    object.page_dom.find("[name='page']").val( pager_state.page );
    object.page_dom.find("[name='recPerPage']").val( pager_state.recPerPage );
    var data = um_data_get(object.page_dom.find(".tool-search"));
    var remote = {};
    if(object.mode == false){
        remote = {
            url     : object.url,
            type    : "POST",
            dataType: "json",
            data    : data
        }
    } else {
        var searchObject = {};
        data.forEach(function(i){
            searchObject[i.name] = i.value;
        });
        //如搜索关键字为空 那么sid=0
        if(searchObject.search == '' || searchObject.proname == ''){
            searchObject.sid = 0;
        }
        delete searchObject.page;
        delete searchObject.recPerPage;
        remote = {
            url     : object.url,
            type    : "POST",
            dataType: "json",
            data    : {
                requestjson: JSON.stringify({
                    searchObject: searchObject,
                    page: pager_state.page,
                    recPerPage: pager_state.recPerPage
                }) 
            }
        }
    }
    return remote;
}
 
/* 数据过滤
 * param  object   参数对象
 *        page_dom 页面对象
 *        data     远程数据
 * return object   远程数据
 */
function zui_datagrid_filter(object){
    var pager_state = object.page_dom.find('.pager').data('zui.pager').state;
    //请求超时
    // if( object.data.code==9997 ){
    //     um_tip(object.data.msg,"1500","text-danger");
    //     return;
    // }
    // //请求成功
    // if( object.data.code==0 && object.data.pager ){
    //     object.data.pager = {
    //         "page"      : pager_state.page,
    //         "recPerPage": pager_state.recPerPage,
    //         "recTotal"  : object.data.pager.recTotal,
    //     }
    // } else {
    //     object.data.result = 'ok';
    //     object.data.data = [];
    //     object.data.pager = {
    //         "page"      : pager_state.page,
    //         "recPerPage": pager_state.recPerPage,
    //         "recTotal"  : 0
    //     }
    // }
    // console.log(object.data)
    return object.data;

}

// 节点树创建
function common_tree_create(object){

    // 变量声明
    var object = {
        dom : object.dom, // DOM选择器
        is_open : object.is_open || false, // 是否展开
        is_check : object.is_check || false, // 是否可选
        url : object.url || API.common_staff, // 请求地址(默认员工)
        data : object.data || {}, // 请求参数
        field_id : object.field_id || 'userid', // 响应字段 id
        field_text : object.field_text || 'text', // 响应字段 text
    }

    // 节点树生成
    $.ajax({
        url     : object.url,
        type    : "post",
        dataType: "json",
        data    : object.data,
        success : function(data){
            var data = um_json(data);
            if( data.status>0 ){
                object.dom.tree({
                    //参数配置
                    animate     : false,
                    initialState: "normal",
                    data        : data,
                    itemWrapper : true,
                    itemCreator : function($li,item){
                        if( object.is_open==true ){ $li.addClass("open"); } //是否展开
                        //是否可选
                        if( object.is_check==true ){
                            $li.append('<label class="thin"><input type="checkbox"><span dataId="'+ item[object.field_id] +'">'+ item[object.field_text] +'</span></label>');
                        } else {
                            $li.append('<span>'+ item.text +'</span>');
                        }
                    }
                });
            }
        }
    });

    // 节点树可选
    if( object.is_check==true ){
        object.dom.on("change", '[type="checkbox"]',function(){
            // 向下影响
            var sonCheckbox = $(this).parent().siblings('ul').find('[type="checkbox"]'); // 下级的checkbox
            if( $(this).is(':checked') ){
                sonCheckbox.prop("checked","checked");
            } else {
                sonCheckbox.removeAttr("checked");
            }
            // 向上影响
            var allTreeUl = object.dom.parent().find("ul"); // 所有的UL
            allTreeUl.each(function(i){
                var checkedCheckboxUl = allTreeUl.eq(i).children("li").children("label").children('[type="checkbox"]:checked').parents("ul");
                var unCheckedCheckbox = allTreeUl.eq(i).find('[type="checkbox"]:not(:checked)');
                if( unCheckedCheckbox.length==0 ){
                    checkedCheckboxUl.siblings("label").children('[type="checkbox"]').prop("checked","checked");
                    checkedCheckboxUl.find('[type="checkbox"]:not(:checked)').parent("label").parents("ul").siblings("label").children('[type="checkbox"]').removeAttr("checked");
                } else {
                    checkedCheckboxUl.siblings("label").children('[type="checkbox"]').removeAttr("checked");
                }
            }); 
            // 结果导出
            var checkedCheckbox = object.dom.find('[type="checkbox"]:checked');
            var result_id = [];
            var result_text = [];
            for( var i=0;i<checkedCheckbox.length;i++ ){
                var id = $(checkedCheckbox[i]).siblings('span').attr("dataId");
                var text = $(checkedCheckbox[i]).siblings('span').text();
                if( id!='undefined' ){
                    result_id.push( id );
                    result_text.push( text );
                }
            }
            object.dom.siblings('.tree_result_id').val( JSON.stringify( result_id ) );
            object.dom.siblings('.tree_result_text').val( JSON.stringify( result_text ) );
        });

    }

}

// 节点树重置
function common_tree_reset(object){
    object.dom.find('[type="checkbox"]').removeAttr("checked");
    object.dom.siblings('.tree_result_id').val('');
    object.dom.siblings('.tree_result_text').val('');
}

// 节点树赋值
function common_tree_setData(object){

    // 变量声明
    var object = {
        dom : object.dom, // DOM节点
        data : object.data, // 节点数据
        field_id : object.field_id || 'userid', // 响应字段id
        field_cheKey : object.field_cheKey || 'checkd', // 选中key
        field_cheVal : object.field_cheVal || '1', // 选中value
    }

    // 节点重置
    object.dom.data("zui.tree").reload(object.data);
    object.dom.find('[type="checkbox"]').removeAttr("checked");

    // 节点选中
    var data = object.data;
    forEachChildren(data);
    function forEachChildren(data){ //遍历树  获取id数组
      for(var i in data){
        if( data[i][object.field_id] !=undefined && data[i][object.field_cheKey] == object.field_cheVal ){
            $('span[dataId="'+ data[i][object.field_id] +'"]').siblings('[type="checkbox"]').prop("checked","checked");
        }
        if(data[i].children){
          forEachChildren(data[i].children);
        }
      }
    };
    // 向上影响
    var allTreeUl = object.dom.parent().find("ul"); // 所有的UL
    allTreeUl.each(function(i){
        var checkedCheckboxUl = allTreeUl.eq(i).children("li").children("label").children('[type="checkbox"]:checked').parents("ul");
        var unCheckedCheckbox = allTreeUl.eq(i).find('[type="checkbox"]:not(:checked)');
        if( unCheckedCheckbox.length==0 ){
            checkedCheckboxUl.siblings("label").children('[type="checkbox"]').prop("checked","checked");
            checkedCheckboxUl.find('[type="checkbox"]:not(:checked)').parent("label").parents("ul").siblings("label").children('[type="checkbox"]').removeAttr("checked");
        } else {
            checkedCheckboxUl.siblings("label").children('[type="checkbox"]').removeAttr("checked");
        }
    }); 
    // 结果导出
    var checkedCheckbox = object.dom.find('[type="checkbox"]:checked');
    var result_id = [];
    var result_text = [];
    for( var i=0;i<checkedCheckbox.length;i++ ){
        var id = $(checkedCheckbox[i]).siblings('span').attr("dataId");
        var text = $(checkedCheckbox[i]).siblings('span').text();
        if( id!='undefined' ){
            result_id.push( id );
            result_text.push( text );
        }
    }
    object.dom.siblings('.tree_result_id').val( JSON.stringify( result_id ) );
    object.dom.siblings('.tree_result_text').val( JSON.stringify( result_text ) );
}

// 审批创建
function common_approval_create(object){
    var object = {
        dom : object.dom, // 节点DOM
        url : object.url, // 请求地址
        data : object.data || {}, // 请求参数
        field_staff : object.staff || 'staff', // 姓名字段
        field_statename : object.state || 'statename', // 状态文字
        field_statenumb : object.state || 'statenumb', // 状态数值
    }
    $.ajax({
        type:'post',
        url : object.url,
        dataType:'json',
        data : object.data,
        success:function(data){
            var data = data.data;
            var temp = `<dl class="finish"><dt>第0步</dt><dd><b>【流程开始】</b><p>流程开始</p></dd></dl>`;
            for(var i=0;i<data.length;i++){
                temp+= data[i][object.field_statenumb] ? `<dl class="finish">` : `<dl>`;
                temp+=`<dt>第${i+1}步</dt><dd><b>【${ data[i][object.field_staff]}】</b><p>${ data[i][object.field_statename]}</p></dd></dl>`;
            }
            object.dom.html(temp);
        }
    });
}

// 审批读取
function common_approval_setData(object){
    var object = {
        dom : object.dom, // 节点DOM
        data : object.data, // 节点数据
        field_staff : object.staff || 'staff', // 员工姓名
        field_statename : object.state || 'statename', // 状态文字
        field_statenumb : object.state || 'statenumb', // 状态数值
    }
    var data = object.data;
    var temp = `<dl class="finish"><dt>第0步</dt><dd><b>【流程开始】</b><p>流程开始</p></dd></dl>`;
    for(var i=0;i<data.length;i++){
        temp+= data[i][object.field_statenumb] ? `<dl class="finish">` : `<dl>`;
        temp+=`<dt>第${i+1}步</dt><dd><b>【${ data[i][object.field_staff]}】</b><p>${ data[i][object.field_statename]}</p></dd></dl>`;
    }
    object.dom.html(temp);
}

// 时间差获取
function um_date_duration(object){
    var object = {
        starttime : object.starttime, // 开始时间DOM
        endtime : object.endtime, // 结束时间DOM
        duration : object.duration || null, // 时间差DOM
        mode : object.mode || 'string' // 返回模式
    }
    if( object.starttime.val() !="" && object.endtime.val() !="" ){
        var dur = new Date( object.endtime.val() ).getTime() - new Date( object.starttime.val() ).getTime();
        //if ( dur > 0 ){} else { um_tip("时间不合法","1500","text-danger"); }
        var day = Math.floor(dur / 1000 / 60 / 60 / 24);
        dur = dur % (1000 * 60 * 60 * 24);
        var hour = Math.floor(dur / 1000 / 60 / 60);
        var result = '';
        if( object.mode =='string'){
            result = day + "天";
            if( hour!==0 ){ result += hour + "小时" }
        } else if( object.mode == 'object'){
            result = {day, hour};
        }
        if( object.duration != null ){
            object.duration.val( result );
        } else {
            return result;
        }
    }
}