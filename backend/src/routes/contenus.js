const express = require('express');
const router = express.Router();
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

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.route('/')
  .get(getContenus)
  .post(createContenu);

router.route('/:id')
  .get(getContenu)
  .put(updateContenu)
  .delete(deleteContenu);

router.put('/:id/restore/:versionIndex', restoreVersion);

module.exports = router;
