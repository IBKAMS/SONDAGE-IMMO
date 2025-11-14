const PromoteurContent = require('../models/PromoteurContent');

// @desc    Get active promoteur content (public)
// @route   GET /api/promoteur-content
// @access  Public
exports.getPromoteurContent = async (req, res) => {
  try {
    let content = await PromoteurContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer un contenu par défaut
    if (!content) {
      content = await PromoteurContent.create({
        hero: {
          title: 'KONGO IMMOBILIER',
          subtitle: 'Le partenaire de confiance pour votre projet de vie'
        },
        mission: {
          title: 'Notre Mission',
          leadParagraph: 'Dans le paysage dynamique d\'Abidjan, KONGO IMMOBILIER se distingue par sa vision et la qualité de ses réalisations.',
          highlightParagraph: 'Notre mission est simple : bâtir plus que des murs, créer des cadres de vie où chaque Ivoirien peut s\'épanouir.',
          descriptionParagraph: 'Nous ne nous contentons pas de construire des bâtiments, nous bâtissons votre avenir. Chaque projet est conçu avec soin pour offrir un environnement de vie harmonieux, moderne et accessible.'
        },
        videoSection: {
          title: 'Découvrez KONGO IMMOBILIER en vidéo',
          subtitle: 'Notre vision, nos projets et notre engagement envers vous',
          overlayText: 'Découvrir notre histoire'
        },
        stats: [
          { value: 4, label: 'Projets Réalisés', order: 1 },
          { value: 200, label: 'Logements Livrés', order: 2 },
          { value: 150, label: 'Clients Satisfaits', order: 3 },
          { value: 10, label: 'Années d\'Expérience', order: 4 }
        ],
        valeurs: [
          { titre: 'Qualité & Excellence', description: 'Des constructions répondant aux normes les plus strictes', order: 1 },
          { titre: 'Accessibilité', description: 'Logements pour tous, adaptés à chaque budget', order: 2 },
          { titre: 'Cadre de vie', description: 'Des environnements pensés pour l\'épanouissement', order: 3 },
          { titre: 'Engagement', description: 'Un partenaire de confiance pour votre projet de vie', order: 4 }
        ],
        projetsSection: {
          title: 'Nos Projets Emblématiques',
          subtitle: 'Notre expertise s\'illustre à travers plusieurs réalisations qui ont transformé le quotidien de nombreux habitants',
          projets: [
            {
              nom: 'Résidence 3K',
              localisation: 'Marcory',
              description: 'Immeuble moderne de 4 étages offrant une mixité parfaite',
              caracteristiques: ['8 locaux commerciaux', '16 studios', '12 appartements (2, 3 et 4 pièces)'],
              order: 1
            },
            {
              nom: 'Résidence Ciel & Jardin',
              localisation: 'Zone 4',
              partenariat: 'En partenariat avec la SCI MALKO',
              description: 'Prestigieux complexe de 7 étages avec sous-sol offrant un standing élevé',
              caracteristiques: ['6 studios', '18 appartements de 2 pièces', '24 appartements de 3 pièces', '12 appartements de 4 pièces'],
              order: 2
            },
            {
              nom: 'MIENSAH CITÉ LUMIÈRE',
              localisation: 'Port-Bouët',
              partenariat: 'En partenariat avec Pierre Ivoire Immobilier',
              description: 'Projet d\'envergure conçu comme une véritable petite ville intégrée',
              caracteristiques: ['116 logements (villas individuelles et jumelées)', 'Villas de 2, 3 et 4 pièces', 'École primaire intégrée', 'Voies bitumées', 'Terrain de sport', 'Espaces verts aménagés', 'Supérette', 'Services de gardiennage et de syndic'],
              order: 3
            }
          ]
        },
        nouveauProjet: {
          sectionTitle: 'Notre Nouveau Projet',
          nom: 'La Cité KONGO',
          localisation: 'Port-Bouët, quartier ABEKAN-BERNARD',
          description: 'Forts de nos succès, nous sommes aujourd\'hui fiers de vous annoncer le lancement de la Cité KONGO. Idéalement située dans la commune de Port-Bouët, au cœur du quartier ABEKAN-BERNARD, la Cité KONGO incarne notre vision de l\'habitat de demain : accessible, moderne et parfaitement intégré à son environnement.'
        },
        contact: {
          title: 'Contactez KONGO IMMOBILIER',
          description: 'Nous sommes à votre écoute pour réaliser votre projet immobilier',
          telephone: '+225 XX XX XX XX XX',
          email: 'contact@kongoimmobilier.ci',
          adresse: 'Abidjan, Côte d\'Ivoire'
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

// @desc    Get all promoteur contents (admin)
// @route   GET /api/promoteur-content/all
// @access  Admin
exports.getAllPromoteurContents = async (req, res) => {
  try {
    const contents = await PromoteurContent.find().sort({ createdAt: -1 });

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

// @desc    Create new promoteur content
// @route   POST /api/promoteur-content
// @access  Admin
exports.createPromoteurContent = async (req, res) => {
  try {
    const content = await PromoteurContent.create(req.body);

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

// @desc    Update promoteur content
// @route   PUT /api/promoteur-content/:id
// @access  Admin
exports.updatePromoteurContent = async (req, res) => {
  try {
    const content = await PromoteurContent.findByIdAndUpdate(
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

// @desc    Delete promoteur content
// @route   DELETE /api/promoteur-content/:id
// @access  Admin
exports.deletePromoteurContent = async (req, res) => {
  try {
    const content = await PromoteurContent.findById(req.params.id);

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

// @desc    Activate promoteur content
// @route   PUT /api/promoteur-content/:id/activate
// @access  Admin
exports.activatePromoteurContent = async (req, res) => {
  try {
    // Désactiver tous les contenus
    await PromoteurContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await PromoteurContent.findByIdAndUpdate(
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
