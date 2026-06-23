const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getLogs,
  getAttendanceReport,
  exportAttendanceCSV,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/report', authorize('company_admin', 'manager', 'employee'), getAttendanceReport);
router.get('/export', authorize('company_admin', 'manager'), exportAttendanceCSV);

router.post('/check-in', authorize('company_admin', 'manager', 'employee'), checkIn);
router.post('/check-out', authorize('company_admin', 'manager', 'employee'), checkOut);
router.get('/', authorize('company_admin', 'manager', 'employee'), getLogs);

module.exports = router;
