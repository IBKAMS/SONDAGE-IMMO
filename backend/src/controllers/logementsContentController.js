const LogementsContent = require('../models/LogementsContent');

// @desc    Get active logements content (public)
// @route   GET /api/logements-content
// @access  Public
exports.getLogementsContent = async (req, res) => {
  try {
    let content = await LogementsContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer un contenu par défaut
    if (!content) {
      content = await LogementsContent.create({
        hero: {
          title: 'Nos Logements',
          subtitle: 'Découvrez notre sélection d\'appartements et villas',
          stats: {
            labelTotal: 'Logements',
            labelDisponibles: 'Disponibles',
            labelPrixMin: 'Prix minimum'
          }
        },
        filters: {
          title: 'Filtrer les logements',
          buttonShow: 'Afficher',
          buttonHide: 'Masquer',
          labelTypeBien: 'Type de bien',
          labelPrixMin: 'Prix minimum (FCFA)',
          labelPrixMax: 'Prix maximum (FCFA)',
          labelSuperficieMin: 'Superficie min (m²)',
          labelSuperficieMax: 'Superficie max (m²)',
          labelStatut: 'Statut',
          buttonReset: 'Réinitialiser',
          resultsText: 'résultat(s)'
        },
        noResults: {
          title: 'Aucun logement trouvé',
          message: 'Essayez de modifier vos critères de recherche',
          buttonReset: 'Réinitialiser les filtres'
        },
        cta: {
          title: 'Vous avez trouvé votre logement idéal ?',
          subtitle: 'Répondez à notre questionnaire pour être recontacté rapidement',
          buttonText: 'Commencer le questionnaire'
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

// @desc    Get all logements contents (admin)
// @route   GET /api/logements-content/all
// @access  Admin
exports.getAllLogementsContents = async (req, res) => {
  try {
    const contents = await LogementsContent.find().sort({ createdAt: -1 });

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

// @desc    Create new logements content
// @route   POST /api/logements-content
// @access  Admin
exports.createLogementsContent = async (req, res) => {
  try {
    const content = await LogementsContent.create(req.body);

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

// @desc    Update logements content
// @route   PUT /api/logements-content/:id
// @access  Admin
exports.updateLogementsContent = async (req, res) => {
  try {
    const content = await LogementsContent.findByIdAndUpdate(
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

// @desc    Delete logements content
// @route   DELETE /api/logements-content/:id
// @access  Admin
exports.deleteLogementsContent = async (req, res) => {
  try {
    const content = await LogementsContent.findById(req.params.id);

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

// @desc    Activate logements content
// @route   PUT /api/logements-content/:id/activate
// @access  Admin
exports.activateLogementsContent = async (req, res) => {
  try {
    // Désactiver tous les contenus
    await LogementsContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await LogementsContent.findByIdAndUpdate(
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
