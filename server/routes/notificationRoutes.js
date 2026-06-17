const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', authorize('super_admin', 'company_admin', 'manager', 'employee'), getNotifications);
router.put('/:id/read', authorize('super_admin', 'company_admin', 'manager', 'employee'), markNotificationRead);

module.exports = router;
