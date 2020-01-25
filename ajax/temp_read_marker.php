<?php 
 function MysqliFetchAll($res){
             $result=array();
             while ($row = mysqli_fetch_assoc($res)) {
              $result[]=$row;
     }
               return $result;
 }
function print_arr($arr){
	echo "<pre>".print_r($arr,true)."</pre>";
}
$link = @mysqli_connect("127.0.0.1", "root", "", "deficit");
//$link = @mysqli_connect("127.0.0.1", "gans", "Palkdmrywt82xcDEjc", "gans");

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


  $product='тофф++';


//echo "Соединение с MySQL установлено!" . PHP_EOL;
//echo "Информация о сервере: " . mysqli_get_host_info($link) . PHP_EOL;
$all_points_=array();
 $sql = "SELECT id_point,lan,lng,name FROM points WHERE product='".$product."'";
     $res = mysqli_query($link,$sql);
////          $all_points = mysqli_fetch_all($res,MYSQLI_ASSOC);
         // $all_points = mysqli_fetch_assoc($res);
     $all_points= array();
             $count=0;
             while ($row = mysqli_fetch_assoc($res)) {
              $id_point = $row['id_point'];
              print_arr($row);
              $all_points_[]=$row;
               $sql = "SELECT purchase_descr,data_note,id_note,id_point FROM note WHERE id_point=".$id_point;
               // $res = mysqli_query($link,$sql);

         // $all_this_note = mysqli_fetch_all($res,MYSQLI_ASSOC);
         

             //array_push($all_points,);
         echo $count++;
    }
    echo"<hr>";
        print_arr($all_points_);
echo "<hr>";
$sql = "SELECT id_point,lan,lng,name FROM points WHERE product='".$product."'";
     $res = mysqli_query($link,$sql);
          $all_points = mysqli_fetch_all($res,MYSQLI_ASSOC);
          print_arr($all_points);

          echo "<hr> результат с функцией fetchall";
               $sql = "SELECT id_point,lan,lng,name FROM points WHERE product='".$product."'";
     $res = mysqli_query($link,$sql);
          print_arr(MysqliFetchAll($res));

    ?>