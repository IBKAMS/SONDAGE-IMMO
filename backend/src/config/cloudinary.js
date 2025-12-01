const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration de Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurer le stockage pour les VIDÉOS
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sondage-immo/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mpeg', 'quicktime', 'x-msvideo', 'webm'],
    // Limite de taille de fichier: 1.5GB
    transformation: [{ quality: 'auto' }]
  }
});

// Configurer le stockage pour les IMAGES
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sondage-immo/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    // Optimisation automatique des images
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  }
});

// Configuration de multer pour les vidéos
const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1.5 * 1024 * 1024 * 1024 // Limite de 1.5GB
  }
});

// Configuration de multer pour les images
const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

module.exports = {
  cloudinary,
  uploadVideo,
  uploadImage
};
