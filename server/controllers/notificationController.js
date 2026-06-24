const Notification = require('../models/Notification');

const createNotification = async ({ company, recipient = null, type, title, message, metadata = {} }, io = null) => {
  const notification = await Notification.create({
    company,
    recipient,
    type,
    title,
    message,
    metadata,
  });

  if (io && company) {
    io.to(company.toString()).emit('notification:new', notification);
  }

  return notification;
};

const getNotifications = async (req, res) => {
  try {
    const query = {};
    const userRole = req.user.role;

    if (userRole === 'super_admin') {
      // Super admins only receive system-level/global notifications addressed to them
      query.company = null;
      query.$or = [{ recipient: null }, { recipient: req.user._id }];
    } else if (userRole === 'employee') {
      // Employees get company notifications addressed to them, or company-wide announcements
      // that are NOT administrative (like leave requests or attendance logs of other employees)
      query.company = req.user.company;
      query.$or = [
        { recipient: req.user._id },
        { 
          recipient: null, 
          type: { $nin: ['leave', 'attendance'] } 
        }
      ];
    } else {
      // Company admins and Managers see all workspace-scoped notifications
      query.company = req.user.company;
      query.$or = [{ recipient: null }, { recipient: req.user._id }];
    }

    const notifications = await Notification.find(query)
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notifications', error: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (
      req.user.role !== 'super_admin' &&
      notification.company?.toString() !== req.user.company?.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this notification' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification', error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
};
