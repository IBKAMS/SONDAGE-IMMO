const express = require('express');
const router = express.Router();
const {
  getPromoteurContent,
  getAllPromoteurContents,
  createPromoteurContent,
  updatePromoteurContent,
  deletePromoteurContent,
  activatePromoteurContent
} = require('../controllers/promoteurContentController');

// Routes publiques
router.get('/', getPromoteurContent);

// Routes admin (temporairement publiques - à sécuriser plus tard)
router.get('/all', getAllPromoteurContents);
router.post('/', createPromoteurContent);
router.put('/:id', updatePromoteurContent);
router.delete('/:id', deletePromoteurContent);
router.put('/:id/activate', activatePromoteurContent);

module.exports = router;
