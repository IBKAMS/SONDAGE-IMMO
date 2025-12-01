const Contenu = require('../models/Contenu');

// @desc    Obtenir tous les contenus d'un projet
// @route   GET /api/contenus
// @access  Public/Private
exports.getContenus = async (req, res) => {
  try {
    const { projet_id, section } = req.query;

    let query = {};
    if (projet_id) query.projet_id = projet_id;
    if (section) query.section = section;
    if (!req.admin) query.actif = true;

    const contenus = await Contenu.find(query)
      .populate('modifie_par', 'nom prenom')
      .sort({ section: 1, ordre: 1 });

    res.json({
      success: true,
      count: contenus.length,
      data: contenus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus'
    });
  }
};

// @desc    Obtenir les contenus par section (public)
// @route   GET /api/contenus/public/:projetId/section/:section
// @access  Public
exports.getContenusBySection = async (req, res) => {
  try {
    const { projetId, section } = req.params;

    const contenus = await Contenu.find({
      projet_id: projetId,
      section: section,
      actif: true
    }).sort({ ordre: 1 });

    // Transformer en objet clé-valeur
    const data = {};
    contenus.forEach(contenu => {
      data[contenu.cle] = contenu.valeur;
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus'
    });
  }
};

// @desc    Obtenir un contenu par ID
// @route   GET /api/contenus/:id
// @access  Private
exports.getContenu = async (req, res) => {
  try {
    const contenu = await Contenu.findById(req.params.id)
      .populate('modifie_par', 'nom prenom')
      .populate('versions.modifie_par', 'nom prenom');

    if (!contenu) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.json({
      success: true,
      data: contenu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu'
    });
  }
};

// @desc    Créer un contenu
// @route   POST /api/contenus
// @access  Private (Admin/Editeur)
exports.createContenu = async (req, res) => {
  try {
    const contenu = await Contenu.create({
      ...req.body,
      modifie_par: req.admin._id
    });

    res.status(201).json({
      success: true,
      message: 'Contenu créé avec succès',
      data: contenu
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ce contenu existe déjà pour cette section'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du contenu',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un contenu
// @route   PUT /api/contenus/:id
// @access  Private (Admin/Editeur)
exports.updateContenu = async (req, res) => {
  try {
    const contenu = await Contenu.findById(req.params.id);

    if (!contenu) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Mise à jour
    Object.assign(contenu, req.body);
    contenu.modifie_par = req.admin._id;

    await contenu.save();

    res.json({
      success: true,
      message: 'Contenu mis à jour avec succès',
      data: contenu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu',
      error: error.message
    });
  }
};

// @desc    Supprimer un contenu
// @route   DELETE /api/contenus/:id
// @access  Private (Admin)
exports.deleteContenu = async (req, res) => {
  try {
    const contenu = await Contenu.findByIdAndDelete(req.params.id);

    if (!contenu) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu'
    });
  }
};

// @desc    Restaurer une version précédente
// @route   PUT /api/contenus/:id/restore/:versionIndex
// @access  Private (Admin)
exports.restoreVersion = async (req, res) => {
  try {
    const contenu = await Contenu.findById(req.params.id);

    if (!contenu) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    const versionIndex = parseInt(req.params.versionIndex);

    if (versionIndex < 0 || versionIndex >= contenu.versions.length) {
      return res.status(400).json({
        success: false,
        message: 'Version invalide'
      });
    }

    // Restaurer la version
    contenu.valeur = contenu.versions[versionIndex].valeur;
    contenu.modifie_par = req.admin._id;

    await contenu.save();

    res.json({
      success: true,
      message: 'Version restaurée avec succès',
      data: contenu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la restauration de la version'
    });
  }
};
