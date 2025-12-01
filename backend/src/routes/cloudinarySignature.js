const express = require('express');
const router = express.Router();
const crypto = require('crypto');
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

    // Paramètres pour l'upload - DOIVENT correspondre exactement à ce qui est envoyé
    const folder = 'sondage-immo/videos';
    const source = 'uw'; // Upload Widget

    // Créer la chaîne à signer (ordre alphabétique des paramètres)
    const stringToSign = `folder=${folder}&source=${source}&timestamp=${timestamp}`;

    // Générer la signature SHA1
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    console.log('String to sign:', stringToSign);
    console.log('Signature générée:', signature);

    // Retourner la signature et les paramètres nécessaires au frontend
    res.json({
      success: true,
      signature: signature,
      timestamp: timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'sondage-immo/videos',
      source: 'uw'
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
    const folder = 'sondage-immo/images';
    const source = 'uw'; // Upload Widget

    // Créer la chaîne à signer (ordre alphabétique des paramètres)
    const stringToSign = `folder=${folder}&source=${source}&timestamp=${timestamp}`;

    // Générer la signature SHA1
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    console.log('String to sign (image):', stringToSign);
    console.log('Signature générée (image):', signature);

    res.json({
      success: true,
      signature: signature,
      timestamp: timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'sondage-immo/images',
      source: 'uw'
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
