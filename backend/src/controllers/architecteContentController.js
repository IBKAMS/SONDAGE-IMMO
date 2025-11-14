const ArchitecteContent = require('../models/ArchitecteContent');

// @desc    Get active architecte content (public)
// @route   GET /api/architecte-content
// @access  Public
exports.getArchitecteContent = async (req, res) => {
  try {
    let content = await ArchitecteContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer un contenu par défaut
    if (!content) {
      content = await ArchitecteContent.create({
        hero: {
          title: 'ARCHITECTES 21',
          subtitle: 'Excellence architecturale depuis 2015'
        },
        presentation: {
          title: 'Notre Agence',
          paragraph1: 'Notre agence a été fondée en 2015 par Ahissan Louis-Habib TANOH, architecte DESA.',
          paragraph2: 'Il dirige une équipe pluridisciplinaire qui se compose d\'architectes, d\'architectes d\'intérieur, d\'urbanistes, d\'ingénieurs, d\'économistes en bâtiments, de techniciens, de juristes, de communicants et d\'artisans.',
          paragraph3: 'Cet aspect pluridisciplinaire permet de gérer tout type de projet.'
        },
        videoSection: {
          title: 'Découvrez ARCHITECTES 21 en vidéo',
          subtitle: 'Notre vision, nos réalisations et notre approche architecturale',
          overlayText: 'Découvrir notre univers'
        },
        equipeSection: {
          title: 'Notre Équipe Pluridisciplinaire',
          membres: [
            { metier: 'Architectes', order: 1 },
            { metier: 'Architectes d\'intérieur', order: 2 },
            { metier: 'Urbanistes', order: 3 },
            { metier: 'Ingénieurs', order: 4 },
            { metier: 'Économistes en bâtiments', order: 5 },
            { metier: 'Techniciens', order: 6 },
            { metier: 'Juristes', order: 7 },
            { metier: 'Communicants', order: 8 },
            { metier: 'Artisans', order: 9 }
          ]
        },
        valeursSection: {
          title: 'Nos Engagements',
          valeurs: [
            {
              titre: 'Expertise Technique',
              description: 'Une équipe pluridisciplinaire maîtrisant tous les aspects du bâtiment',
              order: 1
            },
            {
              titre: 'Jeunesse & Dynamisme',
              description: 'Une équipe jeune et dynamique qui capitalise son expertise',
              order: 2
            },
            {
              titre: 'Précision',
              description: 'Le devoir d\'atteindre la précision dans chacune de nos réalisations',
              order: 3
            }
          ]
        },
        engagement: {
          paragraph1: 'Tout en restant fidèle à la commande initiale, l\'agence se doit d\'assurer le suivi architectural et administratif en vue d\'une prestation conforme aux intérêts du client.',
          paragraph2: 'Nous valorisons et capitalisons notre expertise à travers une équipe jeune et dynamique. Nous insufflons en chaque collaborateur, le devoir d\'atteindre la précision dans chacune de nos réalisations, par l\'emploi d\'un processus participatif.'
        },
        architecteChef: {
          title: 'Architecte en Chef',
          nom: 'Ahissan Louis-Habib TANOH',
          titre: 'Architecte DESA',
          description: 'Fondateur d\'ARCHITECTES 21 en 2015, Louis-Habib TANOH dirige avec excellence une équipe pluridisciplinaire dédiée à la réalisation de projets d\'envergure à travers la Côte d\'Ivoire.'
        },
        contact: {
          title: 'Contactez ARCHITECTES 21',
          subtitle: 'Pour vos projets architecturaux et d\'urbanisme',
          adresse1: '46 Rue du Commerce, Immeuble L\'Ebrien, Etage 5B',
          adresse2: 'Plateau, Abidjan',
          adresse3: '10 BP 2877',
          telephone1: '+225 27 20 23 09 55',
          telephone2: '+225 07 78 46 52 88',
          email: 'info@architectes21s.com',
          siteWeb: 'http://www.architectes21s.com'
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

// @desc    Get all architecte contents (admin)
// @route   GET /api/architecte-content/all
// @access  Admin
exports.getAllArchitecteContents = async (req, res) => {
  try {
    const contents = await ArchitecteContent.find().sort({ createdAt: -1 });

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

// @desc    Create new architecte content
// @route   POST /api/architecte-content
// @access  Admin
exports.createArchitecteContent = async (req, res) => {
  try {
    const content = await ArchitecteContent.create(req.body);

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

// @desc    Update architecte content
// @route   PUT /api/architecte-content/:id
// @access  Admin
exports.updateArchitecteContent = async (req, res) => {
  try {
    const content = await ArchitecteContent.findByIdAndUpdate(
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

// @desc    Delete architecte content
// @route   DELETE /api/architecte-content/:id
// @access  Admin
exports.deleteArchitecteContent = async (req, res) => {
  try {
    const content = await ArchitecteContent.findById(req.params.id);

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

// @desc    Activate architecte content
// @route   PUT /api/architecte-content/:id/activate
// @access  Admin
exports.activateArchitecteContent = async (req, res) => {
  try {
    // Désactiver tous les contenus
    await ArchitecteContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await ArchitecteContent.findByIdAndUpdate(
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
