const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  getDemographicsStats,
  getBudgetStats,
  getPreferencesStats,
  getTimelineStats,
  getLeadsQuality
} = require('../controllers/analyticsController');

// Toutes les routes analytics sont protégées
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/demographics', getDemographicsStats);
router.get('/budget', getBudgetStats);
router.get('/preferences', getPreferencesStats);
router.get('/timeline', getTimelineStats);
router.get('/leads-quality', getLeadsQuality);

module.exports = router;
