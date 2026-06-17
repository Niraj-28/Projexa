const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompany,
  getMyCompany,
  updateMyCompany,
  updateCompanyStatus,
  getPlatformStats,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', authorize('company_admin', 'manager', 'employee'), getMyCompany);
router.put('/me', authorize('company_admin'), updateMyCompany);
router.get('/stats', authorize('super_admin'), getPlatformStats);
router.get('/', authorize('super_admin'), getCompanies);
router.get('/:id', authorize('super_admin'), getCompany);
router.put('/:id', authorize('super_admin'), updateCompanyStatus);

module.exports = router;
