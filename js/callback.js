$(function(){

    //时间格式化-----------------------------------------------------------------------------------------------
    //年月日
    var option_date = {
        autoclose: 1,
        startView: 2,
        minView  : 2,
        format   : "yyyy-mm-dd"
    }
    //年月日时
    var option_time = {
        autoclose: 1,
        startView: 2,
        minView  : 1,
        format   : "yyyy-mm-dd hh:ii"
    }
 
    //时间组件
    $(".form-date").datetimepicker(option_date);
    $(".form-time").datetimepicker(option_time);
    
    //模态框显示-----------------------------------------------------------------------------------------------
    $(".modal").on("shown.zui.modal",function(){

        // //上传组件
        // $(".uploader-square-box .uploader").uploader({
        //     //性能预置
        //     autoUpload          : true,                                         //自动上传
        //     autoResetFails      : false,                                        //自动重传
        //     max_retries         : 3,                                            //重传次数
        //     chunk_size          : "1mb",                                        //分传大小
        //     //前端限定
        //     multi_selection     : true,                                         //多选限制
        //     limitFilesCount     : 1,                                            //个数限制
        //     filters             : {                                             //文件过滤
        //         mime_types          : [{title:"图片",extensions:"jpg,png"}],    //类型限定
        //         max_file_size       : "1mb",                                    //大小限定
        //         prevent_duplicates  : true                                      //重传禁止
        //     }
        // });

        //灯箱调用
        $("[data-toggle='lightbox']").lightbox();

    });

    //模态框隐藏-----------------------------------------------------------------------------------------------
    $(".modal").on("hidden.zui.modal",function(){
        $(".modal-backdrop").hide();
    });


});//预加载结尾


