const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHomeContent,
  updateHomeContent,
  createHomeContent,
  getAllHomeContents,
  deleteHomeContent,
  activateHomeContent
} = require('../controllers/homeContentController');

// Routes publiques
router.get('/', getHomeContent);

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.get('/all', getAllHomeContents);
router.post('/', createHomeContent);
router.put('/:id', updateHomeContent);
router.delete('/:id', deleteHomeContent);
router.put('/:id/activate', activateHomeContent);

module.exports = router;
