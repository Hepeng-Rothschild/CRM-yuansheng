<?
#工作搁置
	1)全局页面-分公司  ：去除(common_select_linkage()调整)
	2)行政管理-物品管理：页面制作
	3)系统设置-回访设置：页面制作
	4)全局页面-数据表格：宽度标准
		id      50
		sexy    50
		default 80
		tels    100
		full    .1
		operate 180

#bug记录
	1)全局页面-上传组件：表单重置
	2)假期余额-修改面板：tab面板显示不出来(css强制显示-需多测试)

#工作计划
	1)商务管理：页面制作
	    信息员列表
	    信息员管理
	    客户跟踪
	    客户管理
	    客户审批
	    过期审批
	    失败审批
	    可抢信息员
	    可抢客户
	    信息员资源
	    客户资源
	2)全局页面-上传组件：bug解决
		var upload_obj = $("#dom").data("zui.uploader");
		if( upload_obj!=underfined ){
			var files = upload_obj.getFiles();
			for( var i=0;i<files.length;i++ ){
				upload_obj.removeFile(files[i]);
			}
			for( var i=0;i<files.length;i++ ){
				upload_obj.removeFile(files[i]);
			}			
		}