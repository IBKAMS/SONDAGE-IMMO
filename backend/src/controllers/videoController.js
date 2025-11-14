const Video = require('../models/Video');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage avec multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/videos');
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

// Filtre pour n'accepter que les vidéos
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers vidéo sont autorisés!'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1.5 * 1024 * 1024 * 1024 // Limite de 1.5GB
  }
});

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
    if (existingVideo) {
      // Supprimer le fichier physique
      const oldFilePath = path.join(__dirname, '../../public', existingVideo.path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      // Supprimer de la base de données
      await Video.deleteOne({ type });
    }

    // Créer le chemin relatif pour l'URL
    const relativePath = `/uploads/videos/${req.file.filename}`;

    // Sauvegarder la nouvelle vidéo
    const video = new Video({
      type,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: relativePath,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await video.save();

    res.status(201).json({
      message: 'Vidéo uploadée avec succès',
      video: {
        type: video.type,
        url: relativePath,
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

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, '../../public', video.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer de la base de données
    await Video.deleteOne({ type });

    res.status(200).json({ message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la vidéo', error: error.message });
  }
};

// Exporter le middleware multer
exports.uploadMiddleware = upload.single('video');
