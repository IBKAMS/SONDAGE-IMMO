const express = require('express');
const router = express.Router();
const {
  getArchitecteContent,
  getAllArchitecteContents,
  createArchitecteContent,
  updateArchitecteContent,
  deleteArchitecteContent,
  activateArchitecteContent
} = require('../controllers/architecteContentController');

// Routes publiques
router.get('/', getArchitecteContent);

// Routes admin (temporairement publiques - à sécuriser plus tard)
router.get('/all', getAllArchitecteContents);
router.post('/', createArchitecteContent);
router.put('/:id', updateArchitecteContent);
router.delete('/:id', deleteArchitecteContent);
router.put('/:id/activate', activateArchitecteContent);

module.exports = router;
