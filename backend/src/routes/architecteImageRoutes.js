const express = require('express');
const router = express.Router();
const {
  uploadMiddleware,
  uploadArchitecteImage,
  getAllArchitecteImages,
  getArchitecteImageByType,
  deleteArchitecteImage
} = require('../controllers/architecteImageController');

// Upload une image architecte
router.post('/upload', uploadMiddleware, uploadArchitecteImage);

// Récupérer toutes les images architecte
router.get('/', getAllArchitecteImages);

// Récupérer une image architecte par type
router.get('/:type', getArchitecteImageByType);

// Supprimer une image architecte
router.delete('/:type', deleteArchitecteImage);

module.exports = router;
