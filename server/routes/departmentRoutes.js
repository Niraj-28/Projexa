const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('company_admin'), createDepartment);
router.get('/', authorize('company_admin', 'manager'), getDepartments);
router.get('/:id', authorize('company_admin', 'manager'), getDepartment);
router.put('/:id', authorize('company_admin'), updateDepartment);

module.exports = router;
