<?php 
include '../functions/functions.php';

include "../functions/connect.php";

/* авторизация */
if ($_POST['label']=='register_new_user'){ 
  $err = [];
      // проверяем, не сущестует ли пользователя с таким именем
    $query = mysqli_query($link, "SELECT user_id FROM deficit_users WHERE user_login='".mysqli_real_escape_string($link, $_POST['login'])."'");
    if(mysqli_num_rows($query) > 0)
    {
        $err[] = "login_have";//Пользователь с таким логином уже существует в базе данных
        echo $err[0];
    }

     if(count($err) == 0)
    {

        $login = $_POST['login'];
        // Убераем лишние пробелы и делаем двойное хеширование
        $password = md5(md5(trim($_POST['password'])));

        mysqli_query($link,"INSERT INTO deficit_users SET user_login='".$login."', user_password='".$password."'");
        echo "saved";
    }

}

if ($_POST['label']=='enter_log_pass'){
    $login=$_POST['login'];
     $password=$_POST['password'];

     // Вытаскиваем из БД запись, у которой логин равняеться введенному
    $query = mysqli_query($link,"SELECT user_id, user_password FROM deficit_users WHERE user_login='".mysqli_real_escape_string($link,$login)."' LIMIT 1");
    
    $data = mysqli_fetch_assoc($query);
    
    // Сравниваем пароли
    if($data['user_password'] === md5(md5($password))) {
      //echo "пароли совпали";

        // Генерируем случайное число и шифруем его
        $hash = md5(generateCode(10));

        // Записываем в БД новый хеш авторизации и IP
        @mysqli_query($link, "UPDATE deficit_users SET user_hash='".$hash."' "." WHERE user_id='".$data['user_id']."'");
          
         echo json_encode(array('user_hash' => $hash,'user_login' => $login ));

    } else { echo "login/pass is wrong.";} // здесь передалать на json
}

 if ($_POST['label'] == 'check_user_hash') {
  $login = $_POST['user_login'];
   $query = mysqli_query($link,"SELECT user_hash FROM deficit_users WHERE user_login='".mysqli_real_escape_string($link,$login)."' LIMIT 1");
      $data = mysqli_fetch_assoc($query);
       if ($data['user_hash'] == $_POST['user_hash']) {
        echo "user_hash_match";
       }
 }
/* end авторизация */

if ($_POST['label']=='add_new_deficit'){ 
  
  $insert = "INSERT INTO `deficit_products` (name_of_product) VALUES ('".$_POST['name_of_deficit']."')";
  $res = mysqli_query($link,$insert);
  
}


if ($_POST['label']=='save_new_marker_sql') {
	$name_point=$_POST['name_point'];
    $comment=$_POST['description_point'];
    $lan=$_POST['lan'];
    $lng=$_POST['lng'];
    $product=$_POST['product'];
    $category='аптеки';
    $product_price=$_POST['product_price'];
    // подключение к mysql
echo "пытаюсь записать $name_point || $lan ||$lng||$product||$category";
  $insert = "INSERT INTO `deficit_points` (lan, lng, name, product, category) VALUES ('".$lan."','".$lng."','".$name_point."','".$product."', '".$category."')";


   $res = mysqli_query($link, $insert);
   if ($res) {echo " успешно записано в таблицу ТОЧКИ";} else {echo " не записано в таблицу ТОЧКИ error";}

     $sql = "SELECT MAX(id_point) FROM deficit_points";
     $res = mysqli_query($link,$sql);
     $last_id = mysqli_fetch_assoc($res);
      


   $insert = "INSERT INTO `deficit_note` (id_point,	purchase_descr) VALUES ('".$last_id['MAX(id_point)']."', '".$comment."')";
       $res = mysqli_query($link, $insert);
     if ($res) {echo "заметка успешно записана ";} else {echo " ЗАМЕТКА (NOTE) error";}
    // узнаем id_note
      $sql = "SELECT MAX(id_note) FROM deficit_note";
         $res = mysqli_query($link,$sql);
////           $last_note_id = mysqli_fetch_all($res); 
           $last_note_id = mysqli_fetch_assoc($res); 
                   //последний id в таблице deficit_note
                   echo "последний id в таблице deficit_note(last_note_id['MAX(id_note)'])=".$last_note_id['MAX(id_note)'].";"; 
                   print_arr($last_note_id);

                $insert = "INSERT INTO `deficit_products_parametrs` (name_of_param,	product, params_value, id_note) VALUES ('цена', '".$product."','".$product_price."','".$last_note_id['MAX(id_note)']."')";
                   $res = mysqli_query($link, $insert);
	
}

if ($_POST['label']=='save_edit_marker'){
   $sql ="UPDATE deficit_points SET lan='".$_POST['lan']."', lng='".$_POST['lng']."', name='".$_POST['name_point']."' WHERE id_point=".$_POST['id_point'];
    $result=mysqli_query($link,$sql);
}

if ($_POST['label']=='save_new_comment_about_purchase_sql') {
              $insert = "INSERT INTO `deficit_note` (purchase_descr, id_point) VALUES ('".$_POST['comment']."', '".$_POST['id_point']."')";
                $res = mysqli_query($link, $insert);
                 $sql = "SELECT MAX(id_note) FROM deficit_note";
                  $res = mysqli_query($link,$sql);
                    $last_note_id = mysqli_fetch_assoc($res);
                        $product='тофф++';
                      $insert = "INSERT INTO `deficit_products_parametrs` (name_of_param, product, params_value, id_note) VALUES ('цена', '".$product."','".$_POST['product_price']."','".$last_note_id['MAX(id_note)']."')";
                        $res = mysqli_query($link, $insert);
                              //считывание цены и комментариев о покупках в ЭТОЙ точке
                         // $sql= "SELECT id_note,purchase_descr,data_note FROM note WHERE id_point='".$_POST['id_point']."'";
                           $sql="SELECT deficit_note.id_note,deficit_note.purchase_descr,deficit_note.data_note,deficit_products_parametrs.params_value FROM deficit_note JOIN deficit_products_parametrs WHERE deficit_note.id_point='".$_POST['id_point']."' AND deficit_note.id_note=deficit_products_parametrs.id_note";
                             $res = mysqli_query($link, $sql);
                               $all_this_note=MysqliFetchAll($res);
                               //добавление цены из таблицы params_value
                                 echo json_encode($all_this_note);
}

if ($_POST['label']=='read_markers'){
	$dir ="points";
  $category="drugs";

  $file = file("../$dir/$category.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  
 echo json_encode($file);
  
}
if ($_POST['label'] =='read_markers_sql'){
  
	
  $product=$_POST['product'];


$sql = "SELECT id_point,lan,lng,name FROM deficit_points WHERE product='".$product."'";
     $res = mysqli_query($link,$sql);
          $all_points = MysqliFetchAll($res);
       

       
     for($j=0;$j<count($all_points);$j++) {
      
     
        $id_point = $all_points[$j]['id_point'];
          $sql = "SELECT purchase_descr,data_note,id_note,id_point FROM deficit_note WHERE id_point=".$id_point;
          $res = mysqli_query($link,$sql);
          $all_this_note = MysqliFetchAll($res);
            
          
          for($i=0; $i< count($all_this_note);$i++){
             $sql = "SELECT params_value FROM deficit_products_parametrs WHERE id_note=".$all_this_note[$i]['id_note'];
           $res = mysqli_query($link,$sql);
           $this_note_price=MysqliFetchAll($res);
           //$all_this_note[$i]['price']= $this_note_price[0]['params_value'];
            $all_this_note[$i]['params_value']= $this_note_price[0]['params_value'];
            array_push($all_points[$j],$all_this_note[$i]);
          }
         
     }
   
  
 echo json_encode($all_points);
  
}

if ($_POST['label']=='delete_purchase_descr_sql') {
  $id_note=$_POST['id_note'];
   $sql="DELETE FROM deficit_note WHERE id_note=$id_note";
    if (mysqli_query($link, $sql)) {
    echo "Record deleted successfully from NOTE.";
} else {
    echo "Error deleting record: note " . mysqli_error($link);
}
    $sql="DELETE FROM deficit_products_parametrs WHERE id_note=$id_note";
      if (mysqli_query($link, $sql)) {
    echo "Record deleted successfully from products_parametrs.";
} else {
    echo "Error deleting record: products_parametrs " . mysqli_error($link);
}
 
}

if($_POST['label']=='delete_empty_point'){
  
  $id_point=$_POST['id_point'];
  /* может стоит удостовериться , что в note нет записей этого Поинта
   $sql="SELECT id_point FROM note WHERE id_point=".$id_point;
    $res = mysqli_query($link,$sql);
     $all_this_note= MysqliFetchAll($res);
     */
       $sql="DELETE FROM deficit_points WHERE id_point=$id_point";
          if (mysqli_query($link, $sql)) {
            echo "Record deleted successfully from POINTS.";
              } else {
           echo "Error deleting record: points " . mysqli_error($link);
}  
  
 }
  if($_POST['label']=='delete_empty_deficit'){
     $product_name=$_POST['product_name'];
        $sql = "SELECT product FROM deficit_points WHERE product='".$product_name."'";
     $res = mysqli_query($link,$sql);
          $all_concurrence = MysqliFetchAll($res);
         // print_arr($all_concurrence);
          if (count($all_concurrence)==0) {
            $sql="DELETE FROM deficit_products WHERE name_of_product='".$product_name."'";
            if (mysqli_query($link, $sql)) {
    echo "Record deleted successfully from deficit_products.";
} else {
    echo "Error deleting record: deficit_products " . mysqli_error($link);
}
          }
  }

?>