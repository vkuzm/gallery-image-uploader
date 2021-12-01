CREATE DATABASE gallery_db;
USE gallery_db;

DROP TABLE IF EXISTS `galleries`;
CREATE TABLE `galleries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `sorting` int,
  `created_at` datetime,
  `updated_at` datetime,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `thumbnail` varchar(255),
  `medium` text(1000),
  `full` varchar(255),
  `sorting` int,
  `gallery_id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `gallery_fk`
    FOREIGN KEY (`gallery_id`)
    REFERENCES `galleries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);