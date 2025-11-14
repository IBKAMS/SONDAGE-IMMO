const Questionnaire = require('../models/Questionnaire');

// @desc    Statistiques du dashboard
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const { projet_id } = req.query;
    const query = projet_id ? { projet_id } : {};

    // Total des réponses
    const totalReponses = await Questionnaire.countDocuments(query);

    // Réponses par statut
    const parStatut = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      }
    ]);

    // Réponses par qualification
    const parQualification = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$qualification',
          count: { $sum: 1 }
        }
      }
    ]);

    // Score moyen d'intérêt
    const scoreStats = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          moyenne: { $avg: '$score_interet' },
          min: { $min: '$score_interet' },
          max: { $max: '$score_interet' }
        }
      }
    ]);

    // Évolution par mois (3 derniers mois)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const evolutionMensuelle = await Questionnaire.aggregate([
      {
        $match: {
          ...query,
          date_soumission: { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date_soumission' },
            month: { $month: '$date_soumission' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top 5 sources de connaissance du projet
    const topSources = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$projectKnowledge.howKnown',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        totalReponses,
        parStatut,
        parQualification,
        scoreStats: scoreStats[0] || { moyenne: 0, min: 0, max: 0 },
        evolutionMensuelle,
        topSources
      }
    });
  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// @desc    Statistiques démographiques
// @route   GET /api/analytics/demographics
// @access  Private
exports.getDemographicsStats = async (req, res) => {
  try {
    const { projet_id } = req.query;
    const query = projet_id ? { projet_id } : {};

    // Par genre
    const parGenre = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$demographics.gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Par âge (tranches)
    const parAge = await Questionnaire.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$demographics.age',
          boundaries: [18, 25, 35, 45, 55, 65, 100],
          default: 'Autre',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Par CSP
    const parCSP = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$demographics.csp',
          count: { $sum: 1 }
        }
      }
    ]);

    // Par situation familiale
    const parSituationFamiliale = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$demographics.familyStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Par revenus mensuels
    const parRevenus = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$demographics.monthlyIncome',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        parGenre,
        parAge,
        parCSP,
        parSituationFamiliale,
        parRevenus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques démographiques'
    });
  }
};

// @desc    Statistiques budget
// @route   GET /api/analytics/budget
// @access  Private
exports.getBudgetStats = async (req, res) => {
  try {
    const { projet_id } = req.query;
    const query = projet_id ? { projet_id } : {};

    // Stats budget global
    const budgetGlobalStats = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          moyenne: { $avg: '$budget.globalBudget' },
          min: { $min: '$budget.globalBudget' },
          max: { $max: '$budget.globalBudget' },
          median: { $median: { input: '$budget.globalBudget', method: 'approximate' } }
        }
      }
    ]);

    // Répartition par tranches de budget
    const parTrancheBudget = await Questionnaire.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$budget.globalBudget',
          boundaries: [0, 10000000, 20000000, 30000000, 50000000, 100000000, 200000000],
          default: 'Plus de 200M',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Capacité mensuelle
    const capaciteMensuelleStats = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          moyenne: { $avg: '$budget.monthlyCapacity' },
          min: { $min: '$budget.monthlyCapacity' },
          max: { $max: '$budget.monthlyCapacity' }
        }
      }
    ]);

    // Mode de financement
    const parModeFinancement = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$budget.financingMode',
          count: { $sum: 1 }
        }
      }
    ]);

    // Apport disponible stats
    const apportStats = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          moyenne: { $avg: '$budget.downPaymentAvailable' },
          total: { $sum: '$budget.downPaymentAvailable' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        budgetGlobalStats: budgetGlobalStats[0] || {},
        parTrancheBudget,
        capaciteMensuelleStats: capaciteMensuelleStats[0] || {},
        parModeFinancement,
        apportStats: apportStats[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques budget'
    });
  }
};

// @desc    Statistiques préférences
// @route   GET /api/analytics/preferences
// @access  Private
exports.getPreferencesStats = async (req, res) => {
  try {
    const { projet_id } = req.query;
    const query = projet_id ? { projet_id } : {};

    // Type de bien souhaité
    const parTypeBien = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$preferences.propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Nombre de pièces souhaitées
    const parNombrePieces = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$preferences.roomsDesired',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Critères moyens d'importance
    const criteresImportance = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          security: { $avg: '$criteria.security' },
          quality: { $avg: '$criteria.quality' },
          accessibility: { $avg: '$criteria.accessibility' },
          greenSpaces: { $avg: '$criteria.greenSpaces' },
          services: { $avg: '$criteria.services' },
          quietness: { $avg: '$criteria.quietness' },
          investment: { $avg: '$criteria.investment' },
          modernity: { $avg: '$criteria.modernity' },
          proximity: { $avg: '$criteria.proximity' },
          standing: { $avg: '$criteria.standing' }
        }
      }
    ]);

    // Zones préférées (dépliage du tableau)
    const zonesPreferees = await Questionnaire.aggregate([
      { $match: query },
      { $unwind: '$location.preferredZones' },
      {
        $group: {
          _id: '$location.preferredZones',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        parTypeBien,
        parNombrePieces,
        criteresImportance: criteresImportance[0] || {},
        zonesPreferees
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques préférences'
    });
  }
};

// @desc    Statistiques timeline/motivations
// @route   GET /api/analytics/timeline
// @access  Private
exports.getTimelineStats = async (req, res) => {
  try {
    const { projet_id } = req.query;
    const query = projet_id ? { projet_id } : {};

    // Délai projet
    const parTimeline = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$motivations.timeline',
          count: { $sum: 1 }
        }
      }
    ]);

    // Raison d'achat
    const parRaisonAchat = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$motivations.purchaseReason',
          count: { $sum: 1 }
        }
      }
    ]);

    // Premier achat
    const premierAchat = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$motivations.isFirstPurchase',
          count: { $sum: 1 }
        }
      }
    ]);

    // Veulent visiter
    const veutVisiter = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$projectKnowledge.wantVisit',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        parTimeline,
        parRaisonAchat,
        premierAchat,
        veutVisiter
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques timeline'
    });
  }
};

// @desc    Qualité des leads
// @route   GET /api/analytics/leads-quality
// @access  Private
exports.getLeadsQuality = async (req, res) => {
  try {
    const { projet_id } = req.query;
    const query = projet_id ? { projet_id } : {};

    // Distribution des scores
    const scoreDistribution = await Questionnaire.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$score_interet',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'Autre',
          output: {
            count: { $sum: 1 },
            leads: {
              $push: {
                nom: '$nom',
                prenom: '$prenom',
                email: '$email',
                score: '$score_interet'
              }
            }
          }
        }
      }
    ]);

    // Top 10 leads
    const topLeads = await Questionnaire.find(query)
      .select('nom prenom email telephone score_interet qualification statut date_soumission')
      .sort({ score_interet: -1 })
      .limit(10);

    // Taux de conversion par qualification
    const conversionRates = await Questionnaire.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            qualification: '$qualification',
            statut: '$statut'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        scoreDistribution,
        topLeads,
        conversionRates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la qualité des leads'
    });
  }
};
