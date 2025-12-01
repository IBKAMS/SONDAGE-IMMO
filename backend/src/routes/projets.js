const express = require('express');
const router = express.Router();
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

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.route('/')
  .get(getProjets)
  .post(createProjet);

router.route('/:id')
  .get(getProjet)
  .put(updateProjet)
  .delete(deleteProjet);

module.exports = router;
