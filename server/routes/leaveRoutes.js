const express = require('express');
const router = express.Router();
const { requestLeave, getLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Request leave: restricted to employees
router.post('/', authorize('company_admin', 'manager', 'employee'), requestLeave);

// Get leaves: accessible by all workspace members with corresponding scoping
router.get('/', authorize('company_admin', 'manager', 'employee'), getLeaves);

// Approve/Reject leave: restricted to company admin and managers
router.put('/:id', authorize('company_admin', 'manager'), updateLeaveStatus);

module.exports = router;
