const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getLogements,
  getAllLogements,
  getLogement,
  createLogement,
  updateLogement,
  deleteLogement,
  getStats
} = require('../controllers/logementsController');

// Routes publiques
router.get('/', getLogements);
router.get('/stats/all', getStats);
router.get('/admin/all', getAllLogements); // Temporairement public pour développement
router.get('/:id', getLogement);

// Routes protégées (admin)
router.use(protect);

router.post('/', authorize('super_admin', 'admin'), createLogement);
router.put('/:id', authorize('super_admin', 'admin', 'editeur'), updateLogement);
router.delete('/:id', authorize('super_admin', 'admin'), deleteLogement);

module.exports = router;
