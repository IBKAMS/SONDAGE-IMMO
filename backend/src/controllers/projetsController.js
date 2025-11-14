const Projet = require('../models/Projet');
const Logement = require('../models/Logement');

// @desc    Obtenir tous les projets
// @route   GET /api/projets
// @access  Public/Private
exports.getProjets = async (req, res) => {
  try {
    const query = req.admin ? {} : { actif: true };

    const projets = await Projet.find(query)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projets.length,
      data: projets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets'
    });
  }
};

// @desc    Obtenir un projet par ID
// @route   GET /api/projets/:id
// @access  Private
exports.getProjet = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    // Récupérer les logements associés
    const logements = await Logement.find({ projet_id: projet._id, actif: true });

    res.json({
      success: true,
      data: {
        projet,
        logements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet'
    });
  }
};

// @desc    Obtenir un projet par slug (public)
// @route   GET /api/projets/public/:slug
// @access  Public
exports.getProjetPublic = async (req, res) => {
  try {
    const projet = await Projet.findOne({
      slug: req.params.slug,
      actif: true
    });

    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    // Récupérer les logements associés
    const logements = await Logement.find({
      projet_id: projet._id,
      actif: true
    }).sort({ type: 1, prix: 1 });

    res.json({
      success: true,
      data: {
        projet,
        logements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet'
    });
  }
};

// @desc    Créer un projet
// @route   POST /api/projets
// @access  Private (Admin)
exports.createProjet = async (req, res) => {
  try {
    const projet = await Projet.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      data: projet
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un projet avec ce slug existe déjà'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un projet
// @route   PUT /api/projets/:id
// @access  Private (Admin/Editeur)
exports.updateProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Projet mis à jour avec succès',
      data: projet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du projet',
      error: error.message
    });
  }
};

// @desc    Supprimer un projet
// @route   DELETE /api/projets/:id
// @access  Private (Admin)
exports.deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);

    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    // Supprimer aussi les logements associés
    await Logement.deleteMany({ projet_id: projet._id });

    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du projet'
    });
  }
};
