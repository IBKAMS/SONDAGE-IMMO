const Image = require('../models/Image');
const { uploadImage, cloudinary } = require('../config/cloudinary');

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
    if (existingImage && existingImage.cloudinaryId) {
      // Supprimer le fichier de Cloudinary
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne image sur Cloudinary:', error);
      }
      // Supprimer de la base de données
      await Image.deleteOne({ type });
    }

    // Extraire l'URL sécurisée et l'ID Cloudinary
    const imageUrl = req.file.path; // URL Cloudinary
    const cloudinaryId = req.file.filename; // ID public Cloudinary

    // Sauvegarder la nouvelle image
    const image = new Image({
      type,
      filename: req.file.originalname,
      originalName: req.file.originalname,
      path: imageUrl,
      cloudinaryId: cloudinaryId,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploadée avec succès',
      image: {
        type: image.type,
        url: imageUrl,
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

    // Supprimer le fichier de Cloudinary
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image sur Cloudinary:', error);
      }
    }

    // Supprimer de la base de données
    await Image.deleteOne({ type });

    res.status(200).json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image', error: error.message });
  }
};

// Exporter le middleware multer Cloudinary
exports.uploadMiddleware = uploadImage.single('image');
