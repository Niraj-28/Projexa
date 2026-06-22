const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  getProjectsReport,
  exportProjectsCSV,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/report', authorize('company_admin', 'manager'), getProjectsReport);
router.get('/export', authorize('company_admin', 'manager'), exportProjectsCSV);

router.post('/', authorize('company_admin', 'manager'), createProject);
router.get('/', authorize('company_admin', 'manager'), getProjects);
router.get('/:id', authorize('company_admin', 'manager'), getProject);
router.put('/:id', authorize('company_admin', 'manager'), updateProject);

module.exports = router;
