const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  login,
  getMe,
  updatePassword,
  updateProfile
} = require('../controllers/authController');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
