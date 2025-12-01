const express = require('express');
const router = express.Router();
const {
  getOptionAchatContent,
  getAllOptionAchatContents,
  createOptionAchatContent,
  updateOptionAchatContent,
  deleteOptionAchatContent,
  activateOptionAchatContent
} = require('../controllers/optionAchatContentController');

// Routes publiques
router.get('/', getOptionAchatContent);

// Routes admin (à protéger avec middleware d'authentification si nécessaire)
router.get('/all', getAllOptionAchatContents);
router.post('/', createOptionAchatContent);
router.put('/:id', updateOptionAchatContent);
router.delete('/:id', deleteOptionAchatContent);
router.put('/:id/activate', activateOptionAchatContent);

module.exports = router;
