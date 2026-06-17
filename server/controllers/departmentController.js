const Department = require('../models/Department');

// @desc    Create a Department (Company Admin only)
// @route   POST /api/departments
// @access  Private (company_admin)
const createDepartment = async (req, res) => {
  try {
    const { name, code, manager } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Please provide department name and code' });
    }

    // Verify if code exists in company workspace
    const codeExists = await Department.findOne({
      company: req.user.company,
      code: code.toUpperCase(),
    });

    if (codeExists) {
      return res.status(400).json({ success: false, message: 'Department code already exists in this company' });
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      company: req.user.company,
      manager: manager || null,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department,
    });
  } catch (error) {
    console.error('Create Department error:', error);
    res.status(500).json({ success: false, message: 'Server error during department creation', error: error.message });
  }
};

// @desc    Get Departments (Admins and Managers)
// @route   GET /api/departments
// @access  Private (company_admin, manager)
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ company: req.user.company }).populate('manager', 'name email');
    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error('Get Departments error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching departments', error: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
};
