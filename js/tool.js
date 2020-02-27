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
        close_modal : object.close_modal || $(".modal:visible") //应关闭模态框
    }

    $.ajax({
        url     : object.url,
        data    : um_data_get(object.form),
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
    var pager_state = object.page_dom.find('.pager').data('zui.pager').state;
    object.page_dom.find("[name='page']").val( pager_state.page );
    object.page_dom.find("[name='recPerPage']").val( pager_state.recPerPage );
    var remote = {
        url     : object.url,
        type    : "POST",
        dataType: "json",
        data    : um_data_get(object.page_dom.find(".tool-search"))
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