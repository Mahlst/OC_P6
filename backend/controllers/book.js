// Importation des modules nécessaires
const fs = require('fs');
const path = require('path');
const Book = require('../models/Book');

// Créer un livre
exports.createBook = async (req, res) => {

  // Analyser la chaîne JSON pour extraire les données du livre
  const bookData = JSON.parse(req.body.book);
  const { title, author, year, genre, ratings } = bookData;

  // Vérification des champs obligatoires
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Création d'un nouvel objet Book avec les données fournies
    const newBook = new Book({
      userId: req.user.id,
      title,
      author,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      year,
      genre,
      ratings: [
        {
          userId: req.user.id,
          grade: ratings[0].grade
        },
      ],
      averageRating: ratings[0].grade
    });
    await newBook.save(); // Sauvegarde du livre dans la base de données
    res.status(201).json({ message: 'Livre créé avec succès' }); // Réponse de succès
  } catch (err) {
    console.error('Erreur lors de la création du livre:', err); // Log de l'erreur
    res.status(400).json({ message: err.message }); // Réponse d'erreur
  }
};

// Lire tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Récupération de tous les livres dans la base de données
    res.status(200).json(books); // Réponse avec la liste des livres
  } catch (err) {
    res.status(400).json({ message: err.message }); // Réponse d'erreur
  }
};

// Lire un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Récupération du livre par ID
    res.status(200).json(book); // Réponse avec les détails du livre
  } catch (err) {
    res.status(400).json({ message: err.message }); // Réponse d'erreur
  }
};

// Lire les livres avec la meilleure note
exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3); // Récupération des 3 livres les mieux notés
    res.status(200).json(books); // Réponse avec la liste des livres
  } catch (err) {
    console.error('Erreur lors de la récupération des livres les mieux notés:', err); // Log de l'erreur
    res.status(400).json({ message: err.message }); // Réponse d'erreur
  }
};

// Mettre à jour un livre
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id); // Récupération du livre par ID
    if (book.userId !== req.user.id) {
      return res.status(403).json({ message: 'Requête non autorisée' }); // Vérification de l'autorisation de l'utilisateur
    }

    // Analyser les données du livre si elles sont envoyées sous forme de chaîne JSON
    let updateData = {};
    if (req.body.book) {
      try {
        updateData = JSON.parse(req.body.book);
      } catch (error) {
        return res.status(400).json({ message: 'Format JSON invalide pour les données du livre' }); 
      }
    } else {
      updateData = req.body;
    }

    // Champs que nous autorisons à être mis à jour
    const { title, author, year, genre } = updateData;
    const filteredUpdateData = {
      title: title || book.title,
      author: author || book.author,
      year: year || book.year,
      genre: genre || book.genre
    };

    // Si un fichier est téléchargé, supprimer l'ancienne image et mettre à jour l'URL de la nouvelle image
    if (req.file) {
      // Extraire le chemin relatif de l'ancienne image à partir de l'URL
      const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(book.imageUrl));

      // Supprimer l'ancienne image
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression de l\'ancienne image:', err);
        } else {
          console.log('Ancienne image supprimée avec succès:', oldImagePath);
        }
      });

      // Mettre à jour l'URL de la nouvelle image
      filteredUpdateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Mettre à jour le livre avec les nouvelles données
    const updatedBook = await Book.findByIdAndUpdate(id, filteredUpdateData, { new: true });
    res.status(200).json({ message: 'Livre mis à jour avec succès', book: updatedBook }); // Réponse de succès
  } catch (err) {
    console.error('Erreur lors de la mise à jour du livre:', err);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du livre', error: err.message });  // Réponse d'erreur
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id); // Récupération du livre par ID
    if (book.userId !== req.user.id) {
      return res.status(403).json({ message: 'Requête non autorisée' }); // Vérification de l'autorisation de l'utilisateur
    }

    // Supprimer l'image associée
    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(book.imageUrl));
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression de l\'image:', err);
      } else {
        console.log('Image supprimée avec succès:', imagePath);
      }
    });

    await Book.findByIdAndDelete(id); // Suppression du livre dans la base de données
    res.status(204).json({ message: 'Livre supprimé avec succès' }); // Réponse de succès
  } catch (err) {
    res.status(400).json({ message: err.message }); // Réponse d'erreur
  }
};

// Noter un livre
exports.rateBook = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  try {
    const book = await Book.findById(id); // Récupération du livre par ID
    if (book.ratings.some(r => r.userId === userId)) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre' }); // Vérification si l'utilisateur a déjà noté le livre
    }
    book.ratings.push({ userId: req.user.id, grade: rating }); // Ajout de la nouvelle note
    book.averageRating = book.ratings.reduce((acc, r) => acc + r.grade, 0) / book.ratings.length; // Calcul de la nouvelle note moyenne
    await book.save(); // Sauvegarde du livre avec la nouvelle note
    res.status(200).json(book); // Réponse de succès avec les détails du livre
  } catch (err) {
    res.status(400).json({ message: err.message }); // Réponse d'erreur
  }
};