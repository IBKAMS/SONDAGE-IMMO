const HomeContent = require('../models/HomeContent');

// @desc    Récupérer le contenu actif de la page d'accueil
// @route   GET /api/home-content
// @access  Public
exports.getHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer le contenu par défaut
    if (!content) {
      content = await HomeContent.create({
        hero: {
          title: 'Cité KONGO',
          subtitle: 'Votre futur cadre de vie à Port-Bouët, quartier ABEKAN-BERNARD',
          description: 'Découvrez nos villas d\'exception alliant confort, modernité et sécurité',
          primaryButtonText: 'Découvrir les logements',
          secondaryButtonText: 'Commencer le questionnaire'
        },
        stats: [
          { title: '3 Types', description: 'de villas disponibles', order: 1 },
          { title: '150 à 300m²', description: 'de surface habitable', order: 2 },
          { title: 'Port-Bouët', description: 'Localisation stratégique', order: 3 },
          { title: 'Investissement', description: 'Rentable et sécurisé', order: 4 }
        ],
        quickLinks: {
          sectionTitle: 'Découvrir le Projet',
          cards: [
            { title: 'Présentation', description: 'Découvrez le projet Cité KONGO en détail', order: 1 },
            { title: 'Le Promoteur', description: 'KONGO IMMOBILIER, votre partenaire de confiance', order: 2 },
            { title: 'L\'Architecte', description: 'ARCHITECTES 21, expertise et innovation', order: 3 },
            { title: 'Localisation', description: 'Un emplacement idéal à Port-Bouët', order: 4 }
          ]
        },
        cta: {
          title: 'Prêt à devenir propriétaire?',
          description: 'Répondez à notre questionnaire pour être recontacté rapidement',
          buttonText: 'Commencer maintenant'
        },
        isActive: true
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur récupération contenu accueil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu'
    });
  }
};

// @desc    Mettre à jour le contenu de la page d'accueil
// @route   PUT /api/home-content/:id
// @access  Public (À PROTÉGER PLUS TARD)
exports.updateHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findByIdAndUpdate(
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
    console.error('Erreur mise à jour contenu accueil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu'
    });
  }
};

// @desc    Créer un nouveau contenu (version alternative)
// @route   POST /api/home-content
// @access  Public (À PROTÉGER PLUS TARD)
exports.createHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.create(req.body);

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur création contenu accueil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du contenu'
    });
  }
};

// @desc    Récupérer tous les contenus (pour historique/versions)
// @route   GET /api/home-content/all
// @access  Public (À PROTÉGER PLUS TARD)
exports.getAllHomeContents = async (req, res) => {
  try {
    const contents = await HomeContent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('Erreur récupération tous les contenus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus'
    });
  }
};

// @desc    Supprimer un contenu
// @route   DELETE /api/home-content/:id
// @access  Public (À PROTÉGER PLUS TARD)
exports.deleteHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Ne pas supprimer le contenu actif si c'est le seul
    if (content.isActive) {
      const count = await HomeContent.countDocuments();
      if (count === 1) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer le seul contenu actif'
        });
      }
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu'
    });
  }
};

// @desc    Activer un contenu spécifique
// @route   PUT /api/home-content/:id/activate
// @access  Public (À PROTÉGER PLUS TARD)
exports.activateHomeContent = async (req, res) => {
  try {
    // Désactiver tous les autres contenus
    await HomeContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await HomeContent.findByIdAndUpdate(
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
    console.error('Erreur activation contenu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'activation du contenu'
    });
  }
};
