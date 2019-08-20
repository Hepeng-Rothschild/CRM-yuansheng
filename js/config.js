
    //全局存储关闭
    $.zui.store.enable=false;

    //接口路径
    window.STATE = "local";                                         //当前状态 local  route
    window.LOCAL = "./remote/";                                     //本地路径
    window.ROUTE = "http://192.168.1.26/";                          //远程路径
    window.REC_PER_PAGE = 20;                                       //每页几条

    //组件接口
    window.API = {
        //全局接口
        common_tree     : LOCAL+"Test/common_tree.json",            //左侧导航 ROUTE+"User/GetUserPageInfo"
        common_view     : "./page/personnel_attendance_overtime.html",                    //欢迎页面 welcome personnel_train_exam admin_message_donation personnel_staff

        //测试接口
        test_datagrid   : LOCAL+"Test/test_datagrid.json",          //数据表格
        test_response   : LOCAL+"Test/test_response.json",          //数据响应
        test_export     : LOCAL+"Upload/test_export.pdf",           //导出文件
    }
    /*
    数据表格 宽度标准
    id      50
    sexy    50
    default 80
    tels    100
    full    .1
    operate 180
    */