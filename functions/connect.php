<?php


$link = @mysqli_connect("127.0.0.1", "root", "root", "deficit");

//$link = @mysqli_connect("127.0.0.1", "gans", "Palkdmrywt82xcDEjc", "gans");

if (!$link) {
    echo "Ошибка: Невозможно установить соединение с MySQL." . PHP_EOL;
    echo "Код ошибки errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Текст ошибки error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
mysqli_set_charset($link, "utf8");
//echo "Соединение с MySQL установлено! - готов к записи" . PHP_EOL;

 
?>