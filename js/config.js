
    //全局存储关闭
    $.zui.store.enable=false;

    //接口路径
    window.LOCAL = "./remote/";                                     //本地路径
    window.ROUTE = "http://192.168.1.167/";                         //远程路径

    //组件接口
    window.API = {
        //全局接口
        common_tree     : LOCAL+"Common/common_tree.json",          //左侧导航 ROUTE+"User/GetUserPageInfo"
        common_view     : "./page/personnel_staff.html",            //欢迎页面 personnel_attendance_days welcome

        //测试接口
        test_datagrid   : LOCAL+"Test/test_datagrid.json",          //数据表格
        test_response   : LOCAL+"Test/test_response.json",          //数据响应
    }