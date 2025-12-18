const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  updatePassword,
  updateProfile
} = require('../controllers/apporteurAuthController');
const { protectApporteur } = require('../middleware/auth');

// Routes publiques
router.post('/login', login);

// Routes protégées (nécessitent authentification apporteur)
router.get('/me', protectApporteur, getMe);
router.put('/update-password', protectApporteur, updatePassword);
router.put('/update-profile', protectApporteur, updateProfile);

module.exports = router;
