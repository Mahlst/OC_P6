// Importation des modules nécessaires
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Définition des types MIME acceptés et leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration du stockage en mémoire pour multer
const storage = multer.memoryStorage(); // Utiliser la mémoire pour stocker temporairement les fichiers

// Configuration de multer pour gérer les fichiers téléchargés
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype]; // Vérification du type MIME du fichier
        if (!extension) {
            return callback(new Error('Invalid file type'), false); // Rejet du fichier si le type MIME n'est pas valide
        }
        callback(null, true); // Acceptation du fichier
    }
});

// Middleware pour optimiser les images téléchargées
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next(); // Passer au middleware suivant si aucun fichier n'est téléchargé
    }

    const extension = MIME_TYPES[req.file.mimetype]; // Récupération de l'extension du fichier
    const filename = req.file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "") + Date.now() + '.' + extension; // Génération d'un nom de fichier unique
    const outputPath = path.join(__dirname, '..', 'uploads', filename); // Définition du chemin de sortie pour le fichier optimisé

    try {
        // Utilisation de sharp pour redimensionner et optimiser l'image
        await sharp(req.file.buffer)
            .resize(206, 260) // Redimensionnement de l'image
            .toFormat('jpeg') // Conversion au format JPEG
            .jpeg({ quality: 90 }) // Réglage de la qualité de l'image
            .toFile(outputPath); // Enregistrement de l'image optimisée

        req.file.path = outputPath; // Mise à jour du chemin du fichier dans la requête
        req.file.filename = filename; // Mise à jour du nom du fichier dans la requête
        next(); // Passer au middleware suivant
    } catch (err) {
        next(err); // Passer au middleware suivant en cas d'erreur
    }
};

// Exportation des modules upload et optimizeImage pour les utiliser dans d'autres fichiers
module.exports = { upload, optimizeImage };