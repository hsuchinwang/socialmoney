-- MySQL dump 10.13  Distrib 5.7.12, for osx10.11 (x86_64)
--
-- Host: localhost    Database: SamWang
-- ------------------------------------------------------
-- Server version	5.7.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Record`
--

DROP TABLE IF EXISTS `Record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Record` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Credit` varchar(25) COLLATE utf8mb4_bin DEFAULT NULL,
  `Debt` varchar(25) COLLATE utf8mb4_bin DEFAULT NULL,
  `Booking` varchar(300) COLLATE utf8mb4_bin DEFAULT NULL,
  `Currency` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Record`
--

LOCK TABLES `Record` WRITE;
/*!40000 ALTER TABLE `Record` DISABLE KEYS */;
INSERT INTO `Record` VALUES (3,'王敍親','王敍親','王敍親 borrowed 100 from 王敍親.',NULL),(4,'王敍親','王敍親','王敍親 borrowed 100 from 王敍親.',NULL),(5,'王敍親','王敍親','王敍親 borrowed 100 from 王敍親.',NULL),(6,'王敍親','王敍親','王敍親 borrowed 100 from 王敍親.','謝祥彥30黃柏崴40盧奕安30'),(7,'王敍親','王敍親','王敍親 borrowed 100 from 王敍親.','謝祥彥30黃柏崴40盧奕安30'),(8,'王敍親','王敍親','王敍親 borrowed 100 from 王敍親.','謝祥彥30黃柏崴40盧奕安30');
/*!40000 ALTER TABLE `Record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(25) DEFAULT NULL,
  `Currency` varchar(25) DEFAULT NULL,
  `Price` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (2,'王敍親','王敍親',10000),(4,'王敍親','陳立展',45),(5,'王敍親','盧奕安',35),(6,'王敍親','謝祥彥',40),(8,'吳佳純','吳佳純',10000),(9,'吳佳純','王敍親',30),(13,'王敍親','黃柏崴',80);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-02 20:01:54
