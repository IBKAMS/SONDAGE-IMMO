const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFooterContent,
  getAllFooterContent,
  createFooterContent,
  updateFooterContent,
  deleteFooterContent
} = require('../controllers/footerContentController');

// Routes publiques
router.get('/', getFooterContent);

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.get('/all', getAllFooterContent);
router.post('/', createFooterContent);
router.put('/:id', updateFooterContent);
router.delete('/:id', deleteFooterContent);

module.exports = router;
