const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompany,
  getMyCompany,
  updateMyCompany,
  updateCompanyStatus,
  getPlatformStats,
  getPlatformSettings,
  updatePlatformSettings,
  getPlatformRevenue,
  getPlatformAnalytics,
  updateMySubscriptionPlan,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', authorize('company_admin', 'manager', 'employee'), getMyCompany);
router.put('/me', authorize('company_admin'), updateMyCompany);
router.put('/me/subscription', authorize('company_admin'), updateMySubscriptionPlan);
router.get('/stats', authorize('super_admin'), getPlatformStats);
router.get('/platform-settings', authorize('super_admin'), getPlatformSettings);
router.put('/platform-settings', authorize('super_admin'), updatePlatformSettings);
router.get('/platform-revenue', authorize('super_admin'), getPlatformRevenue);
router.get('/platform-analytics', authorize('super_admin'), getPlatformAnalytics);

router.get('/', authorize('super_admin'), getCompanies);
router.get('/:id', authorize('super_admin'), getCompany);
router.put('/:id', authorize('super_admin'), updateCompanyStatus);

module.exports = router;
