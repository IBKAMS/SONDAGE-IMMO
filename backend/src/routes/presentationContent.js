const express = require('express');
const router = express.Router();
const {
  getPresentationContent,
  getAllPresentationContents,
  createPresentationContent,
  updatePresentationContent,
  deletePresentationContent,
  activatePresentationContent
} = require('../controllers/presentationContentController');

// Routes publiques
router.get('/', getPresentationContent);

// Routes admin (temporairement publiques - à sécuriser plus tard)
router.get('/all', getAllPresentationContents);
router.post('/', createPresentationContent);
router.put('/:id', updatePresentationContent);
router.delete('/:id', deletePresentationContent);
router.put('/:id/activate', activatePresentationContent);

module.exports = router;
