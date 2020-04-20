<?php
/* если нет таблиц в базе, то генерируются эти*/
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

//тут надо добавить рождение таблицы deficit_products

/*end = если нет таблиц, то генерирует эти*/
?>