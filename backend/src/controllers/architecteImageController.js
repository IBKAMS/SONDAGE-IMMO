const ArchitecteImage = require('../models/ArchitecteImage');
const { uploadImage, cloudinary } = require('../config/cloudinary');

// Types d'images architecte valides
const validTypes = ['projet-architecte-1', 'projet-architecte-2', 'projet-architecte-3'];

// Upload d'une image architecte
exports.uploadArchitecteImage = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier image fourni' });
    }

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: 'Type d\'image architecte invalide' });
    }

    // Supprimer l'ancienne image du même type si elle existe
    const existingImage = await ArchitecteImage.findOne({ type });
    if (existingImage && existingImage.cloudinaryId) {
      // Supprimer le fichier de Cloudinary
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne image architecte sur Cloudinary:', error);
      }
      // Supprimer de la base de données
      await ArchitecteImage.deleteOne({ type });
    }

    // Extraire l'URL sécurisée et l'ID Cloudinary
    const imageUrl = req.file.path; // URL Cloudinary
    const cloudinaryId = req.file.filename; // ID public Cloudinary

    // Sauvegarder la nouvelle image
    const image = new ArchitecteImage({
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
      message: 'Image architecte uploadée avec succès',
      image: {
        type: image.type,
        url: imageUrl,
        originalName: image.originalName,
        size: image.size,
        uploadedAt: image.uploadedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image architecte:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image architecte', error: error.message });
  }
};

// Récupérer toutes les images architecte
exports.getAllArchitecteImages = async (req, res) => {
  try {
    const images = await ArchitecteImage.find();

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
    console.error('Erreur lors de la récupération des images architecte:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des images architecte', error: error.message });
  }
};

// Récupérer une image architecte par type
exports.getArchitecteImageByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Type d\'image architecte invalide' });
    }

    const image = await ArchitecteImage.findOne({ type });

    if (!image) {
      return res.status(404).json({ message: 'Image architecte non trouvée' });
    }

    res.status(200).json({
      url: image.path,
      originalName: image.originalName,
      size: image.size,
      uploadedAt: image.uploadedAt
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image architecte:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'image architecte', error: error.message });
  }
};

// Supprimer une image architecte
exports.deleteArchitecteImage = async (req, res) => {
  try {
    const { type } = req.params;

    const image = await ArchitecteImage.findOne({ type });

    if (!image) {
      return res.status(404).json({ message: 'Image architecte non trouvée' });
    }

    // Supprimer le fichier de Cloudinary
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image architecte sur Cloudinary:', error);
      }
    }

    // Supprimer de la base de données
    await ArchitecteImage.deleteOne({ type });

    res.status(200).json({ message: 'Image architecte supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image architecte:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image architecte', error: error.message });
  }
};

// Exporter le middleware multer Cloudinary
exports.uploadMiddleware = uploadImage.single('image');
