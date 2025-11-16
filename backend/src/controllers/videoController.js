const Video = require('../models/Video');
const { uploadVideo, cloudinary } = require('../config/cloudinary');

// Upload d'une vidéo
exports.uploadVideo = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier vidéo fourni' });
    }

    if (!type || !['visite3d', 'promoteur', 'analyseEconomique', 'architecte'].includes(type)) {
      return res.status(400).json({ message: 'Type de vidéo invalide' });
    }

    // Supprimer l'ancienne vidéo du même type si elle existe
    const existingVideo = await Video.findOne({ type });
    if (existingVideo && existingVideo.cloudinaryId) {
      // Supprimer le fichier de Cloudinary
      try {
        await cloudinary.uploader.destroy(existingVideo.cloudinaryId, { resource_type: 'video' });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne vidéo sur Cloudinary:', error);
      }
      // Supprimer de la base de données
      await Video.deleteOne({ type });
    }

    // Extraire l'URL sécurisée et l'ID Cloudinary
    const videoUrl = req.file.path; // URL Cloudinary
    const cloudinaryId = req.file.filename; // ID public Cloudinary

    // Sauvegarder la nouvelle vidéo
    const video = new Video({
      type,
      filename: req.file.originalname,
      originalName: req.file.originalname,
      path: videoUrl,
      cloudinaryId: cloudinaryId,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await video.save();

    res.status(201).json({
      message: 'Vidéo uploadée avec succès',
      video: {
        type: video.type,
        url: videoUrl,
        originalName: video.originalName,
        size: video.size,
        uploadedAt: video.uploadedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de la vidéo', error: error.message });
  }
};

// Récupérer toutes les vidéos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();

    const videosData = videos.reduce((acc, video) => {
      acc[video.type] = {
        url: video.path,
        originalName: video.originalName,
        size: video.size,
        uploadedAt: video.uploadedAt
      };
      return acc;
    }, {});

    res.status(200).json(videosData);
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des vidéos', error: error.message });
  }
};

// Récupérer une vidéo par type
exports.getVideoByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['visite3d', 'promoteur', 'analyseEconomique', 'architecte'].includes(type)) {
      return res.status(400).json({ message: 'Type de vidéo invalide' });
    }

    const video = await Video.findOne({ type });

    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }

    res.status(200).json({
      url: video.path,
      originalName: video.originalName,
      size: video.size,
      uploadedAt: video.uploadedAt
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la vidéo', error: error.message });
  }
};

// Supprimer une vidéo
exports.deleteVideo = async (req, res) => {
  try {
    const { type } = req.params;

    const video = await Video.findOne({ type });

    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }

    // Supprimer le fichier de Cloudinary
    if (video.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
      } catch (error) {
        console.error('Erreur lors de la suppression de la vidéo sur Cloudinary:', error);
      }
    }

    // Supprimer de la base de données
    await Video.deleteOne({ type });

    res.status(200).json({ message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la vidéo', error: error.message });
  }
};

/**
 * Sauvegarder une vidéo qui a été uploadée directement vers Cloudinary
 * (Upload direct depuis le frontend, pas de multer)
 */
exports.saveDirectUpload = async (req, res) => {
  try {
    const { type, cloudinaryUrl, cloudinaryId, originalName, size } = req.body;

    if (!type || !cloudinaryUrl || !cloudinaryId) {
      return res.status(400).json({
        message: 'Données manquantes (type, cloudinaryUrl, cloudinaryId requis)'
      });
    }

    if (!['visite3d', 'promoteur', 'analyseEconomique', 'architecte'].includes(type)) {
      return res.status(400).json({ message: 'Type de vidéo invalide' });
    }

    // Supprimer l'ancienne vidéo du même type si elle existe
    const existingVideo = await Video.findOne({ type });
    if (existingVideo && existingVideo.cloudinaryId) {
      // Supprimer le fichier de Cloudinary
      try {
        await cloudinary.uploader.destroy(existingVideo.cloudinaryId, { resource_type: 'video' });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne vidéo sur Cloudinary:', error);
      }
      // Supprimer de la base de données
      await Video.deleteOne({ type });
    }

    // Sauvegarder la nouvelle vidéo
    const video = new Video({
      type,
      filename: originalName || 'video',
      originalName: originalName || 'video',
      path: cloudinaryUrl,
      cloudinaryId: cloudinaryId,
      size: size || 0,
      mimetype: 'video/mp4'
    });

    await video.save();

    res.status(201).json({
      success: true,
      message: 'Vidéo sauvegardée avec succès',
      video: {
        type: video.type,
        url: cloudinaryUrl,
        originalName: video.originalName,
        size: video.size,
        uploadedAt: video.uploadedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde de la vidéo',
      error: error.message
    });
  }
};

// Exporter le middleware multer Cloudinary
exports.uploadMiddleware = uploadVideo.single('video');
