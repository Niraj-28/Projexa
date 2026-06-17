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

// @desc    Get a single Department
// @route   GET /api/departments/:id
// @access  Private (company_admin, manager)
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).populate('manager', 'name email');

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, department });
  } catch (error) {
    console.error('Get Department error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching department', error: error.message });
  }
};

// @desc    Update a Department
// @route   PUT /api/departments/:id
// @access  Private (company_admin)
const updateDepartment = async (req, res) => {
  try {
    const { name, code, manager } = req.body;
    const department = await Department.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    if (code && code.toUpperCase() !== department.code) {
      const codeExists = await Department.findOne({
        company: req.user.company,
        code: code.toUpperCase(),
        _id: { $ne: department._id },
      });

      if (codeExists) {
        return res.status(400).json({ success: false, message: 'Department code already exists in this company' });
      }
    }

    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    if (manager !== undefined) department.manager = manager || null;

    await department.save();
    res.status(200).json({ success: true, message: 'Department updated successfully', department });
  } catch (error) {
    console.error('Update Department error:', error);
    res.status(500).json({ success: false, message: 'Server error updating department', error: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
};
