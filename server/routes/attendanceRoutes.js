const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getLogs } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/check-in', authorize('employee'), checkIn);
router.post('/check-out', authorize('employee'), checkOut);
router.get('/', authorize('company_admin', 'manager', 'employee'), getLogs);

module.exports = router;
