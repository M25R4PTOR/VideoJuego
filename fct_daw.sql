-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 01-06-2019 a las 19:10:59
-- Versión del servidor: 5.7.24
-- Versión de PHP: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fct_daw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `Id_Login` int(10) NOT NULL,
  `Usuario` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  `Clave` varchar(250) COLLATE utf8_spanish_ci NOT NULL,
  `Tipo_Login` varchar(1) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`Id_Login`),
  UNIQUE KEY `Usuario` (`Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`Id_Login`, `Usuario`, `Clave`, `Tipo_Login`) VALUES
(0, 'Admin', 'e3afed0047b08059d0fada10f400c1e5', 'A'),
(1, 'Usuario', 'a5ae0861febff1aeefb6d5b759d904a6', 'U'),
(2, 'BestGamer', 'bcf9da878f35d795ae1a064395095780', 'U'),
(3, 'Gamer', '5158265162aa4fb66e35af4b0ac4dd35', 'U'),
(4, 'Noob', '654e1c2ac6312d8c6441282f155c8ce9', 'U'),
(5, 'Pro', 'abd900517e55dce0437dac136a8568d7', 'U'),
(6, 'Jugador', '0a1cad2b10f21a168421a3eeb3985561', 'U'),
(7, 'Manu', '2d5070cb136d4cd8f418bd5a68db42ab', 'U'),
(8, 'Alfonso', 'fc69efaba5c47ad5742a75bad9a90a76', 'U'),
(9, 'Novato', '25c6994fb1b4d8701ae837b6ed8cc70b', 'U');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login_nivel`
--

DROP TABLE IF EXISTS `login_nivel`;
CREATE TABLE IF NOT EXISTS `login_nivel` (
  `Id_Login` int(10) NOT NULL,
  `Id_Nivel` int(10) NOT NULL,
  `Fecha_Guardado` datetime DEFAULT NULL,
  `Desbloqueado` int(1) NOT NULL,
  `Puntuacion` int(20) DEFAULT NULL,
  PRIMARY KEY (`Id_Login`,`Id_Nivel`),
  KEY `FK_Nivel` (`Id_Nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `login_nivel`
--

INSERT INTO `login_nivel` (`Id_Login`, `Id_Nivel`, `Fecha_Guardado`, `Desbloqueado`, `Puntuacion`) VALUES
(0, 1, NULL, 1, NULL),
(0, 2, NULL, 1, NULL),
(0, 3, NULL, 1, NULL),
(0, 4, NULL, 1, NULL),
(0, 5, NULL, 1, NULL),
(1, 1, '2019-06-01 21:07:38', 1, 500),
(1, 2, NULL, 1, NULL),
(1, 3, NULL, 0, NULL),
(1, 4, NULL, 0, NULL),
(1, 5, NULL, 0, NULL),
(2, 1, NULL, 1, 1000),
(2, 2, NULL, 1, 1000),
(2, 3, NULL, 1, 1000),
(2, 4, NULL, 1, 1000),
(2, 5, NULL, 1, 1000),
(3, 1, NULL, 1, 600),
(3, 2, NULL, 1, 600),
(3, 3, NULL, 1, 600),
(3, 4, NULL, 1, NULL),
(3, 5, NULL, 0, NULL),
(4, 1, NULL, 1, 100),
(4, 2, NULL, 0, NULL),
(4, 3, NULL, 0, NULL),
(4, 4, NULL, 0, NULL),
(4, 5, NULL, 0, NULL),
(5, 1, NULL, 1, 900),
(5, 2, NULL, 1, 900),
(5, 3, NULL, 1, 900),
(5, 4, NULL, 1, 900),
(5, 5, NULL, 1, 900),
(6, 1, NULL, 1, 500),
(6, 2, NULL, 1, 500),
(6, 3, NULL, 1, 500),
(6, 4, NULL, 1, NULL),
(6, 5, NULL, 0, NULL),
(7, 1, '2019-06-01 20:52:14', 1, 500),
(7, 2, NULL, 1, 800),
(7, 3, NULL, 1, 800),
(7, 4, NULL, 1, 800),
(7, 5, NULL, 1, 800),
(8, 1, NULL, 1, 700),
(8, 2, NULL, 1, 700),
(8, 3, NULL, 1, 700),
(8, 4, NULL, 1, 700),
(8, 5, NULL, 1, 700),
(9, 1, NULL, 1, 500),
(9, 2, NULL, 1, 200),
(9, 3, NULL, 0, NULL),
(9, 4, NULL, 0, NULL),
(9, 5, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nivel`
--

DROP TABLE IF EXISTS `nivel`;
CREATE TABLE IF NOT EXISTS `nivel` (
  `Id_Nivel` int(10) NOT NULL,
  `Nombre` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  `Descripcion` varchar(1000) COLLATE utf8_spanish_ci NOT NULL,
  `Puntuacion_Maxima` int(20) NOT NULL,
  `Enlace` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`Id_Nivel`),
  UNIQUE KEY `Nombre` (`Nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `nivel`
--

INSERT INTO `nivel` (`Id_Nivel`, `Nombre`, `Descripcion`, `Puntuacion_Maxima`, `Enlace`) VALUES
(1, 'Nivel 1', 'Mapa Nivel 1', 1000, 'Nivel_1'),
(2, 'Nivel 2', 'Mapa Nivel 2', 1000, 'Nivel_2'),
(3, 'Nivel 3', 'Mapa Nivel 3', 1000, 'Nivel_3'),
(4, 'Nivel 4', 'Mapa Nivel 4', 1000, 'Nivel_4'),
(5, 'Nivel 5', 'Mapa Nivel 5', 1000, 'Nivel_5');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `login_nivel`
--
ALTER TABLE `login_nivel`
  ADD CONSTRAINT `FK_Login` FOREIGN KEY (`Id_Login`) REFERENCES `login` (`Id_Login`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Nivel` FOREIGN KEY (`Id_Nivel`) REFERENCES `nivel` (`Id_Nivel`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
