$str = file_get_contents('http://cn.bing.com/HPImageArchive.aspx?idx=0&n=1'); //从bing获取数据
if(preg_match("/(.+?)<\/url>/ies",$str,$matches)){ //正则匹配抓取图片url
$imgurl='http://cn.bing.com'.$matches[1];
}else{ //如果由于某些原因，没抓取到图片地址
$imgurl='修改为你自己的图片地址'; //使用默认的图像
}
header("Location: $imgurl"); //header跳转
?>