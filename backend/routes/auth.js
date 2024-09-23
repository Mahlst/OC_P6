// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Route pour l'inscription
router.post('/signup', authController.signup); // Appelle la méthode signup du contrôleur d'authentification

// Route pour la connexion
router.post('/login', authController.login); // Appelle la méthode login du contrôleur d'authentification

// Exportation du routeur pour l'utiliser dans d'autres fichiers
module.exports = router;