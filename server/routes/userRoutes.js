const express = require('express');
const router = express.Router();
const {
  createManager,
  createEmployee,
  getUsers,
  getMe,
  updateMe,
  updateUser,
  deleteUser,
  getEmployeeReport,
  exportEmployeesCSV,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/report', authorize('company_admin', 'manager'), getEmployeeReport);
router.get('/export', authorize('company_admin', 'manager'), exportEmployeesCSV);

// Create manager: Restricted to company admin
router.post('/create-manager', authorize('company_admin'), createManager);

// Create employee: Restricted to company admin and manager
router.post('/create-employee', authorize('company_admin', 'manager'), createEmployee);

// Get all users in company: Restricted to company admins, managers and super admins
router.get('/', authorize('super_admin', 'company_admin', 'manager'), getUsers);

// Current user profile: accessible by all workspace members
router.get('/me', authorize('super_admin', 'company_admin', 'manager', 'employee'), getMe);
router.put('/me', authorize('super_admin', 'company_admin', 'manager', 'employee'), updateMe);

// Update user: Restricted to company admins, managers
router.put('/:id', authorize('super_admin', 'company_admin', 'manager'), updateUser);

// Delete/Deactivate user: Restricted to company admins
router.delete('/:id', authorize('company_admin'), deleteUser);

module.exports = router;
