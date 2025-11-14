const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProjets,
  getProjet,
  createProjet,
  updateProjet,
  deleteProjet,
  getProjetPublic
} = require('../controllers/projetsController');

// Routes publiques
router.get('/public', getProjets);
router.get('/public/:slug', getProjetPublic);

// Routes protégées
router.use(protect);

router.route('/')
  .get(getProjets)
  .post(authorize('super_admin', 'admin'), createProjet);

router.route('/:id')
  .get(getProjet)
  .put(authorize('super_admin', 'admin', 'editeur'), updateProjet)
  .delete(authorize('super_admin', 'admin'), deleteProjet);

module.exports = router;
