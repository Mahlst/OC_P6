// Importation des modules nécessaires
const mongoose = require('mongoose');

// Définition du schéma pour le modèle Book
const BookSchema = new mongoose.Schema({
    userId: { type: String, required: true },   // Identifiant de l'utilisateur qui a ajouté le livre
    title: { type: String, required: true },    // Titre du livre
    author: { type: String, required: true },   // Auteur du livre
    imageUrl: { type: String, required: true }, // URL de l'image de couverture du livre
    year: { type: Number, required: true },     // Année de publication du livre
    genre: { type: String, required: true },    // Genre du livre
    ratings: [
    {
        userId: { type: String, required: true },   // Identifiant de l'utilisateur qui a donné la note
        grade: { type: Number, required: true }     // Note donnée par l'utilisateur
    }
  ],
  averageRating: { type: Number, default: 0 }   // Note moyenne du livre, par défaut 0
});

// Exportation du modèle Book pour l'utiliser dans d'autres fichiers
module.exports = mongoose.model('Book', BookSchema);