const FooterContent = require('../models/FooterContent');

// @desc    Obtenir le contenu actif du footer
// @route   GET /api/footer-content
// @access  Public
exports.getFooterContent = async (req, res) => {
  try {
    let content = await FooterContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer un contenu par défaut
    if (!content) {
      content = await FooterContent.create({
        brand: {
          name: 'CITÉ KONGO',
          slogan: 'Votre projet immobilier de prestige en Côte d\'Ivoire'
        },
        navigation: {
          title: 'Navigation',
          links: [
            { label: 'Présentation', url: '/presentation' },
            { label: 'Logements', url: '/logements' },
            { label: 'Localisation', url: '/localisation' },
            { label: 'Option d\'Achat', url: '/option-achat' }
          ]
        },
        informations: {
          title: 'Informations',
          links: [
            { label: 'Le Promoteur', url: '/promoteur' },
            { label: 'L\'Architecte', url: '/architecte' },
            { label: 'Analyse Économique', url: '/analyse-economique' }
          ]
        },
        contact: {
          title: 'Contact',
          phone: '+225 XX XX XX XX XX',
          email: 'contact@citekongo.ci',
          address: 'Abidjan, Côte d\'Ivoire'
        },
        copyright: {
          text: '© 2024 Cité Kongo. Tous droits réservés.'
        },
        isActive: true
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur getFooterContent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir tous les contenus du footer
// @route   GET /api/footer-content/all
// @access  Private (Admin)
exports.getAllFooterContent = async (req, res) => {
  try {
    const contents = await FooterContent.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Créer un nouveau contenu footer
// @route   POST /api/footer-content
// @access  Private (Admin)
exports.createFooterContent = async (req, res) => {
  try {
    const content = await FooterContent.create(req.body);
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur createFooterContent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création'
    });
  }
};

// @desc    Mettre à jour le contenu footer
// @route   PUT /api/footer-content/:id
// @access  Private (Admin)
exports.updateFooterContent = async (req, res) => {
  try {
    const content = await FooterContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur updateFooterContent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
};

// @desc    Supprimer un contenu footer
// @route   DELETE /api/footer-content/:id
// @access  Private (Admin)
exports.deleteFooterContent = async (req, res) => {
  try {
    const content = await FooterContent.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Contenu supprimé'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
};
