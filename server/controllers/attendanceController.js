const Attendance = require('../models/Attendance');
const { createNotification } = require('./notificationController');

// Helper to format date & time
const getTodayDateString = () => new Date().toISOString().split('T')[0];
const getCurrentTimeString = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Helper to parse time string (e.g., "09:00 AM" or "14:30") to minutes since midnight
const parseTimeStringToMinutes = (timeStr) => {
  if (!timeStr) return 9 * 60; // fallback to 09:00 AM (540 minutes)
  const cleanStr = timeStr.trim().toUpperCase();
  const match = cleanStr.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
  if (!match) return 9 * 60;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];
  
  if (ampm) {
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
};

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
    
    // Dynamic late-check based on company settings
    const company = req.user.company;
    const shiftStartStr = (company && company.shiftStart) || '09:00 AM';
    const shiftGraceMin = (company && company.shiftGrace !== undefined) ? company.shiftGrace : 15;
    
    const shiftStartMinutes = parseTimeStringToMinutes(shiftStartStr);
    const lateThresholdMinutes = shiftStartMinutes + shiftGraceMin;
    
    let status = 'On Time';
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    
    if (minutesSinceMidnight > lateThresholdMinutes) {
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

const getAttendanceReport = async (req, res) => {
  try {
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const isEmployee = req.user.role === 'employee';
    const query = { company: companyId };
    if (isEmployee) {
      query.user = req.user.id;
    }

    const totalShifts = await Attendance.countDocuments(query);
    const lateLogs = await Attendance.countDocuments({ ...query, status: 'Late' });
    const onTimeLogs = await Attendance.countDocuments({ ...query, status: 'On Time' });

    // Calculate delay rate
    const delayRate = totalShifts > 0 ? ((lateLogs / totalShifts) * 100).toFixed(1) : '0.0';

    let perfectAttendanceCount = 0;
    if (!isEmployee) {
      // Count employees with logs but no late logs
      const User = require('../models/User');
      const users = await User.find({ company: companyId, role: 'employee' });
      
      for (const u of users) {
        const uLateLogs = await Attendance.countDocuments({ user: u._id, status: 'Late' });
        const uTotalLogs = await Attendance.countDocuments({ user: u._id });
        if (uTotalLogs > 0 && uLateLogs === 0) {
          perfectAttendanceCount++;
        }
      }
    } else {
      perfectAttendanceCount = (totalShifts > 0 && lateLogs === 0) ? 1 : 0;
    }

    res.status(200).json({
      success: true,
      report: {
        totalShifts,
        lateLogs,
        onTimeLogs,
        delayRate,
        perfectAttendanceCount,
      },
    });
  } catch (error) {
    console.error('Attendance report error:', error);
    res.status(500).json({ success: false, message: 'Server error during attendance report generation', error: error.message });
  }
};

const exportAttendanceCSV = async (req, res) => {
  try {
    const { convertToCSV } = require('../utils/csvHelper');
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const logs = await Attendance.find({ company: companyId })
      .populate('user', 'name email')
      .sort({ date: -1 });

    const data = logs.map((log) => ({
      EmployeeName: log.user?.name || 'Unknown',
      Email: log.user?.email || 'N/A',
      Date: log.date,
      CheckIn: log.checkIn || 'N/A',
      CheckOut: log.checkOut || 'N/A',
      Status: log.status,
    }));

    const csvContent = convertToCSV(data, ['EmployeeName', 'Email', 'Date', 'CheckIn', 'CheckOut', 'Status']);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export attendance CSV error:', error);
    res.status(500).json({ success: false, message: 'Server error during CSV export', error: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getLogs,
  getAttendanceReport,
  exportAttendanceCSV,
};
