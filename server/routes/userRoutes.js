const express = require('express');
const router = express.Router();
const {
  createManager,
  createEmployee,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Create manager: Restricted to company admin
router.post('/create-manager', authorize('company_admin'), createManager);

// Create employee: Restricted to company admin and manager
router.post('/create-employee', authorize('company_admin', 'manager'), createEmployee);

// Get all users in company: Restricted to company admins, managers and super admins
router.get('/', authorize('super_admin', 'company_admin', 'manager'), getUsers);

// Update user: Restricted to company admins, managers
router.put('/:id', authorize('super_admin', 'company_admin', 'manager'), updateUser);

// Delete/Deactivate user: Restricted to company admins
router.delete('/:id', authorize('company_admin'), deleteUser);

module.exports = router;
