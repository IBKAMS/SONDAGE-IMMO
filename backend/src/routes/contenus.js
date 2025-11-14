const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getContenus,
  getContenu,
  createContenu,
  updateContenu,
  deleteContenu,
  getContenusBySection,
  restoreVersion
} = require('../controllers/contenusController');

// Routes publiques
router.get('/public/:projetId', getContenus);
router.get('/public/:projetId/section/:section', getContenusBySection);

// Routes protégées
router.use(protect);

router.route('/')
  .get(getContenus)
  .post(authorize('super_admin', 'admin', 'editeur'), createContenu);

router.route('/:id')
  .get(getContenu)
  .put(authorize('super_admin', 'admin', 'editeur'), updateContenu)
  .delete(authorize('super_admin', 'admin'), deleteContenu);

router.put('/:id/restore/:versionIndex', authorize('super_admin', 'admin'), restoreVersion);

module.exports = router;
