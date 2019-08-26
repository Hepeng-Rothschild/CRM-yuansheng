#工作计划
```
数据表格 宽度标准
id      50
sexy    50
default 80
tels    100
full    .1
operate 180
```

#网址整理
```
zui官网  http://zui.sexy
zui笔记  http://debug.fanyisj.com/arrange/01_comp/zui-note/index.html
线上演示 http://debug.fanyisj.com/zui-admin/
json转换 http://www.bejson.com
```

#搁置内容
```
1)common_select_linkage()去掉分公司
2)行政管理页面
3)所有页面关于分公司的都需要调整
```

#正则验证
```
if (!reg_2_10.test(setup_base_add_comp.val())){ um_tip("公司名称格式错误","1500"   ,"text-danger"); return; }
if (!reg_2_10.test(setup_base_add_user.val())){ um_tip("企业管理人格式错误","1500" ,"text-danger"); return; }
if (!reg_2_10.test(setup_base_add_addr.val())){ um_tip("地区称格式错误","1500"     ,"text-danger"); return; }
if (!reg_ip.test(setup_base_add_ip.val()))    { um_tip("IP格式错误","1500"         ,"text-danger"); return; }
```