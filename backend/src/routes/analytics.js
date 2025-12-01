const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDemographicsStats,
  getBudgetStats,
  getPreferencesStats,
  getTimelineStats,
  getLeadsQuality
} = require('../controllers/analyticsController');

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.get('/dashboard', getDashboardStats);
router.get('/demographics', getDemographicsStats);
router.get('/budget', getBudgetStats);
router.get('/preferences', getPreferencesStats);
router.get('/timeline', getTimelineStats);
router.get('/leads-quality', getLeadsQuality);

module.exports = router;
