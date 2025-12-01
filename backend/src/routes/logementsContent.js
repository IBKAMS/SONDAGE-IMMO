const express = require('express');
const router = express.Router();
const {
  getLogementsContent,
  getAllLogementsContents,
  createLogementsContent,
  updateLogementsContent,
  deleteLogementsContent,
  activateLogementsContent
} = require('../controllers/logementsContentController');

// Routes publiques
router.get('/', getLogementsContent);

// Routes admin (temporairement publiques - à sécuriser plus tard)
router.get('/all', getAllLogementsContents);
router.post('/', createLogementsContent);
router.put('/:id', updateLogementsContent);
router.delete('/:id', deleteLogementsContent);
router.put('/:id/activate', activateLogementsContent);

module.exports = router;
