const PromoteurImage = require('../models/PromoteurImage');
const { uploadImage, cloudinary } = require('../config/cloudinary');

// Types d'images promoteur valides
const validTypes = ['residence-3k', 'residence-ciel-jardin', 'miensah-cite-lumiere'];

// Upload d'une image promoteur
exports.uploadPromoteurImage = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier image fourni' });
    }

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: 'Type d\'image promoteur invalide' });
    }

    // Supprimer l'ancienne image du même type si elle existe
    const existingImage = await PromoteurImage.findOne({ type });
    if (existingImage && existingImage.cloudinaryId) {
      // Supprimer le fichier de Cloudinary
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne image promoteur sur Cloudinary:', error);
      }
      // Supprimer de la base de données
      await PromoteurImage.deleteOne({ type });
    }

    // Extraire l'URL sécurisée et l'ID Cloudinary
    const imageUrl = req.file.path; // URL Cloudinary
    const cloudinaryId = req.file.filename; // ID public Cloudinary

    // Sauvegarder la nouvelle image
    const image = new PromoteurImage({
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
      message: 'Image promoteur uploadée avec succès',
      image: {
        type: image.type,
        url: imageUrl,
        originalName: image.originalName,
        size: image.size,
        uploadedAt: image.uploadedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image promoteur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image promoteur', error: error.message });
  }
};

// Récupérer toutes les images promoteur
exports.getAllPromoteurImages = async (req, res) => {
  try {
    const images = await PromoteurImage.find();

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
    console.error('Erreur lors de la récupération des images promoteur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des images promoteur', error: error.message });
  }
};

// Récupérer une image promoteur par type
exports.getPromoteurImageByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Type d\'image promoteur invalide' });
    }

    const image = await PromoteurImage.findOne({ type });

    if (!image) {
      return res.status(404).json({ message: 'Image promoteur non trouvée' });
    }

    res.status(200).json({
      url: image.path,
      originalName: image.originalName,
      size: image.size,
      uploadedAt: image.uploadedAt
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image promoteur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'image promoteur', error: error.message });
  }
};

// Supprimer une image promoteur
exports.deletePromoteurImage = async (req, res) => {
  try {
    const { type } = req.params;

    const image = await PromoteurImage.findOne({ type });

    if (!image) {
      return res.status(404).json({ message: 'Image promoteur non trouvée' });
    }

    // Supprimer le fichier de Cloudinary
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image promoteur sur Cloudinary:', error);
      }
    }

    // Supprimer de la base de données
    await PromoteurImage.deleteOne({ type });

    res.status(200).json({ message: 'Image promoteur supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image promoteur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image promoteur', error: error.message });
  }
};

// Exporter le middleware multer Cloudinary
exports.uploadMiddleware = uploadImage.single('image');
