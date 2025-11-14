const express = require('express');
const router = express.Router();
const {
  uploadMiddleware,
  uploadVideo,
  getAllVideos,
  getVideoByType,
  deleteVideo
} = require('../controllers/videoController');

// Upload une vidéo
router.post('/upload', uploadMiddleware, uploadVideo);

// Récupérer toutes les vidéos
router.get('/', getAllVideos);

// Récupérer une vidéo par type
router.get('/:type', getVideoByType);

// Supprimer une vidéo
router.delete('/:type', deleteVideo);

module.exports = router;
