const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadFile,
  uploadMultiple,
  deleteFile
} = require('../controllers/uploadsController');

// Routes TEMPORAIREMENT publiques (À PROTÉGER PLUS TARD)
router.post('/single', upload.single('file'), uploadFile);
router.post('/multiple', upload.array('files', 10), uploadMultiple);
router.delete('/:filename', deleteFile);

module.exports = router;
