const express = require('express');
const router = express.Router();
const planArchitecturalController = require('../controllers/planArchitecturalController');

// GET /api/plans-architecturaux - Récupérer tous les plans
router.get('/', planArchitecturalController.getAllPlans);

// GET /api/plans-architecturaux/view/:type - Proxy pour visualiser un PDF
router.get('/view/:type', planArchitecturalController.viewPlan);

// GET /api/plans-architecturaux/:type - Récupérer un plan par type
router.get('/:type', planArchitecturalController.getPlanByType);

// POST /api/plans-architecturaux - Upload ou mise à jour d'un plan
router.post('/', planArchitecturalController.uploadPlan);

// DELETE /api/plans-architecturaux/:type - Supprimer un plan
router.delete('/:type', planArchitecturalController.deletePlan);

module.exports = router;
