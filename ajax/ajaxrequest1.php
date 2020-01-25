<?php 
function print_arr($arr){
	echo "<pre>".print_r($arr,true)."</pre>";
}
//$link = @mysqli_connect("127.0.0.1", "root", "", "deficit");
$link = @mysqli_connect("127.0.0.1", "gans", "Palkdmrywt82xcDEjc", "gans");

if (!$link) {
    echo "Ошибка: Невозможно установить соединение с MySQL." . PHP_EOL;
    echo "Код ошибки errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Текст ошибки error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
mysqli_set_charset($link, "utf8");
//echo "Соединение с MySQL установлено! - готов к записи" . PHP_EOL;

/* если нет таблиц, то генерирует их*/
$check= "CREATE TABLE IF NOT EXISTS `note` (
  `id_note` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `purchase_descr` varchar(255) NOT NULL,
  `id_point` int(11) NOT NULL,
  `data_note` timestamp NULL DEFAULT current_timestamp(),
    UNIQUE (`id_note`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;"; 
$res = mysqli_query($link, $check);

$check= "CREATE TABLE IF NOT EXISTS  `points` (
  `id_point` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `lan` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `product` varchar(20) NOT NULL,
  `category` varchar(20) NOT NULL,
  UNIQUE (`id_point`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
";
$res = mysqli_query($link, $check);

$check= "CREATE TABLE IF NOT EXISTS  `products_parametrs` (
  `name_of_param` varchar(20) NOT NULL,
  `product` varchar(20) NOT NULL,
  `params_value` varchar(20) NOT NULL,
  `id_note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
$res = mysqli_query($link, $check);
/*end = если нет таблиц, то генерирует их*/


if ($_POST['label']=='save_new_marker') {
	$name_point=$_POST['name_point'];
    $description_point=$_POST['description_point'];
    $lan=$_POST['lan'];
    $lng=$_POST['lng'];
    $current = $lan.'||'.$lng.'||'.$name_point.'||'.$description_point.PHP_EOL;
	
	$path = "../points/"."drugs".".txt";

	if (file_put_contents($path, $current, FILE_APPEND | LOCK_EX)){echo $current;} else {echo "not save";}
	
	
}
if ($_POST['label']=='save_new_marker_sql') {
	$name_point=$_POST['name_point'];
    $comment=$_POST['description_point'];
    $lan=$_POST['lan'];
    $lng=$_POST['lng'];
    $product='тофф++';
    $category='аптеки';
    $product_price=$_POST['product_price'];
    // подключение к mysql
echo "пытаюсь записать $name_point || $lan ||$lng||$product||$category";
  $insert = "INSERT INTO `points` (lan, lng, name, product, category) VALUES ('".$lan."','".$lng."','".$name_point."','".$product."', '".$category."')";


   $res = mysqli_query($link, $insert);
   if ($res) {echo " успешно записано в таблицу ТОЧКИ";} else {echo " не записано в таблицу ТОЧКИ error";}

     $sql = "SELECT MAX(id_point) FROM points";
     $res = mysqli_query($link,$sql);
      $last_id = mysqli_fetch_all($res);
      //$last_id = mysqli_fetch_all($res,MYSQLI_ASSOC);
       
       print_arr($last_id);
      


   $insert = "INSERT INTO `note` (id_point,	purchase_descr) VALUES ('".$last_id[0][0]."', '".$comment."')";
       $res = mysqli_query($link, $insert);
     if ($res) {echo "заметка успешно записана ";} else {echo " ЗАИЕТКА (NOTE) error";}
    // узнаем id_note
      $sql = "SELECT MAX(id_note) FROM note";
         $res = mysqli_query($link,$sql);
           $last_note_id = mysqli_fetch_all($res); 
                $insert = "INSERT INTO `products_parametrs` (name_of_param,	product, params_value, id_note) VALUES ('цена', '".$product."','".$product_price."','".$last_note_id[0][0]."')";
       $res = mysqli_query($link, $insert);
	
}

if ($_POST['label']=='read_markers'){
	$dir ="points";
  $category="drugs";

  $file = file("../$dir/$category.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  
 echo json_encode($file);
  
}
if ($_POST['label'] =='read_markers_sql'){
	
  $product='тофф++';


//echo "Соединение с MySQL установлено!" . PHP_EOL;
//echo "Информация о сервере: " . mysqli_get_host_info($link) . PHP_EOL;

 $sql = "SELECT id_point,lan,lng,name FROM points WHERE product='".$product."'";
     $res = mysqli_query($link,$sql);
          $all_points = mysqli_fetch_all($res,MYSQLI_ASSOC);
       

       //echo print_arr($all_points);
       //$note=array();
     for($j=0;$j<count($all_points);$j++) {
     	
     
        $id_point = $all_points[$j]['id_point'];
          $sql = "SELECT purchase_descr,data_note,id_note,id_point FROM note WHERE id_point=".$id_point;
          $res = mysqli_query($link,$sql);
          $all_this_note = mysqli_fetch_all($res,MYSQLI_ASSOC);
           //print_arr($all_this_note[0]['id_note']);
          
     // print_arr($this_note_price[0]['params_value']);
          //$this_price_for_note =  
          for($i=0; $i< count($all_this_note);$i++){
          	 $sql = "SELECT params_value FROM products_parametrs WHERE id_note=".$all_this_note[0]['id_note'];
           $res = mysqli_query($link,$sql);
           $this_note_price=mysqli_fetch_all($res,MYSQLI_ASSOC);
           $all_this_note[$i]['price']= $this_note_price[0]['params_value'];
          	array_push($all_points[$j],$all_this_note[$i]);
          }
         // echo print_arr($all_this_note);
     }
    // echo print_arr($all_points);
  
 echo json_encode($all_points);
  
}
?>