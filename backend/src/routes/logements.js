const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');
const {
  getLogements,
  getAllLogements,
  getLogement,
  createLogement,
  updateLogement,
  deleteLogement,
  getStats
} = require('../controllers/logementsController');

// Routes publiques
router.get('/', getLogements);
router.get('/stats/all', getStats);
router.get('/admin/all', getAllLogements);
router.get('/:id', getLogement);

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.post('/', createLogement);
router.put('/:id', updateLogement);
router.delete('/:id', deleteLogement);

// Route pour uploader une image de logement (TEMPORAIREMENT publique)
router.post('/upload-image', uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier image fourni'
      });
    }

    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        url: req.file.path,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Erreur upload image logement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message
    });
  }
});

module.exports = router;
