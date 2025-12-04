const express = require('express');
const router = express.Router();
const {
  getLocalisationContent,
  getAllLocalisationContents,
  createLocalisationContent,
  updateLocalisationContent,
  deleteLocalisationContent,
  activateLocalisationContent,
  uploadMapImage,
  deleteMapImage,
  updateMapImageCaption,
  uploadMapImageMiddleware
} = require('../controllers/localisationContentController');

// Routes publiques
router.get('/', getLocalisationContent);

// Routes admin (temporairement publiques - à sécuriser plus tard)
router.get('/all', getAllLocalisationContents);
router.post('/', createLocalisationContent);
router.put('/:id', updateLocalisationContent);
router.delete('/:id', deleteLocalisationContent);
router.put('/:id/activate', activateLocalisationContent);

// Routes pour les images de carte (jusqu'à 3 images)
router.post('/:id/map-image', uploadMapImageMiddleware, uploadMapImage);
router.delete('/:id/map-image', deleteMapImage);  // Supprimer toutes les images
router.delete('/:id/map-image/:imageIndex', deleteMapImage);  // Supprimer une image spécifique
router.put('/:id/map-image/:imageIndex/caption', updateMapImageCaption);  // Mettre à jour la légende

module.exports = router;
