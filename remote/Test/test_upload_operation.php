<?php 

	if( $_POST["filename"]=="" )
	{
		echo "删除操作";
	} else {
		echo "命名操作：".$_POST["filename"];
	}
?>