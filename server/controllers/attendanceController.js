const Attendance = require('../models/Attendance');
const { createNotification } = require('./notificationController');

// Helper to format date & time
const getTodayDateString = () => new Date().toISOString().split('T')[0];
const getCurrentTimeString = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// @desc    Log Check In (Employee only)
// @route   POST /api/attendance/check-in
// @access  Private (employee)
const checkIn = async (req, res) => {
  try {
    const today = getTodayDateString();
    
    // Check if check-in already logged
    const existingLog = await Attendance.findOne({ user: req.user.id, date: today });
    if (existingLog) {
      return res.status(400).json({ success: false, message: 'You have already checked in for today' });
    }

    const checkInTime = getCurrentTimeString();
    
    // Simple late-check check (e.g. after 09:15 AM is Late)
    let status = 'On Time';
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    if (minutesSinceMidnight > 9 * 60 + 15) {
      status = 'Late';
    }

    const log = await Attendance.create({
      user: req.user.id,
      company: req.user.company,
      date: today,
      checkIn: checkInTime,
      status,
    });

    if (status === 'Late') {
      await createNotification(
        {
          company: req.user.company,
          type: 'attendance',
          title: 'Late clock-in',
          message: `${req.user.name} checked in at ${checkInTime}.`,
          metadata: { attendanceId: log._id },
        },
        req.app.get('io')
      );
    }

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      log,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, message: 'Server error during check-in', error: error.message });
  }
};

// @desc    Log Check Out (Employee only)
// @route   POST /api/attendance/check-out
// @access  Private (employee)
const checkOut = async (req, res) => {
  try {
    const today = getTodayDateString();

    const log = await Attendance.findOne({ user: req.user.id, date: today, checkOut: '' });
    if (!log) {
      return res.status(404).json({ success: false, message: 'No active check-in session found for today' });
    }

    const checkOutTime = getCurrentTimeString();
    
    log.checkOut = checkOutTime;
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      log,
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, message: 'Server error during check-out', error: error.message });
  }
};

// @desc    Get Attendance Logs (Employees get their own; Admins/Managers get all scoped by company)
// @route   GET /api/attendance
// @access  Private (company_admin, manager, employee)
const getLogs = async (req, res) => {
  try {
    let query = { company: req.user.company };

    if (req.user.role === 'employee') {
      query.user = req.user.id;
    }

    const logs = await Attendance.find(query)
      .populate('user', 'name email designation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error('Get attendance logs error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching attendance logs', error: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getLogs,
};
