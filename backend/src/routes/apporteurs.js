const express = require('express');
const router = express.Router();
const {
  getApporteurs,
  getApporteur,
  createApporteur,
  updateApporteur,
  deleteApporteur,
  regenerateCode,
  getProspects,
  exportApporteurs,
  validateCode,
  updateCommissionStatus
} = require('../controllers/apporteursController');
const { protect } = require('../middleware/auth');

// Route publique pour valider un code apporteur
router.post('/validate-code', validateCode);

// Route export (doit être avant /:id)
router.get('/export', protect, exportApporteurs);

// Routes protégées (Admin)
router.route('/')
  .get(protect, getApporteurs)
  .post(protect, createApporteur);

router.route('/:id')
  .get(protect, getApporteur)
  .put(protect, updateApporteur)
  .delete(protect, deleteApporteur);

router.post('/:id/regenerate-code', protect, regenerateCode);
router.get('/:id/prospects', protect, getProspects);

// Gestion des commissions
router.put('/commission/:questionnaireId', protect, updateCommissionStatus);

module.exports = router;
