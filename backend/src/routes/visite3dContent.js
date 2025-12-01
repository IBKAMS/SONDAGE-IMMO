const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getVisite3DContent,
  getAllVisite3DContents,
  createVisite3DContent,
  updateVisite3DContent,
  deleteVisite3DContent,
  activateVisite3DContent
} = require('../controllers/visite3dContentController');

// Routes publiques
router.get('/', getVisite3DContent);

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.get('/all', getAllVisite3DContents);
router.post('/', createVisite3DContent);
router.put('/:id', updateVisite3DContent);
router.delete('/:id', deleteVisite3DContent);
router.put('/:id/activate', activateVisite3DContent);

module.exports = router;
