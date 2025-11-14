const PresentationContent = require('../models/PresentationContent');

// @desc    Get active presentation content (public)
// @route   GET /api/presentation-content
// @access  Public
exports.getPresentationContent = async (req, res) => {
  try {
    let content = await PresentationContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer un contenu par défaut
    if (!content) {
      content = await PresentationContent.create({
        hero: {
          title: 'Cité KONGO',
          subtitle: 'L\'habitat de demain - accessible, moderne et parfaitement intégré'
        },
        project: {
          title: 'Le Projet',
          leadParagraph: 'Idéalement située dans la commune de Port-Bouët, au cœur du quartier ABEKAN-BERNARD, la Cité KONGO offre un cadre de vie moderne et sécurisé.',
          description: 'Ce projet ambitieux propose des villas d\'exception, alliant confort, design contemporain et qualité de construction. Chaque logement a été pensé pour répondre aux besoins des familles modernes en quête de bien-être et de sérénité.'
        },
        isActive: true
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du contenu'
    });
  }
};

// @desc    Get all presentation contents (admin)
// @route   GET /api/presentation-content/all
// @access  Admin
exports.getAllPresentationContents = async (req, res) => {
  try {
    const contents = await PresentationContent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les contenus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Create new presentation content
// @route   POST /api/presentation-content
// @access  Admin
exports.createPresentationContent = async (req, res) => {
  try {
    const content = await PresentationContent.create(req.body);

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la création du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du contenu'
    });
  }
};

// @desc    Update presentation content
// @route   PUT /api/presentation-content/:id
// @access  Admin
exports.updatePresentationContent = async (req, res) => {
  try {
    const content = await PresentationContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};

// @desc    Delete presentation content
// @route   DELETE /api/presentation-content/:id
// @access  Admin
exports.deletePresentationContent = async (req, res) => {
  try {
    const content = await PresentationContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression'
    });
  }
};

// @desc    Activate presentation content
// @route   PUT /api/presentation-content/:id/activate
// @access  Admin
exports.activatePresentationContent = async (req, res) => {
  try {
    // Désactiver tous les contenus
    await PresentationContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await PresentationContent.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur lors de l\'activation du contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'activation'
    });
  }
};
