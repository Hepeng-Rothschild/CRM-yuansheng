#工作计划--------------------------
1 整理base.js 做好代码规范  
2 对接上传接口 
3 对接上传接口 
4 行政页面
5 行政页面

#base.js规范--------------------------
1-灵巧工具型
	um_tip()   						//不依赖zui
	um_json()

2-组件复用处理(返回处理结果)
	zui_upload_unique() 			//依赖zui,复用方法
	zui_cell_value()

3-涉及接口型(DOM模块推进)
	common_tree_staff() 			//依赖zui,固定接口 命名方式为 common_组件_接口
	common_select_comp_depart_post()