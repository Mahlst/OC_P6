// Importation de l'application Express depuis le fichier app.js
const app = require('./app');
// Importation du module HTTP natif de Node.js
const http = require('http');

// Définition du port sur lequel le serveur va écouter, en utilisant une variable d'environnement ou 4000 par défaut
const port = process.env.PORT || 4000;

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Démarrage du serveur et écoute sur le port défini
server.listen(port, () => {
  console.log(`Server running on port ${port}`); // Message de succès indiquant que le serveur fonctionne
});