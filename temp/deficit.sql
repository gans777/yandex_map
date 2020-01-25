-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 09 2019 г., 19:22
-- Версия сервера: 10.3.13-MariaDB
-- Версия PHP: 7.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `deficit`
--

-- --------------------------------------------------------

--
-- Структура таблицы `note`
--

CREATE TABLE `note` (
  `id_note` int(10) UNSIGNED NOT NULL,
  `purchase_descr` varchar(255) NOT NULL,
  `data_note` timestamp NULL DEFAULT current_timestamp(),
  `id_point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `note`
--

INSERT INTO `note` (`id_note`, `purchase_descr`, `data_note`, `id_point`) VALUES
(5, 'когда-то глик был здесь', '2019-12-04 15:17:53', 9),
(6, 'шурпа с бараниной(..или все-таки с говядиной)', '2019-12-04 21:43:41', 10),
(7, 'ох, только б не исчез', '2019-12-04 21:48:54', 11),
(8, 'один всегда есть тут', '2019-12-04 22:22:32', 12),
(9, 'с доревалюционных времен здесь аптека была', '2019-12-09 14:21:41', 13);

-- --------------------------------------------------------

--
-- Структура таблицы `points`
--

CREATE TABLE `points` (
  `id_point` int(10) UNSIGNED NOT NULL,
  `lan` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `product` varchar(20) NOT NULL,
  `category` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `points`
--

INSERT INTO `points` (`id_point`, `lan`, `lng`, `name`, `product`, `category`) VALUES
(9, '47.22555728877482', '39.70581895489503', 'трифарма', 'тофф++', 'аптеки'),
(10, '47.23532087263494', '39.712342087219255', 'шурпа', 'тофф++', 'аптеки'),
(11, '47.250466922838484', '39.688084188888546', 'социальная аптека', 'тофф++', 'аптеки'),
(12, '47.249524531662935', '39.720131222198496', 'желтая аптека', 'тофф++', 'аптеки'),
(13, '47.22308264602637', '39.70611207126333', 'аптека из прошлого', 'тофф++', 'аптеки');

-- --------------------------------------------------------

--
-- Структура таблицы `products_parametrs`
--

CREATE TABLE `products_parametrs` (
  `name_of_param` varchar(20) NOT NULL,
  `product` varchar(20) NOT NULL,
  `params_value` varchar(20) NOT NULL,
  `id_note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `products_parametrs`
--

INSERT INTO `products_parametrs` (`name_of_param`, `product`, `params_value`, `id_note`) VALUES
('цена', 'тофф++', '77', 1),
('цена', 'тофф++', '78', 2),
('цена', 'тофф++', '180', 3),
('цена', 'тофф++', '117', 4),
('цена', 'тофф++', '88', 5),
('цена', 'тофф++', '180', 6),
('цена', 'тофф++', '149', 7),
('цена', 'тофф++', '190', 8),
('цена', 'тофф++', '77', 9);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id_note`);

--
-- Индексы таблицы `points`
--
ALTER TABLE `points`
  ADD PRIMARY KEY (`id_point`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `note`
--
ALTER TABLE `note`
  MODIFY `id_note` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `points`
--
ALTER TABLE `points`
  MODIFY `id_point` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
