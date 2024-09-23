// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const { upload, optimizeImage } = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// Route pour créer un livre
router.post('/', authMiddleware, upload.single('image'), optimizeImage, bookController.createBook); 
// Appelle la méthode createBook du contrôleur de livres après avoir appliqué les middlewares d'authentification, de téléchargement et d'optimisation d'image

// Route pour lire tous les livres
router.get('/', bookController.getAllBooks); 
// Appelle la méthode getAllBooks du contrôleur de livres

// Route pour lire les livres avec la meilleure note
router.get('/bestrating', bookController.getBestRatedBooks); 
// Appelle la méthode getBestRatedBooks du contrôleur de livres

// Route pour lire un livre par ID
router.get('/:id', bookController.getBookById); 
// Appelle la méthode getBookById du contrôleur de livres

// Route pour mettre à jour un livre
router.put('/:id', authMiddleware, upload.single('image'), optimizeImage, bookController.updateBook); 
// Appelle la méthode updateBook du contrôleur de livres après avoir appliqué les middlewares d'authentification, de téléchargement et d'optimisation d'image

// Route pour supprimer un livre
router.delete('/:id', authMiddleware, bookController.deleteBook); 
// Appelle la méthode deleteBook du contrôleur de livres après avoir appliqué le middleware d'authentification

// Route pour noter un livre
router.post('/:id/rating', authMiddleware, bookController.rateBook); 
// Appelle la méthode rateBook du contrôleur de livres après avoir appliqué le middleware d'authentification

// Exportation du routeur pour l'utiliser dans d'autres fichiers
module.exports = router;