// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Création d'une instance de l'application Express
const app = express();

// Connexion à la base de données MongoDB en utilisant l'URI stockée dans les variables d'environnement
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connection to MongoDB successful !')) // Message de succès si la connexion est établie
  .catch(err => console.log('Connection error to MongoDB :', err)); // Message d'erreur si la connexion échoue

// Exportation de l'application pour l'utiliser dans d'autres fichiers
module.exports = app;