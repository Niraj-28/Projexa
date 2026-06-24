const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPaymentSignature } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/razorpay-order', authorize('company_admin'), createRazorpayOrder);
router.post('/verify-signature', authorize('company_admin'), verifyPaymentSignature);

module.exports = router;
