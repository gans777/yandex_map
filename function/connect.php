<?php 
  function print_arr($arr){
	echo "<pre>".print_r($arr,true)."</pre>";
}


$link = @mysqli_connect("127.0.0.1", "def", "zx15619", "deficit");

if (!$link) {
    echo "Ошибка: Невозможно установить соединение с MySQL." . PHP_EOL;
    echo "Код ошибки errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Текст ошибки error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
mysqli_set_charset($link, "utf8");
echo "Соединение с MySQL установлено! - готов к записи" . PHP_EOL;
?>