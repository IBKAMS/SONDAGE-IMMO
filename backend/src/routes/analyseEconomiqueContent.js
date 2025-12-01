const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAnalyseEconomiqueContent,
  getAllAnalyseEconomiqueContents,
  createAnalyseEconomiqueContent,
  updateAnalyseEconomiqueContent,
  deleteAnalyseEconomiqueContent,
  activateAnalyseEconomiqueContent
} = require('../controllers/analyseEconomiqueContentController');

// Routes publiques
router.get('/', getAnalyseEconomiqueContent);

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.get('/all', getAllAnalyseEconomiqueContents);
router.post('/', createAnalyseEconomiqueContent);
router.put('/:id', updateAnalyseEconomiqueContent);
router.delete('/:id', deleteAnalyseEconomiqueContent);
router.put('/:id/activate', activateAnalyseEconomiqueContent);

module.exports = router;
