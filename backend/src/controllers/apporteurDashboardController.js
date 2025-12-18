const ApporteurAffaires = require('../models/ApporteurAffaires');
const Questionnaire = require('../models/Questionnaire');
const Logement = require('../models/Logement');

// @desc    Obtenir les statistiques du dashboard apporteur
// @route   GET /api/apporteur/dashboard/stats
// @access  Private (Apporteur)
exports.getDashboardStats = async (req, res) => {
  try {
    const apporteurId = req.apporteur.id;

    // Récupérer l'apporteur avec ses stats
    const apporteur = await ApporteurAffaires.findById(apporteurId);

    // Récupérer les statistiques détaillées des prospects
    const prospectStats = await Questionnaire.aggregate([
      { $match: { apporteur_id: apporteur._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          nouveaux: { $sum: { $cond: [{ $eq: ['$statut', 'nouveau'] }, 1, 0] } },
          enCours: { $sum: { $cond: [{ $eq: ['$statut', 'en_cours'] }, 1, 0] } },
          contactes: { $sum: { $cond: [{ $eq: ['$statut', 'contacté'] }, 1, 0] } },
          visites: { $sum: { $cond: [{ $eq: ['$statut', 'visité'] }, 1, 0] } },
          convertis: { $sum: { $cond: [{ $eq: ['$statut', 'converti'] }, 1, 0] } },
          perdus: { $sum: { $cond: [{ $eq: ['$statut', 'perdu'] }, 1, 0] } },
          chauds: { $sum: { $cond: [{ $eq: ['$qualification', 'chaud'] }, 1, 0] } },
          tiedes: { $sum: { $cond: [{ $eq: ['$qualification', 'tiède'] }, 1, 0] } },
          froids: { $sum: { $cond: [{ $eq: ['$qualification', 'froid'] }, 1, 0] } }
        }
      }
    ]);

    // Statistiques des commissions
    const commissionStats = await Questionnaire.aggregate([
      { $match: { apporteur_id: apporteur._id } },
      {
        $group: {
          _id: '$commission.statut',
          count: { $sum: 1 },
          total: { $sum: '$commission.montant' }
        }
      }
    ]);

    // Convertir en objet plus lisible
    const commissions = {
      nonApplicable: { count: 0, total: 0 },
      enAttente: { count: 0, total: 0 },
      validees: { count: 0, total: 0 },
      payees: { count: 0, total: 0 }
    };

    commissionStats.forEach(stat => {
      switch (stat._id) {
        case 'non_applicable':
          commissions.nonApplicable = { count: stat.count, total: stat.total };
          break;
        case 'en_attente':
          commissions.enAttente = { count: stat.count, total: stat.total };
          break;
        case 'validee':
          commissions.validees = { count: stat.count, total: stat.total };
          break;
        case 'payee':
          commissions.payees = { count: stat.count, total: stat.total };
          break;
      }
    });

    // Prospects récents (5 derniers)
    const recentProspects = await Questionnaire.find({ apporteur_id: apporteurId })
      .select('nom prenom numeroDossier statut qualification score_interet createdAt')
      .sort('-createdAt')
      .limit(5);

    // Évolution mensuelle (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEvolution = await Questionnaire.aggregate([
      {
        $match: {
          apporteur_id: apporteur._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          prospects: { $sum: 1 },
          conversions: { $sum: { $cond: [{ $eq: ['$statut', 'converti'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        apporteur: {
          code: apporteur.code,
          nom: apporteur.nom,
          prenom: apporteur.prenom,
          tauxCommission: apporteur.tauxCommission
        },
        statistiques: apporteur.statistiques,
        prospectStats: prospectStats[0] || {
          total: 0,
          nouveaux: 0,
          enCours: 0,
          contactes: 0,
          visites: 0,
          convertis: 0,
          perdus: 0,
          chauds: 0,
          tiedes: 0,
          froids: 0
        },
        commissions,
        recentProspects,
        monthlyEvolution
      }
    });
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// @desc    Obtenir les prospects de l'apporteur
// @route   GET /api/apporteur/dashboard/prospects
// @access  Private (Apporteur)
exports.getMyProspects = async (req, res) => {
  try {
    const apporteurId = req.apporteur.id;
    const { page = 1, limit = 20, statut, qualification, search, sort = '-createdAt' } = req.query;

    // Construire le filtre
    const filter = { apporteur_id: apporteurId };

    if (statut) filter.statut = statut;
    if (qualification) filter.qualification = qualification;

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } },
        { numeroDossier: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [prospects, total] = await Promise.all([
      Questionnaire.find(filter)
        .select('nom prenom email telephone numeroDossier statut qualification score_interet commission budget.globalBudget preferences.propertyType createdAt')
        .populate('logement_id', 'nom prix type')
        .sort(sort)
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

// @desc    Obtenir le détail d'un prospect
// @route   GET /api/apporteur/dashboard/prospects/:id
// @access  Private (Apporteur)
exports.getProspectDetail = async (req, res) => {
  try {
    const apporteurId = req.apporteur.id;

    const prospect = await Questionnaire.findOne({
      _id: req.params.id,
      apporteur_id: apporteurId
    })
      .populate('logement_id', 'nom prix type surface')
      .populate('projet_id', 'nom');

    if (!prospect) {
      return res.status(404).json({
        success: false,
        message: 'Prospect non trouvé ou non autorisé'
      });
    }

    res.status(200).json({
      success: true,
      data: prospect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du prospect',
      error: error.message
    });
  }
};

// @desc    Obtenir l'historique des commissions
// @route   GET /api/apporteur/dashboard/commissions
// @access  Private (Apporteur)
exports.getMyCommissions = async (req, res) => {
  try {
    const apporteurId = req.apporteur.id;
    const { statut, page = 1, limit = 20 } = req.query;

    // Filtre de base - seulement les questionnaires avec commission > 0 ou statut != non_applicable
    const filter = {
      apporteur_id: apporteurId,
      $or: [
        { 'commission.montant': { $gt: 0 } },
        { 'commission.statut': { $ne: 'non_applicable' } }
      ]
    };

    if (statut) {
      filter['commission.statut'] = statut;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [commissions, total] = await Promise.all([
      Questionnaire.find(filter)
        .select('nom prenom numeroDossier statut commission logement_id createdAt')
        .populate('logement_id', 'nom prix type')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Questionnaire.countDocuments(filter)
    ]);

    // Calculer les totaux
    const totals = await Questionnaire.aggregate([
      { $match: { apporteur_id: req.apporteur._id } },
      {
        $group: {
          _id: null,
          totalEnAttente: {
            $sum: {
              $cond: [{ $eq: ['$commission.statut', 'en_attente'] }, '$commission.montant', 0]
            }
          },
          totalValidees: {
            $sum: {
              $cond: [{ $eq: ['$commission.statut', 'validee'] }, '$commission.montant', 0]
            }
          },
          totalPayees: {
            $sum: {
              $cond: [{ $eq: ['$commission.statut', 'payee'] }, '$commission.montant', 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: commissions.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totals: totals[0] || {
        totalEnAttente: 0,
        totalValidees: 0,
        totalPayees: 0
      },
      data: commissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commissions',
      error: error.message
    });
  }
};

// @desc    Obtenir les informations sur les logements disponibles
// @route   GET /api/apporteur/dashboard/logements
// @access  Private (Apporteur)
exports.getLogements = async (req, res) => {
  try {
    const logements = await Logement.find({ isActive: true })
      .select('nom type surface nombrePieces prix description images')
      .sort('type');

    res.status(200).json({
      success: true,
      count: logements.length,
      data: logements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logements',
      error: error.message
    });
  }
};
