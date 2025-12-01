const Questionnaire = require('../models/Questionnaire');

// @desc    Soumettre un questionnaire (public)
// @route   POST /api/questionnaires/submit
// @access  Public
exports.submitQuestionnaire = async (req, res) => {
  try {
    const { nom, prenom, email, telephone } = req.body;

    // Vérifier si un questionnaire existe déjà avec les mêmes informations
    // Condition: (nom + prénom) ET (email OU telephone)
    const existingQuestionnaire = await Questionnaire.findOne({
      $and: [
        { nom: nom },
        { prenom: prenom },
        {
          $or: [
            { email: email },
            { telephone: telephone }
          ]
        }
      ]
    });

    if (existingQuestionnaire) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà rempli ce questionnaire. Merci pour votre intérêt !',
        duplicate: true
      });
    }

    const questionnaire = await Questionnaire.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Questionnaire soumis avec succès',
      data: {
        id: questionnaire._id,
        score_interet: questionnaire.score_interet,
        qualification: questionnaire.qualification
      }
    });
  } catch (error) {
    console.error('Erreur soumission questionnaire:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la soumission du questionnaire',
      error: error.message
    });
  }
};

// @desc    Obtenir tous les questionnaires avec filtres
// @route   GET /api/questionnaires
// @access  Private
exports.getQuestionnaires = async (req, res) => {
  try {
    const {
      projet_id,
      statut,
      qualification,
      search,
      page = 1,
      limit = 20,
      sort = '-date_soumission'
    } = req.query;

    // Construction de la requête
    let query = {};

    if (projet_id) query.projet_id = projet_id;
    if (statut) query.statut = statut;
    if (qualification) query.qualification = qualification;

    // Recherche par nom, email ou téléphone
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const questionnaires = await Questionnaire.find(query)
      .populate('projet_id', 'nom slug')
      .populate('logement_id', 'reference type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Questionnaire.countDocuments(query);

    res.json({
      success: true,
      data: questionnaires,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des questionnaires'
    });
  }
};

// @desc    Obtenir un questionnaire par ID
// @route   GET /api/questionnaires/:id
// @access  Private
exports.getQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id)
      .populate('projet_id')
      .populate('logement_id')
      .populate('notes.auteur', 'nom prenom');

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    res.json({
      success: true,
      data: questionnaire
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du questionnaire'
    });
  }
};

// @desc    Mettre à jour un questionnaire
// @route   PUT /api/questionnaires/:id
// @access  Private
exports.updateQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Questionnaire mis à jour',
      data: questionnaire
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
};

// @desc    Supprimer un questionnaire
// @route   DELETE /api/questionnaires/:id
// @access  Private
exports.deleteQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Questionnaire supprimé'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
};

// @desc    Ajouter une note
// @route   POST /api/questionnaires/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    questionnaire.notes.push({
      auteur: req.admin._id,
      contenu: req.body.contenu
    });

    await questionnaire.save();

    res.json({
      success: true,
      message: 'Note ajoutée',
      data: questionnaire
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la note'
    });
  }
};

// @desc    Mettre à jour le statut
// @route   PUT /api/questionnaires/:id/statut
// @access  Private
exports.updateStatut = async (req, res) => {
  try {
    const { statut, qualification } = req.body;

    const questionnaire = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      { statut, ...(qualification && { qualification }) },
      { new: true }
    );

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour',
      data: questionnaire
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};
