const express = require('express');
const router = express.Router();
const {
  uploadMiddleware,
  uploadImage,
  getAllImages,
  getImageByType,
  deleteImage
} = require('../controllers/imageController');

// Upload une image
router.post('/upload', uploadMiddleware, uploadImage);

// Récupérer toutes les images
router.get('/', getAllImages);

// Récupérer une image par type
router.get('/:type', getImageByType);

// Supprimer une image
router.delete('/:type', deleteImage);

module.exports = router;
