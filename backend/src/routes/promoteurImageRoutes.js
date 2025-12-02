const express = require('express');
const router = express.Router();
const {
  uploadMiddleware,
  uploadPromoteurImage,
  getAllPromoteurImages,
  getPromoteurImageByType,
  deletePromoteurImage
} = require('../controllers/promoteurImageController');

// Upload une image promoteur
router.post('/upload', uploadMiddleware, uploadPromoteurImage);

// Récupérer toutes les images promoteur
router.get('/', getAllPromoteurImages);

// Récupérer une image promoteur par type
router.get('/:type', getPromoteurImageByType);

// Supprimer une image promoteur
router.delete('/:type', deletePromoteurImage);

module.exports = router;
