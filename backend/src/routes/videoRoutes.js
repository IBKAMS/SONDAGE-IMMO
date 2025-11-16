const express = require('express');
const router = express.Router();
const {
  uploadMiddleware,
  uploadVideo,
  getAllVideos,
  getVideoByType,
  deleteVideo,
  saveDirectUpload
} = require('../controllers/videoController');

// Upload une vidéo (méthode classique via backend - peut causer des timeouts)
router.post('/upload', uploadMiddleware, uploadVideo);

// Sauvegarder une vidéo uploadée directement vers Cloudinary (recommandé pour gros fichiers)
router.post('/save-direct', saveDirectUpload);

// Récupérer toutes les vidéos
router.get('/', getAllVideos);

// Récupérer une vidéo par type
router.get('/:type', getVideoByType);

// Supprimer une vidéo
router.delete('/:type', deleteVideo);

module.exports = router;
