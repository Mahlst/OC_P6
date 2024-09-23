// Importation des modules nécessaires
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
exports.signup = async (req, res) => {
  const { email, password } = req.body; // Récupération de l'email et du mot de passe depuis le corps de la requête
  try {
    const newUser = new User({ email, password }); // Création d'un nouvel utilisateur avec l'email et le mot de passe fournis
    await newUser.save(); // Sauvegarde de l'utilisateur dans la base de données
    res.status(201).json({ message: 'Utilisateur créé avec succès' }); // Réponse de succès avec un message
  } catch (err) {
    res.status(400).json({ message: err.message }); // Réponse d'erreur avec le message d'erreur
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body; // Récupération de l'email et du mot de passe depuis le corps de la requête
  try {
    const user = await User.findOne({ email }); // Recherche de l'utilisateur dans la base de données par email
    if (!user) return res.status(400).json({ message: 'Couple identifiant / mot de passe incorrect' }); // Si l'utilisateur n'existe pas, réponse d'erreur

    const isMatch = await bcrypt.compare(password, user.password); // Comparaison du mot de passe fourni avec le mot de passe haché dans la base de données
    if (!isMatch) return res.status(400).json({ message: 'Couple identifiant / mot de passe incorrect' }); // Si les mots de passe ne correspondent pas, réponse d'erreur

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Génération d'un token JWT avec l'ID de l'utilisateur et une expiration de 24 heures
    res.status(200).json({ userId: user._id, token }); // Réponse de succès avec l'ID de l'utilisateur et le token
  } catch (err) {
    res.status(400).json({ message: err.message }); // Réponse d'erreur avec le message d'erreur
  }
};