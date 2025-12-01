const fs = require('fs');
const path = require('path');

// @desc    Upload un fichier
// @route   POST /api/uploads/single
// @access  Private (Admin/Editeur)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Fichier uploadé avec succès',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du fichier',
      error: error.message
    });
  }
};

// @desc    Upload plusieurs fichiers
// @route   POST /api/uploads/multiple
// @access  Private (Admin/Editeur)
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      path: file.path
    }));

    res.json({
      success: true,
      message: `${files.length} fichier(s) uploadé(s) avec succès`,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload des fichiers',
      error: error.message
    });
  }
};

// @desc    Supprimer un fichier
// @route   DELETE /api/uploads/:filename
// @access  Private (Admin/Editeur)
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;

    // Chercher le fichier dans les dossiers uploads
    const directories = ['images', 'videos', 'documents'];
    let fileDeleted = false;

    for (const dir of directories) {
      const filePath = path.join(__dirname, '../../public/uploads', dir, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        fileDeleted = true;
        break;
      }
    }

    if (!fileDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du fichier',
      error: error.message
    });
  }
};
