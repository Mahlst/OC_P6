// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Importer le module path

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Création d'une instance de l'application Express
const app = express();

// Connexion à la base de données MongoDB en utilisant l'URI stockée dans les variables d'environnement
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connection to MongoDB successful !')) // Message de succès si la connexion est établie
    .catch(err => console.log('Connection error to MongoDB :', err)); // Message d'erreur si la connexion échoue

// Middleware pour configurer les en-têtes CORS afin de permettre les requêtes cross-origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise les en-têtes spécifiés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autorise les méthodes HTTP spécifiées
    next(); // Passe au middleware suivant
});

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Exportation de l'application pour l'utiliser dans d'autres fichiers
module.exports = app;