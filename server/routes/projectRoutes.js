const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('company_admin'), createProject);
router.get('/', authorize('company_admin', 'manager'), getProjects);

module.exports = router;
