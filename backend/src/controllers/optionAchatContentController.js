const OptionAchatContent = require('../models/OptionAchatContent');

// @desc    Get active Option d'Achat content
// @route   GET /api/option-achat-content
// @access  Public
exports.getOptionAchatContent = async (req, res) => {
  try {
    let content = await OptionAchatContent.findOne({ isActive: true });

    // Si aucun contenu actif n'existe, en créer un avec les valeurs par défaut
    if (!content) {
      content = await OptionAchatContent.create({});
      console.log('Contenu Option d\'Achat créé automatiquement avec les valeurs par défaut');
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu Option d\'Achat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message
    });
  }
};

// @desc    Get all Option d'Achat contents (all versions)
// @route   GET /api/option-achat-content/all
// @access  Private/Admin
exports.getAllOptionAchatContents = async (req, res) => {
  try {
    const contents = await OptionAchatContent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les contenus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus',
      error: error.message
    });
  }
};

// @desc    Create new Option d'Achat content
// @route   POST /api/option-achat-content
// @access  Private/Admin
exports.createOptionAchatContent = async (req, res) => {
  try {
    const content = await OptionAchatContent.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Contenu Option d\'Achat créé avec succès',
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la création du contenu:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du contenu',
      error: error.message
    });
  }
};

// @desc    Update Option d'Achat content
// @route   PUT /api/option-achat-content/:id
// @access  Private/Admin
exports.updateOptionAchatContent = async (req, res) => {
  try {
    let content = await OptionAchatContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    content = await OptionAchatContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Contenu Option d\'Achat mis à jour avec succès',
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu',
      error: error.message
    });
  }
};

// @desc    Delete Option d'Achat content
// @route   DELETE /api/option-achat-content/:id
// @access  Private/Admin
exports.deleteOptionAchatContent = async (req, res) => {
  try {
    const content = await OptionAchatContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Empêcher la suppression si c'est le seul contenu actif
    if (content.isActive) {
      const count = await OptionAchatContent.countDocuments();
      if (count === 1) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer le dernier contenu actif'
        });
      }
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contenu Option d\'Achat supprimé avec succès',
      data: {}
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contenu:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu',
      error: error.message
    });
  }
};

// @desc    Activate Option d'Achat content
// @route   PUT /api/option-achat-content/:id/activate
// @access  Private/Admin
exports.activateOptionAchatContent = async (req, res) => {
  try {
    const content = await OptionAchatContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Désactiver tous les autres contenus
    await OptionAchatContent.updateMany(
      { _id: { $ne: req.params.id } },
      { $set: { isActive: false } }
    );

    // Activer le contenu sélectionné
    content.isActive = true;
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Contenu Option d\'Achat activé avec succès',
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de l\'activation du contenu:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'activation du contenu',
      error: error.message
    });
  }
};
