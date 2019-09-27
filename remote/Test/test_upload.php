<?php
//参数配置
ini_set("date.timezone","Asia/Shanghai"); 										//时区设置
$path = "../Upload/"; 															//保存路径

//参数接收
$upid   = isset($_REQUEST["upid"]  ) ? $_REQUEST["upid"] : "upid"; 				//上传ID
$chunk  = isset($_REQUEST["chunk"] ) ? intval($_REQUEST["chunk"] ) : 0; 		//分块处理
$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0; 		//分块处理

//路径创建
if( !file_exists($path) ){ @mkdir($path); }

//名称处理
$file_name = date("Ymd_His",time())."_".mt_rand(999,9999).".jpg"; 				//文件名称
$file_path = $path.DIRECTORY_SEPARATOR.$file_name;								//文件路径+名称

//文件生成
$in  = @fopen( $_FILES["file"]["tmp_name"],"rb" ); 								//临时文件(只读)
$out = @fopen( "{$file_path}.part"        ,$chunks ? "ab":"wb" ); 				//分块文件(只写|w清空,a末尾)
while( $part=fread($in,4096) ){ fwrite($out,$part); } 							//分块写入($in=>$out)

//文件关闭
@fclose($in );
@fclose($out);

//后缀移除(临时文件)
if( !$chunks || $chunk==$chunks-1 ){ rename("{$file_path}.part",$file_path); } 	//重新命名

//结果返回
echo json_encode(array( 														//返回格式
	"result" => "ok", 															//结果状态
	"file" 	 => $file_path 														//文件路径+名称
));