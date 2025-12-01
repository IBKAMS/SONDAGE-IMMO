const Visite3DContent = require('../models/Visite3DContent');

// @desc    Récupérer le contenu actif de la page Visite 3D
// @route   GET /api/visite3d-content
// @access  Public
exports.getVisite3DContent = async (req, res) => {
  try {
    let content = await Visite3DContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer le contenu par défaut
    if (!content) {
      content = await Visite3DContent.create({
        hero: {
          title: 'Visite Virtuelle 3D',
          subtitle: 'Découvrez la Cité KONGO comme si vous y étiez'
        },
        infoBanner: {
          title: 'Explorez votre futur logement en 3D',
          description: 'Visualisez chaque détail du projet immobilier CITÉ KONGO en haute définition'
        },
        videoSection: {
          overlayText: 'Cliquez pour lancer la visite 3D',
          title: 'Visite 3D Complète de la Cité KONGO',
          description: 'Plongez dans l\'univers de la Cité KONGO grâce à cette visite virtuelle immersive. Découvrez les espaces communs, les finitions de qualité et l\'agencement des différents types de villas disponibles.',
          feature1: {
            title: 'Villas Duplex & Triplex',
            description: 'Découvrez nos 3 modèles de villas'
          },
          feature2: {
            title: 'Finitions Premium',
            description: 'Matériaux de qualité supérieure'
          },
          feature3: {
            title: 'Espaces Verts',
            description: 'Jardins et terrasses aménagés'
          }
        },
        infoCards: {
          card1: {
            title: 'Plans Détaillés',
            description: 'Consultez les plans architecturaux de chaque type de villa'
          },
          card2: {
            title: 'Visite Interactive',
            description: 'Naviguez librement dans les espaces en 360°'
          },
          card3: {
            title: 'Qualité HD',
            description: 'Vidéo haute définition pour une expérience immersive'
          }
        },
        cta: {
          title: 'Vous souhaitez visiter en personne ?',
          description: 'Prenez rendez-vous avec notre équipe pour une visite guidée sur site',
          buttonText: 'Prendre rendez-vous'
        },
        messages: {
          loadingText: 'Chargement de la vidéo...',
          errorText: 'Aucune vidéo disponible',
          videoNotSupported: 'Votre navigateur ne supporte pas la lecture de vidéos.'
        },
        isActive: true
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur récupération contenu Visite 3D:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu'
    });
  }
};

// @desc    Récupérer tous les contenus (pour historique/versions)
// @route   GET /api/visite3d-content/all
// @access  Public (À PROTÉGER PLUS TARD)
exports.getAllVisite3DContents = async (req, res) => {
  try {
    const contents = await Visite3DContent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('Erreur récupération tous les contenus Visite 3D:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus'
    });
  }
};

// @desc    Créer un nouveau contenu (version alternative)
// @route   POST /api/visite3d-content
// @access  Public (À PROTÉGER PLUS TARD)
exports.createVisite3DContent = async (req, res) => {
  try {
    const content = await Visite3DContent.create(req.body);

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur création contenu Visite 3D:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du contenu'
    });
  }
};

// @desc    Mettre à jour le contenu de la page Visite 3D
// @route   PUT /api/visite3d-content/:id
// @access  Public (À PROTÉGER PLUS TARD)
exports.updateVisite3DContent = async (req, res) => {
  try {
    const content = await Visite3DContent.findByIdAndUpdate(
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
    console.error('Erreur mise à jour contenu Visite 3D:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu'
    });
  }
};

// @desc    Supprimer un contenu
// @route   DELETE /api/visite3d-content/:id
// @access  Public (À PROTÉGER PLUS TARD)
exports.deleteVisite3DContent = async (req, res) => {
  try {
    const content = await Visite3DContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Ne pas supprimer le contenu actif si c'est le seul
    if (content.isActive) {
      const count = await Visite3DContent.countDocuments();
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
    console.error('Erreur suppression contenu Visite 3D:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu'
    });
  }
};

// @desc    Activer un contenu spécifique
// @route   PUT /api/visite3d-content/:id/activate
// @access  Public (À PROTÉGER PLUS TARD)
exports.activateVisite3DContent = async (req, res) => {
  try {
    // Désactiver tous les autres contenus
    await Visite3DContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await Visite3DContent.findByIdAndUpdate(
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
    console.error('Erreur activation contenu Visite 3D:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'activation du contenu'
    });
  }
};
