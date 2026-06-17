const express = require('express');
const router = express.Router();
const {
  registerCompany,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-company', registerCompany);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', protect, changePassword);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
