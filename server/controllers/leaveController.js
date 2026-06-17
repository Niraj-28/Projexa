const Leave = require('../models/Leave');
const { createNotification } = require('./notificationController');

// @desc    Request a Leave (Employee only)
// @route   POST /api/leaves
// @access  Private (employee)
const requestLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please provide start date, end date, and reason' });
    }

    const leave = await Leave.create({
      user: req.user.id,
      company: req.user.company,
      type: type || 'Casual Leave',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'Pending',
    });

    await createNotification(
      {
        company: req.user.company,
        type: 'leave',
        title: 'Leave request submitted',
        message: `${req.user.name} requested ${leave.type}.`,
        metadata: { leaveId: leave._id },
      },
      req.app.get('io')
    );

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave,
    });
  } catch (error) {
    console.error('Request leave error:', error);
    res.status(500).json({ success: false, message: 'Server error during leave request', error: error.message });
  }
};

// @desc    Get Leave Requests (Employees get their own; Admins/Managers get all scoped by company)
// @route   GET /api/leaves
// @access  Private (company_admin, manager, employee)
const getLeaves = async (req, res) => {
  try {
    let query = { company: req.user.company };

    if (req.user.role === 'employee') {
      query.user = req.user.id;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'name email designation')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaves', error: error.message });
  }
};

// @desc    Approve or Reject Leave Request (Admins and Managers only)
// @route   PUT /api/leaves/:id
// @access  Private (company_admin, manager)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status (Approved or Rejected)' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    // Company scoping check
    const leaveCompanyId = leave.company && (leave.company._id || leave.company).toString();
    const userCompanyId = req.user.company && (req.user.company._id || req.user.company).toString();
    if (leaveCompanyId !== userCompanyId) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage leaves from other workspaces' });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    await leave.save();

    await createNotification(
      {
        company: req.user.company,
        recipient: leave.user,
        type: 'leave',
        title: `Leave ${status.toLowerCase()}`,
        message: `Your leave request was ${status.toLowerCase()} by ${req.user.name}.`,
        metadata: { leaveId: leave._id },
      },
      req.app.get('io')
    );

    res.status(200).json({
      success: true,
      message: `Leave request has been ${status.toLowerCase()}`,
      leave,
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating leave status', error: error.message });
  }
};

module.exports = {
  requestLeave,
  getLeaves,
  updateLeaveStatus,
};
