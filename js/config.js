
    //全局存储关闭
    $.zui.store.enable=false;

    //接口路径
    window.STATE = "local";                                                 //当前状态 local route
    window.LOCAL = "./remote/";                                             //本地路径
    window.ROUTE = "http://192.168.1.26/";                                  //远程路径
    window.REC_PER_PAGE = 20;                                               //每页几条

    //全局接口
    if( STATE == "local" ){

        //本地接口
        window.API = {
            common_view     : "./page/setup_personnel_depart.html",                  //welcome setup_base setup_account
            test_datagrid   : LOCAL+"Test/test_datagrid.json",              //数据表格
            test_response   : LOCAL+"Test/test_response.json",              //数据响应
            test_export     : LOCAL+"Upload/test_export.pdf",               //导出文件

            common_tree     : LOCAL+"User/GetUserPageInfo.json",            //左侧导航
            common_company  : LOCAL+"Company/getCompanyByPositionid.json",  //分公司
            common_depart   : LOCAL+"Company/getDeparment.json",            //部门
            common_post     : LOCAL+"Position/getPostionsByDid.json",       //职位
            common_staff    : LOCAL+"Company/getCompanybyid.json",          //员工
        }

    } else {

        //远程接口
        window.API = {
            common_view     : "./page/setup_base.html",                     //welcome setup_base setup_account
            test_datagrid   : LOCAL+"Test/test_datagrid.json",              //数据表格
            test_response   : LOCAL+"Test/test_response.json",              //数据响应
            test_export     : LOCAL+"Upload/test_export.pdf",               //导出文件
            
            common_tree     : LOCAL+"User/GetUserPageInfo.json",            //左侧导航
            common_company  : ROUTE+"Company/getCompanyByPositionid",       //分公司
            common_depart   : ROUTE+"Company/getDeparment",                 //部门
            common_post     : ROUTE+"Position/getPostionsByDid",            //职位
            common_staff    : ROUTE+"Company/getCompanybyid",               //员工
        }

    }