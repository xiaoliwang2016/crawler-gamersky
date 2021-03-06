-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3306
-- 生成日期： 2019-04-23 09:26:17
-- 服务器版本： 5.7.24
-- PHP 版本： 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `crawler`
--

-- --------------------------------------------------------

--
-- 表的结构 `article`
--

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '标题',
  `source` varchar(30) COLLATE utf8_bin DEFAULT NULL COMMENT '来源',
  `views` int(11) DEFAULT NULL COMMENT '浏览次数',
  `author` varchar(30) COLLATE utf8_bin DEFAULT NULL COMMENT '作者',
  `editor` varchar(30) COLLATE utf8_bin DEFAULT NULL COMMENT '编辑',
  `follow` int(11) DEFAULT NULL COMMENT '关注次数',
  `content` text COLLATE utf8_bin COMMENT '内容',
  `update_time` datetime DEFAULT NULL,
  `delete_time` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(300) COLLATE utf8_bin DEFAULT NULL COMMENT '作者头像',
  `nick_name` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '昵称',
  `time` datetime DEFAULT NULL COMMENT '评论时间',
  `source` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '来源',
  `support` int(11) DEFAULT NULL COMMENT '多少人顶',
  `content` varchar(300) COLLATE utf8_bin DEFAULT NULL COMMENT '内容',
  `update_time` datetime DEFAULT NULL,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '标题',
  `descrption` varchar(300) COLLATE utf8_bin DEFAULT NULL COMMENT '介绍',
  `img` varchar(300) COLLATE utf8_bin DEFAULT NULL COMMENT '预览图',
  `update_time` datetime DEFAULT NULL,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
