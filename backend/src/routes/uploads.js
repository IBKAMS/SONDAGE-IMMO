const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadFile,
  uploadMultiple,
  deleteFile
} = require('../controllers/uploadsController');

// Toutes les routes sont protégées
router.use(protect);
router.use(authorize('super_admin', 'admin', 'editeur'));

router.post('/single', upload.single('file'), uploadFile);
router.post('/multiple', upload.array('files', 10), uploadMultiple);
router.delete('/:filename', deleteFile);

module.exports = router;
