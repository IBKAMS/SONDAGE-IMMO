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

// Routes pour l'image de carte
router.post('/:id/map-image', uploadMapImageMiddleware, uploadMapImage);
router.delete('/:id/map-image', deleteMapImage);

module.exports = router;
