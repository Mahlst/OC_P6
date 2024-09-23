// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  // Récupération du token depuis l'en-tête Authorization et suppression du préfixe 'Bearer '
  const token = req.header('Authorization').replace('Bearer ', '');

  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' }); // Réponse d'erreur si aucun token n'est fourni
  }

  try {
    // Vérification et décodage du token en utilisant le secret JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajout des informations décodées de l'utilisateur à l'objet de requête
    next(); // Passage au middleware suivant
  } catch (err) {
    res.status(400).json({ message: 'Token invalide.' }); // Réponse d'erreur si le token est invalide
  }
};

// Exportation du middleware d'authentification pour l'utiliser dans d'autres fichiers
module.exports = authMiddleware;