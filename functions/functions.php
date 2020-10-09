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

// Функция для генерации случайной строки
function generateCode($length=6) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;
    while (strlen($code) < $length) {
            $code .= $chars[mt_rand(0,$clen)];
    }
    return $code;
}
// функция проверки хеша пользователя с хешем в базе
function check_hash($link,$hash,$user_login){
  $query = mysqli_query($link, "SELECT user_login FROM deficit_users WHERE user_hash='".mysqli_real_escape_string($link, $hash)."'");
  $data = mysqli_fetch_assoc($query);
    if($data['user_login'] === $user_login){

        return $user_login;
    } else { return "not autorization"; }
} 
?>