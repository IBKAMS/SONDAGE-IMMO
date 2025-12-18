const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMyProspects,
  getProspectDetail,
  getMyCommissions,
  getLogements
} = require('../controllers/apporteurDashboardController');
const { protectApporteur } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification apporteur
router.use(protectApporteur);

// Dashboard principal
router.get('/stats', getDashboardStats);

// Prospects
router.get('/prospects', getMyProspects);
router.get('/prospects/:id', getProspectDetail);

// Commissions
router.get('/commissions', getMyCommissions);

// Logements (pour information)
router.get('/logements', getLogements);

module.exports = router;
