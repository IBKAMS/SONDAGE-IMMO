const Questionnaire = require('../models/Questionnaire');
const ApporteurAffaires = require('../models/ApporteurAffaires');

// @desc    Soumettre un questionnaire (public)
// @route   POST /api/questionnaires/submit
// @access  Public
exports.submitQuestionnaire = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, codeApporteur } = req.body;

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

    // Préparer les données du questionnaire
    const questionnaireData = { ...req.body };

    // Traiter le lot sélectionné sur le plan de masse
    if (req.body.lotSelectionne || req.body.lotId) {
      questionnaireData.lotSelectionne = {
        numero: req.body.lotSelectionne || '',
        lotId: req.body.lotId || null,
        type: req.body.lotType || '',
        dateSelection: new Date()
      };
    }

    // Si un code apporteur est fourni, valider et lier à l'apporteur
    if (codeApporteur) {
      const apporteur = await ApporteurAffaires.findOne({
        code: codeApporteur.toUpperCase(),
        actif: true
      });

      if (apporteur) {
        questionnaireData.codeApporteur = codeApporteur.toUpperCase();
        questionnaireData.apporteur_id = apporteur._id;

        // Mettre à jour les statistiques de l'apporteur
        apporteur.statistiques.prospectsReferes += 1;
        await apporteur.save();
      }
    }

    const questionnaire = await Questionnaire.create(questionnaireData);

    res.status(201).json({
      success: true,
      message: 'Questionnaire soumis avec succès',
      data: {
        id: questionnaire._id,
        numeroDossier: questionnaire.numeroDossier,
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

// @desc    Mettre à jour l'étape du dossier
// @route   PUT /api/questionnaires/:id/etape
// @access  Private (Admin)
exports.updateEtapeDossier = async (req, res) => {
  try {
    const { etapeDossier } = req.body;

    const etapesValides = [
      'dossier_cree',
      'contact_etabli',
      'visite_effectuee',
      'reservation',
      'financement_valide',
      'signature_notaire',
      'construction',
      'remise_cles'
    ];

    if (!etapesValides.includes(etapeDossier)) {
      return res.status(400).json({
        success: false,
        message: 'Étape de dossier invalide'
      });
    }

    const questionnaire = await Questionnaire.findById(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    // Ajouter l'étape à l'historique
    questionnaire.historiqueEtapes.push({
      etape: etapeDossier,
      date: new Date(),
      modifiePar: req.admin ? req.admin._id : null
    });

    // Mettre à jour l'étape courante
    questionnaire.etapeDossier = etapeDossier;
    questionnaire.dateEtape = new Date();

    // Si c'est une conversion (réservation ou plus), mettre à jour le statut
    if (['reservation', 'financement_valide', 'signature_notaire', 'construction', 'remise_cles'].includes(etapeDossier)) {
      questionnaire.statut = 'converti';

      // Mettre à jour les stats de l'apporteur si applicable
      if (questionnaire.apporteur_id) {
        const ApporteurAffaires = require('../models/ApporteurAffaires');
        const apporteur = await ApporteurAffaires.findById(questionnaire.apporteur_id);
        if (apporteur && questionnaire.commission.statut === 'non_applicable') {
          apporteur.statistiques.conversions += 1;
          questionnaire.commission.statut = 'en_attente';
          await apporteur.save();
        }
      }
    }

    await questionnaire.save();

    res.json({
      success: true,
      message: 'Étape du dossier mise à jour',
      data: {
        etapeDossier: questionnaire.etapeDossier,
        dateEtape: questionnaire.dateEtape,
        historiqueEtapes: questionnaire.historiqueEtapes
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour étape:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'étape',
      error: error.message
    });
  }
};
