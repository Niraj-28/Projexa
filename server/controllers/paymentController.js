const Razorpay = require('razorpay');
const crypto = require('crypto');
const Company = require('../models/Company');

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const enrichCompanyDetails = (companyObj) => {
  if (!companyObj) return companyObj;
  const activePlan = companyObj.subscriptionPlan || 'Free';
  let seatLimit = 10;
  let priceString = '₹0 / month • Free Tiers';
  let cardString = companyObj.cardLast4 ? `•••• •••• •••• ${companyObj.cardLast4}` : 'No card required (Free Tier)';
  let cardBrand = companyObj.cardBrand || 'N/A';
  let autoRenew = companyObj.autoRenew || false;
  let renewalDate = 'N/A';

  if (activePlan === 'Professional') {
    seatLimit = 100;
    priceString = '₹999 / month';
    if (!companyObj.cardLast4) {
      cardString = '•••• •••• •••• 4892';
      cardBrand = 'HDFC Bank Debit Card';
      autoRenew = true;
    }
    renewalDate = 'July 1, 2026';
  } else if (activePlan === 'Enterprise') {
    seatLimit = 1000;
    priceString = '₹4,999 / month';
    if (!companyObj.cardLast4) {
      cardString = '•••• •••• •••• 9811';
      cardBrand = 'ICICI Corporate Credit Card';
      autoRenew = true;
    }
    renewalDate = 'July 1, 2026';
  }

  return {
    ...companyObj,
    seatLimit,
    priceString,
    cardString,
    cardBrand,
    autoRenew,
    renewalDate
  };
};

// @desc    Generate Razorpay Order
// @route   POST /api/payments/razorpay-order
// @access  Private (company_admin)
const createRazorpayOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    let amountInINR = 0;

    if (plan === 'Professional') {
      amountInINR = 999;
    } else if (plan === 'Enterprise') {
      amountInINR = 4999;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    // Razorpay accepts amounts in the lowest currency unit (Paise for INR: 1 Rs = 100 Paise)
    const options = {
      amount: amountInINR * 100, 
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

// @desc    Verify Razorpay Signature & Activate Plan
// @route   POST /api/payments/verify-signature
// @access  Private (company_admin)
const verifyPaymentSignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    // 1. Generate expected signature using SHA256 HMAC
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // 2. Validate authenticity
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // 3. Signature is authentic - Update company subscription properties
    const company = await Company.findById(req.user.company);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company.subscriptionPlan = plan;
    company.cardBrand = 'Razorpay UPI';
    company.cardLast4 = razorpay_payment_id.slice(-6); // Store partial receipt suffix
    company.autoRenew = true;
    await company.save();

    const enriched = enrichCompanyDetails(company.toObject());

    res.status(200).json({
      success: true,
      message: 'Payment verified and plan activated successfully!',
      company: enriched
    });
  } catch (error) {
    console.error('Signature Verification Error:', error);
    res.status(500).json({ success: false, message: 'Verification error', error: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature
};
