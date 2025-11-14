const Image = require('../models/Image');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage avec multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/images');
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés!'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Upload d'une image
exports.uploadImage = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier image fourni' });
    }

    if (!type || !['villa-duplex-4p', 'villa-duplex-5p', 'villa-triplex-6p'].includes(type)) {
      return res.status(400).json({ message: 'Type d\'image invalide' });
    }

    // Supprimer l'ancienne image du même type si elle existe
    const existingImage = await Image.findOne({ type });
    if (existingImage) {
      // Supprimer le fichier physique
      const oldFilePath = path.join(__dirname, '../../public', existingImage.path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      // Supprimer de la base de données
      await Image.deleteOne({ type });
    }

    // Créer le chemin relatif pour l'URL
    const relativePath = `/uploads/images/${req.file.filename}`;

    // Sauvegarder la nouvelle image
    const image = new Image({
      type,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: relativePath,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploadée avec succès',
      image: {
        type: image.type,
        url: relativePath,
        originalName: image.originalName,
        size: image.size,
        uploadedAt: image.uploadedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image', error: error.message });
  }
};

// Récupérer toutes les images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();

    const imagesData = images.reduce((acc, image) => {
      acc[image.type] = {
        url: image.path,
        originalName: image.originalName,
        size: image.size,
        uploadedAt: image.uploadedAt
      };
      return acc;
    }, {});

    res.status(200).json(imagesData);
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des images', error: error.message });
  }
};

// Récupérer une image par type
exports.getImageByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['villa-duplex-4p', 'villa-duplex-5p', 'villa-triplex-6p'].includes(type)) {
      return res.status(400).json({ message: 'Type d\'image invalide' });
    }

    const image = await Image.findOne({ type });

    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    res.status(200).json({
      url: image.path,
      originalName: image.originalName,
      size: image.size,
      uploadedAt: image.uploadedAt
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'image', error: error.message });
  }
};

// Supprimer une image
exports.deleteImage = async (req, res) => {
  try {
    const { type } = req.params;

    const image = await Image.findOne({ type });

    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, '../../public', image.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer de la base de données
    await Image.deleteOne({ type });

    res.status(200).json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image', error: error.message });
  }
};

// Exporter le middleware multer
exports.uploadMiddleware = upload.single('image');
