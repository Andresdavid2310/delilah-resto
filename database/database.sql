-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-01-2021 a las 21:27:26
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah_resto`
--
DROP DATABASE IF EXISTS delilah_resto;
CREATE DATABASE delilah_resto;

USE delilah_resto;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `description` varchar(150) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `total` float NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `created_ad` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders_products`
--

CREATE TABLE `orders_products` (
  `order_product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name_product` varchar(60) NOT NULL,
  `price` float NOT NULL,
  `img_url_product` varchar(300) NOT NULL,
  `description` varchar(200) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `created_ad` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`product_id`, `name_product`, `price`, `img_url_product`, `description`, `is_enabled`, `created_ad`) VALUES
(5, 'Pizza grande', 20000, 'https://cocineroimprovisado.com/wp-content/uploads/2019/07/hamburguesa13-768x1024.jpg', 'pizza de harina con salsa napolitana , champiñones , carne y cabano', 1, '2021-01-24'),
(6, 'Hamburguesa', 10000, 'https://cocineroimprovisado.com/wp-content/uploads/2019/07/hamburguesa13-768x1024.jpg', 'carne artesanal , pan artesanal y doble queso', 1, '2021-01-24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone` int(10) NOT NULL,
  `address` varchar(60) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `created_ad` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `name`, `email`, `phone`, `address`, `is_admin`, `is_enabled`, `created_ad`) VALUES
(14, 'chimuelo', 'Admin12345', 'chimuelo zuluaga', 'chimuelo@hotmail.com', 2222222, 'calle 9 santa marta', 1, 1, '2021-01-24 04:20:21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `orders_products`
--
ALTER TABLE `orders_products`
  ADD PRIMARY KEY (`order_product_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `orders_products`
--
ALTER TABLE `orders_products`
  MODIFY `order_product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Filtros para la tabla `orders_products`
--
ALTER TABLE `orders_products`
  ADD CONSTRAINT `orders_products_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `orders_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
