const express = require('express');
const router = express.Router();
const { createDepartment, getDepartments } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('company_admin'), createDepartment);
router.get('/', authorize('company_admin', 'manager'), getDepartments);

module.exports = router;
