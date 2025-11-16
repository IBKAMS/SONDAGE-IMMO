const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');

/**
 * Route pour générer une signature d'upload Cloudinary
 * Cette signature permet au frontend d'uploader directement vers Cloudinary
 * sans passer par le backend Render (évite les timeouts)
 */
router.post('/signature', async (req, res) => {
  try {
    // Timestamp actuel (en secondes)
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Paramètres de l'upload qui seront signés
    const params = {
      timestamp: timestamp,
      folder: 'sondage-immo/videos', // Dossier pour les vidéos
      resource_type: 'video'
    };

    // Générer la signature avec le secret API
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    // Retourner la signature et les paramètres nécessaires au frontend
    res.json({
      success: true,
      signature: signature,
      timestamp: timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'sondage-immo/videos'
    });
  } catch (error) {
    console.error('Erreur lors de la génération de la signature Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de la signature',
      error: error.message
    });
  }
});

/**
 * Route pour générer une signature d'upload d'image Cloudinary
 */
router.post('/signature-image', async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = {
      timestamp: timestamp,
      folder: 'sondage-immo/images',
      resource_type: 'image'
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      signature: signature,
      timestamp: timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'sondage-immo/images'
    });
  } catch (error) {
    console.error('Erreur lors de la génération de la signature Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de la signature',
      error: error.message
    });
  }
});

module.exports = router;
