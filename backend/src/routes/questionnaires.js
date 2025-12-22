const express = require('express');
const router = express.Router();
const {
  submitQuestionnaire,
  getQuestionnaires,
  getQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  addNote,
  updateStatut,
  updateEtapeDossier
} = require('../controllers/questionnairesController');

// Routes publiques
router.post('/submit', submitQuestionnaire);

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.get('/', getQuestionnaires);
router.delete('/:id', deleteQuestionnaire);
router.get('/:id', getQuestionnaire);
router.put('/:id', updateQuestionnaire);
router.post('/:id/notes', addNote);
router.put('/:id/statut', updateStatut);
router.put('/:id/etape', updateEtapeDossier);

module.exports = router;
