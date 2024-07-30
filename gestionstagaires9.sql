-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : Dim 28 juil. 2024 à 18:00
-- Version du serveur :  10.4.13-MariaDB
-- Version de PHP : 7.2.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestionstagaires`
--

-- --------------------------------------------------------

--
-- Structure de la table `intern`
--

CREATE TABLE `intern` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `cine` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `dateStart` datetime DEFAULT NULL,
  `dateEnd` datetime DEFAULT NULL,
  `profilePhoto` varchar(255) DEFAULT NULL,
  `rapport` varchar(255) DEFAULT NULL,
  `project` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `id_user` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `firstname`, `lastname`, `password`, `email`, `created_at`, `updated_at`, `role`, `verification_token`, `is_verified`) VALUES
(1, 'admin', 'soufiane', 'el', '$2b$10$CRWRJ8RjbfFGiXVelvD9VeV3CCjFhyOuR8/bu5mhrLbHZnlkkYvmG', 'site.web97-2@gmail.Com', '2024-01-16 22:04:01', '2024-07-25 13:55:35', 'admin', NULL, 1),
(2, 'user', 'firstName', 'LastName', '$2b$10$.FBeDHu0VGI0a60IoA8npOp./BRnO.jg4yoBYE4HOI6IelxLYsBKe', 'cirokeg447@leacore.com', '2024-07-25 13:57:50', '2024-07-28 15:33:48', 'user', 'f38985ef800362a742e583cf591c3e5a', 1),
(3, 'Viewer', 'firstName', 'LastName', '$2b$10$CHOMCmuUvvFYGVZG1aaW/.8d3OGpWZyiEghfBojwQzcrH6GDZTYXu', 'javatp01@gmail.com', '2024-07-26 11:42:12', '2024-07-27 16:38:11', 'viewer', '2958028d32c69331ffbbc473027a93e2', 1),
(5, 'u', 'firstName', 'LastName', '$2b$10$OqoGcelWd9HvhYCDCufJ5eZKe75HGxjohd6QI.cBE3l/x2cZeIZx2', 'uuu@gmail.com', '2024-07-26 12:09:48', '2024-07-27 16:37:45', 'user', 'b78f2657fc3a55a07cf282ca0f858807', 0),
(7, '00000000', 'firstName', 'LastName', '$2b$10$SGsdRM.DoWjbWIx0oHomt.ghkJZ8ZsXOO7GvjiZID..wM0mnAlVZK', 'lapijobonene@rungel.net', '2024-07-26 12:14:57', '2024-07-26 13:35:36', 'user', 'd37bb136c8ee04687fb0ccb8cf8f0d7d', 1),
(9, 'soufianeelaamrani', 'soufiane', 'el aamrani', '$2b$10$.B7O02L0hoDTUhW/2mFXFu.137qo65./PhivDRNHp.nn3hAJXoc8u', 'univ.web97@gmail.com', '2024-07-26 13:38:49', '2024-07-27 17:45:25', 'user', '2728e87802192e9e161d3bcc952e9431', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `intern`
--
ALTER TABLE `intern`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `intern`
--
ALTER TABLE `intern`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
