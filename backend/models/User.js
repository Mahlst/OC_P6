// Importation des modules nécessaires
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour le modèle User
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },    // Adresse email de l'utilisateur, doit être unique
    password: { type: String, required: true }                // Mot de passe de l'utilisateur
});

// Ajout du plugin uniqueValidator pour garantir l'unicité des champs spécifiés
UserSchema.plugin(uniqueValidator);

// Middleware pré-enregistrement pour hacher le mot de passe avant de le sauvegarder dans la base de données
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();          // Si le mot de passe n'est pas modifié, passer au middleware suivant
    const salt = await bcrypt.genSalt(10);                    // Génération d'un sel pour le hachage
    this.password = await bcrypt.hash(this.password, salt);   // Hachage du mot de passe avec le sel
    next(); // Passe au middleware suivant
});

// Exportation du modèle User pour l'utiliser dans d'autres fichiers
module.exports = mongoose.model('User', UserSchema);