const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  submitQuestionnaire,
  getQuestionnaires,
  getQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  addNote,
  updateStatut
} = require('../controllers/questionnairesController');

// Routes publiques
router.post('/submit', submitQuestionnaire);

// Routes TEMPORAIREMENT publiques pour analytics et gestion (À PROTÉGER PLUS TARD)
router.get('/', getQuestionnaires); // Public pour analytics
router.delete('/:id', deleteQuestionnaire); // TEMPORAIREMENT public pour tests

// Routes protégées (admin uniquement)
router.get('/:id', protect, getQuestionnaire);
router.put('/:id', protect, updateQuestionnaire);
router.post('/:id/notes', protect, addNote);
router.put('/:id/statut', protect, updateStatut);

module.exports = router;
