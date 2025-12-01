const LocalisationContent = require('../models/LocalisationContent');

// @desc    Get active localisation content (public)
// @route   GET /api/localisation-content
// @access  Public
exports.getLocalisationContent = async (req, res) => {
  try {
    let content = await LocalisationContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer un contenu par défaut
    if (!content) {
      content = await LocalisationContent.create({
        hero: {
          title: 'Localisation',
          subtitle: 'CITÉ KONGO - Abekan Bernard, Port-Bouët'
        },
        infoSection: {
          title: 'Une localisation stratégique',
          leadText: 'La CITÉ KONGO est idéalement située dans le quartier Abekan Bernard à Port-Bouët, l\'une des communes les plus dynamiques d\'Abidjan.',
          description: 'Cette localisation privilégiée vous offre un accès facile à tous les services essentiels tout en bénéficiant du calme d\'un quartier résidentiel en développement.'
        },
        mapSection: {
          title: 'Découvrez notre emplacement',
          subtitle: 'Abekan Bernard, Port-Bouët - Abidjan, Côte d\'Ivoire',
          indicatorText: 'Site du Projet',
          indicatorLocation: 'Abekan Bernard',
          linkText: '📍 Ouvrir dans Google Maps (Vue détaillée)',
          cardTitle: 'CITÉ KONGO',
          cardLocation1: 'Abekan Bernard',
          cardLocation2: 'Port-Bouët, Abidjan',
          cardLocation3: 'Côte d\'Ivoire',
          cardButtonText: 'Ouvrir dans Google Maps'
        },
        avantagesSection: {
          title: 'Les avantages de notre localisation',
          subtitle: 'Un emplacement qui facilite votre quotidien',
          avantage1: {
            titre: 'Vue sur la Lagune',
            description: 'Site donnant sur la lagune Ébrié, offrant un cadre de vie exceptionnel'
          },
          avantage2: {
            titre: 'Proximité Aéroport',
            description: 'À quelques minutes de l\'aéroport international Félix Houphouët-Boigny'
          },
          avantage3: {
            titre: 'Accès Rapide',
            description: 'Axes routiers majeurs et voies bitumées directes'
          },
          avantage4: {
            titre: 'Commerces',
            description: 'Supermarchés, marchés et centres commerciaux à proximité'
          },
          avantage5: {
            titre: 'Santé',
            description: 'Hôpitaux et centres de santé facilement accessibles'
          },
          avantage6: {
            titre: 'Transport',
            description: 'Réseau de transport public bien desservi'
          }
        },
        accessibiliteSection: {
          title: 'Comment nous rejoindre ?',
          acces1: {
            titre: 'En transport public',
            description: 'Lignes de bus régulières desservant Port-Bouët depuis le Plateau et Treichville. Arrêt à proximité du quartier Abekan Bernard.'
          },
          acces2: {
            titre: 'En voiture',
            description: 'Depuis le Plateau : Direction Port-Bouët via le Boulevard VGE (environ 20 min).'
          },
          acces3: {
            titre: 'Depuis l\'aéroport',
            description: 'À seulement 10 minutes en voiture de l\'aéroport international Félix Houphouët-Boigny. Accès direct et rapide.'
          }
        },
        cta: {
          title: 'Intéressé par ce projet ?',
          description: 'Découvrez nos différentes options d\'achat et les modalités de financement disponibles pour concrétiser votre investissement dans la CITÉ KONGO.',
          buttonText: 'Découvrir les options d\'achat'
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

// @desc    Get all localisation contents (admin)
// @route   GET /api/localisation-content/all
// @access  Admin
exports.getAllLocalisationContents = async (req, res) => {
  try {
    const contents = await LocalisationContent.find().sort({ createdAt: -1 });

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

// @desc    Create new localisation content
// @route   POST /api/localisation-content
// @access  Admin
exports.createLocalisationContent = async (req, res) => {
  try {
    const content = await LocalisationContent.create(req.body);

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

// @desc    Update localisation content
// @route   PUT /api/localisation-content/:id
// @access  Admin
exports.updateLocalisationContent = async (req, res) => {
  try {
    const content = await LocalisationContent.findByIdAndUpdate(
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

// @desc    Delete localisation content
// @route   DELETE /api/localisation-content/:id
// @access  Admin
exports.deleteLocalisationContent = async (req, res) => {
  try {
    const content = await LocalisationContent.findById(req.params.id);

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

// @desc    Activate localisation content
// @route   PUT /api/localisation-content/:id/activate
// @access  Admin
exports.activateLocalisationContent = async (req, res) => {
  try {
    // Désactiver tous les contenus
    await LocalisationContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await LocalisationContent.findByIdAndUpdate(
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
