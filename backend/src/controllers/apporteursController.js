const ApporteurAffaires = require('../models/ApporteurAffaires');
const Questionnaire = require('../models/Questionnaire');

// @desc    Obtenir tous les apporteurs d'affaires
// @route   GET /api/apporteurs
// @access  Private (Admin)
exports.getApporteurs = async (req, res) => {
  try {
    const { search, actif, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    // Construire le filtre
    const filter = {};

    if (actif !== undefined) {
      filter.actif = actif === 'true';
    }

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { pays: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Exécuter la requête
    const [apporteurs, total] = await Promise.all([
      ApporteurAffaires.find(filter)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      ApporteurAffaires.countDocuments(filter)
    ]);

    // Statistiques globales
    const stats = await ApporteurAffaires.aggregate([
      {
        $group: {
          _id: null,
          totalApporteurs: { $sum: 1 },
          actifs: { $sum: { $cond: ['$actif', 1, 0] } },
          totalProspects: { $sum: '$statistiques.prospectsReferes' },
          totalConversions: { $sum: '$statistiques.conversions' },
          totalCommissionsPayees: { $sum: '$statistiques.commissionsGagnees' },
          totalCommissionsEnAttente: { $sum: '$statistiques.commissionsEnAttente' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: apporteurs.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      stats: stats[0] || {
        totalApporteurs: 0,
        actifs: 0,
        totalProspects: 0,
        totalConversions: 0,
        totalCommissionsPayees: 0,
        totalCommissionsEnAttente: 0
      },
      data: apporteurs
    });
  } catch (error) {
    console.error('Erreur getApporteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des apporteurs',
      error: error.message
    });
  }
};

// @desc    Obtenir un apporteur par ID
// @route   GET /api/apporteurs/:id
// @access  Private (Admin)
exports.getApporteur = async (req, res) => {
  try {
    const apporteur = await ApporteurAffaires.findById(req.params.id).select('-password');

    if (!apporteur) {
      return res.status(404).json({
        success: false,
        message: 'Apporteur non trouvé'
      });
    }

    // Récupérer les prospects associés
    const prospects = await Questionnaire.find({ apporteur_id: apporteur._id })
      .select('nom prenom email telephone numeroDossier statut qualification score_interet commission createdAt')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: apporteur,
      recentProspects: prospects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'apporteur',
      error: error.message
    });
  }
};

// @desc    Créer un nouvel apporteur d'affaires
// @route   POST /api/apporteurs
// @access  Private (Admin)
exports.createApporteur = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, pays, password, tauxCommission } = req.body;

    // Validation
    if (!nom || !prenom || !email || !telephone || !pays || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await ApporteurAffaires.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Un apporteur avec cet email existe déjà'
      });
    }

    // Vérifier si le téléphone existe déjà
    const existingTelephone = await ApporteurAffaires.findOne({ telephone });
    if (existingTelephone) {
      return res.status(400).json({
        success: false,
        message: 'Un apporteur avec ce numéro de téléphone existe déjà'
      });
    }

    // Générer un code unique
    const code = await ApporteurAffaires.generateUniqueCode();

    // Créer l'apporteur avec le mot de passe initial stocké en clair pour l'admin
    const apporteur = await ApporteurAffaires.create({
      code,
      nom,
      prenom,
      email,
      telephone,
      pays,
      password,
      motDePasseInitial: password, // Stocké en clair pour que l'admin puisse le voir
      motDePasseModifie: false,
      tauxCommission: tauxCommission || 2
    });

    res.status(201).json({
      success: true,
      message: 'Apporteur créé avec succès',
      data: {
        id: apporteur._id,
        code: apporteur.code,
        nom: apporteur.nom,
        prenom: apporteur.prenom,
        email: apporteur.email,
        telephone: apporteur.telephone,
        pays: apporteur.pays,
        tauxCommission: apporteur.tauxCommission,
        actif: apporteur.actif,
        motDePasseInitial: apporteur.motDePasseInitial,
        motDePasseModifie: apporteur.motDePasseModifie
      }
    });
  } catch (error) {
    console.error('Erreur createApporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'apporteur',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un apporteur
// @route   PUT /api/apporteurs/:id
// @access  Private (Admin)
exports.updateApporteur = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, pays, tauxCommission, actif, notes, password } = req.body;

    const apporteur = await ApporteurAffaires.findById(req.params.id);

    if (!apporteur) {
      return res.status(404).json({
        success: false,
        message: 'Apporteur non trouvé'
      });
    }

    // Vérifier si le nouvel email existe déjà (si changement d'email)
    if (email && email !== apporteur.email) {
      const existingApporteur = await ApporteurAffaires.findOne({ email });
      if (existingApporteur) {
        return res.status(400).json({
          success: false,
          message: 'Un apporteur avec cet email existe déjà'
        });
      }
    }

    // Vérifier si le nouveau téléphone existe déjà (si changement de téléphone)
    if (telephone && telephone !== apporteur.telephone) {
      const existingTelephone = await ApporteurAffaires.findOne({ telephone });
      if (existingTelephone) {
        return res.status(400).json({
          success: false,
          message: 'Un apporteur avec ce numéro de téléphone existe déjà'
        });
      }
    }

    // Mise à jour des champs
    if (nom) apporteur.nom = nom;
    if (prenom) apporteur.prenom = prenom;
    if (email) apporteur.email = email;
    if (telephone) apporteur.telephone = telephone;
    if (pays) apporteur.pays = pays;
    if (tauxCommission !== undefined) apporteur.tauxCommission = tauxCommission;
    if (actif !== undefined) apporteur.actif = actif;
    if (notes !== undefined) apporteur.notes = notes;
    if (password) {
      apporteur.password = password;
      apporteur.motDePasseInitial = password; // Stocker en clair pour l'admin
    }

    await apporteur.save();

    res.status(200).json({
      success: true,
      message: 'Apporteur mis à jour avec succès',
      data: {
        id: apporteur._id,
        code: apporteur.code,
        nom: apporteur.nom,
        prenom: apporteur.prenom,
        email: apporteur.email,
        telephone: apporteur.telephone,
        pays: apporteur.pays,
        tauxCommission: apporteur.tauxCommission,
        actif: apporteur.actif,
        notes: apporteur.notes,
        motDePasseInitial: apporteur.motDePasseInitial,
        motDePasseModifie: apporteur.motDePasseModifie
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'apporteur',
      error: error.message
    });
  }
};

// @desc    Supprimer un apporteur
// @route   DELETE /api/apporteurs/:id
// @access  Private (Admin)
exports.deleteApporteur = async (req, res) => {
  try {
    const apporteur = await ApporteurAffaires.findById(req.params.id);

    if (!apporteur) {
      return res.status(404).json({
        success: false,
        message: 'Apporteur non trouvé'
      });
    }

    // Vérifier s'il y a des prospects liés
    const prospectsCount = await Questionnaire.countDocuments({ apporteur_id: apporteur._id });

    if (prospectsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cet apporteur car il a ${prospectsCount} prospect(s) lié(s). Désactivez-le plutôt.`
      });
    }

    await apporteur.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Apporteur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'apporteur',
      error: error.message
    });
  }
};

// @desc    Régénérer le code d'un apporteur
// @route   POST /api/apporteurs/:id/regenerate-code
// @access  Private (Admin)
exports.regenerateCode = async (req, res) => {
  try {
    const apporteur = await ApporteurAffaires.findById(req.params.id);

    if (!apporteur) {
      return res.status(404).json({
        success: false,
        message: 'Apporteur non trouvé'
      });
    }

    // Générer un nouveau code unique
    const newCode = await ApporteurAffaires.generateUniqueCode();
    const oldCode = apporteur.code;

    apporteur.code = newCode;
    await apporteur.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Code régénéré avec succès',
      data: {
        oldCode,
        newCode
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la régénération du code',
      error: error.message
    });
  }
};

// @desc    Obtenir les prospects d'un apporteur
// @route   GET /api/apporteurs/:id/prospects
// @access  Private (Admin)
exports.getProspects = async (req, res) => {
  try {
    const { page = 1, limit = 20, statut, qualification } = req.query;

    const apporteur = await ApporteurAffaires.findById(req.params.id);

    if (!apporteur) {
      return res.status(404).json({
        success: false,
        message: 'Apporteur non trouvé'
      });
    }

    // Construire le filtre
    const filter = { apporteur_id: apporteur._id };
    if (statut) filter.statut = statut;
    if (qualification) filter.qualification = qualification;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [prospects, total] = await Promise.all([
      Questionnaire.find(filter)
        .select('nom prenom email telephone numeroDossier statut qualification score_interet commission budget.globalBudget createdAt')
        .populate('logement_id', 'nom prix')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Questionnaire.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: prospects.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      apporteur: {
        code: apporteur.code,
        nom: apporteur.nom,
        prenom: apporteur.prenom
      },
      data: prospects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des prospects',
      error: error.message
    });
  }
};

// @desc    Exporter les apporteurs (format simplifié)
// @route   GET /api/apporteurs/export
// @access  Private (Admin)
exports.exportApporteurs = async (req, res) => {
  try {
    const apporteurs = await ApporteurAffaires.find()
      .select('-password')
      .sort('-createdAt');

    // Formater les données pour l'export
    const exportData = apporteurs.map(a => ({
      code: a.code,
      nom: a.nom,
      prenom: a.prenom,
      email: a.email,
      telephone: a.telephone,
      pays: a.pays,
      tauxCommission: a.tauxCommission,
      actif: a.actif ? 'Oui' : 'Non',
      prospectsReferes: a.statistiques.prospectsReferes,
      conversions: a.statistiques.conversions,
      tauxConversion: a.statistiques.prospectsReferes > 0
        ? ((a.statistiques.conversions / a.statistiques.prospectsReferes) * 100).toFixed(2) + '%'
        : '0%',
      commissionsGagnees: a.statistiques.commissionsGagnees,
      commissionsEnAttente: a.statistiques.commissionsEnAttente,
      dateCreation: a.createdAt
    }));

    res.status(200).json({
      success: true,
      count: exportData.length,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des apporteurs',
      error: error.message
    });
  }
};

// @desc    Valider un code apporteur (pour le frontend user)
// @route   POST /api/apporteurs/validate-code
// @access  Public
exports.validateCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Code requis'
      });
    }

    const result = await ApporteurAffaires.validateCode(code);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      valid: false,
      message: 'Erreur lors de la validation du code',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le statut d'une commission
// @route   PUT /api/apporteurs/commission/:questionnaireId
// @access  Private (Admin)
exports.updateCommissionStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const { questionnaireId } = req.params;

    const questionnaire = await Questionnaire.findById(questionnaireId).populate('apporteur_id');

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire non trouvé'
      });
    }

    if (!questionnaire.apporteur_id) {
      return res.status(400).json({
        success: false,
        message: 'Ce questionnaire n\'est pas lié à un apporteur'
      });
    }

    const oldStatut = questionnaire.commission.statut;
    questionnaire.commission.statut = statut;

    if (statut === 'payee') {
      questionnaire.commission.datePaiement = new Date();

      // Mettre à jour les statistiques de l'apporteur
      const apporteur = await ApporteurAffaires.findById(questionnaire.apporteur_id._id);
      if (apporteur && oldStatut !== 'payee') {
        apporteur.statistiques.commissionsEnAttente -= questionnaire.commission.montant;
        apporteur.statistiques.commissionsGagnees += questionnaire.commission.montant;
        await apporteur.save();
      }
    }

    await questionnaire.save();

    res.status(200).json({
      success: true,
      message: 'Statut de la commission mis à jour',
      data: questionnaire.commission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut de la commission',
      error: error.message
    });
  }
};
