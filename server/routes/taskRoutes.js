const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  getTasksReport,
  exportTasksCSV,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/report', authorize('company_admin', 'manager'), getTasksReport);
router.get('/export', authorize('company_admin', 'manager'), exportTasksCSV);

// Create task: restricted to company admin and managers
router.post('/', authorize('company_admin', 'manager'), createTask);

// Get tasks: accessible by all workspace members
router.get('/', authorize('company_admin', 'manager', 'employee'), getTasks);

// Update task: accessible by all workspace members with role-level limits
router.put('/:id', authorize('company_admin', 'manager', 'employee'), updateTask);

module.exports = router;
