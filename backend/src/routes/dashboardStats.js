const express = require('express');
const router = express.Router();
const dashboardStatsController = require('../controllers/dashboardStatsController');

// Route pour récupérer les statistiques du dashboard
router.get('/', dashboardStatsController.getDashboardStats);

module.exports = router;
