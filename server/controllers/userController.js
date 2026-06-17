const User = require('../models/User');

// @desc    Create a Manager (Company Admin only)
// @route   POST /api/users/create-manager
// @access  Private (company_admin)
const createManager = async (req, res) => {
  try {
    const { name, email, department, designation } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide name and email' });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Temporary password as requested by user
    const tempPassword = 'Temp@123';

    const manager = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: tempPassword, // Will be hashed by pre-save hook
      role: 'manager',
      company: req.user.company, // Must be the same company as the admin
      department: department || null,
      designation: designation || 'Manager',
      mustChangePassword: true,
      isActive: true,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Manager created successfully',
      tempPassword,
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
        company: manager.company,
        designation: manager.designation,
      }
    });
  } catch (error) {
    console.error('Create Manager error:', error);
    res.status(500).json({ success: false, message: 'Server error during manager creation', error: error.message });
  }
};

// @desc    Create an Employee (Company Admin or Manager)
// @route   POST /api/users/create-employee
// @access  Private (company_admin, manager)
const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation, joiningDate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide name and email' });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Temporary password as requested by user
    const tempPassword = 'Temp@123';

    const employee = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: tempPassword, // Will be hashed by pre-save hook
      role: 'employee',
      company: req.user.company, // Must be the same company
      department: department || null,
      designation: designation || 'Employee',
      phone: phone || '',
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      mustChangePassword: true,
      isActive: true,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      tempPassword,
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        company: employee.company,
        designation: employee.designation,
        phone: employee.phone,
        joiningDate: employee.joiningDate,
      }
    });
  } catch (error) {
    console.error('Create Employee error:', error);
    res.status(500).json({ success: false, message: 'Server error during employee creation', error: error.message });
  }
};

// @desc    Get Users (Managers/Employees of the company, or all for super_admin)
// @route   GET /api/users
// @access  Private (super_admin, company_admin, manager)
const getUsers = async (req, res) => {
  try {
    let query = {};
    
    // Multi-tenant check
    if (req.user.role === 'super_admin') {
      // Super admins see everyone
      query = {};
    } else {
      // Others only see users from their own company
      if (!req.user.company) {
        return res.status(400).json({ success: false, message: 'User does not belong to any company' });
      }
      query = { company: req.user.company };
    }

    const users = await User.find(query).populate('company department');
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get Users error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users', error: error.message });
  }
};

// @desc    Update a User
// @route   PUT /api/users/:id
// @access  Private (company_admin, manager, or self)
const updateUser = async (req, res) => {
  try {
    const { name, phone, department, designation, role, isActive, status } = req.body;
    
    const userToEdit = await User.findById(req.id || req.params.id);
    if (!userToEdit) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Role-based Multi-tenant check: Can only edit user of the same company (unless super_admin)
    if (req.user.role !== 'super_admin') {
      if (!req.user.company || !userToEdit.company || req.user.company.toString() !== userToEdit.company.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit users of other companies' });
      }
    }

    // Role validation: manager cannot change roles or de-activate users
    if (req.user.role === 'manager' && (role || isActive !== undefined || status)) {
      return res.status(403).json({ success: false, message: 'Managers cannot modify user roles or activation status' });
    }

    // Update fields
    if (name) userToEdit.name = name;
    if (phone) userToEdit.phone = phone;
    if (department) userToEdit.department = department;
    if (designation) userToEdit.designation = designation;
    if (role && req.user.role === 'company_admin') userToEdit.role = role;
    
    if (isActive !== undefined && req.user.role === 'company_admin') {
      userToEdit.isActive = isActive;
      userToEdit.status = isActive ? 'Active' : 'Inactive';
    }
    
    if (status && req.user.role === 'company_admin') {
      userToEdit.status = status;
      userToEdit.isActive = status === 'Active';
    }

    await userToEdit.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: userToEdit,
    });
  } catch (error) {
    console.error('Update User error:', error);
    res.status(500).json({ success: false, message: 'Server error updating user', error: error.message });
  }
};

// @desc    Delete a User (Company Admin only, deactivate instead of physical deletion)
// @route   DELETE /api/users/:id
// @access  Private (company_admin)
const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Multi-tenant check
    if (req.user.role !== 'super_admin') {
      if (!req.user.company || !userToDelete.company || req.user.company.toString() !== userToDelete.company.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete users of other companies' });
      }
    }

    // We deactivate the user rather than physical deletion to preserve audit history/project tasks
    userToDelete.isActive = false;
    userToDelete.status = 'Inactive';
    await userToDelete.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated/deleted successfully',
    });
  } catch (error) {
    console.error('Delete User error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
};

module.exports = {
  createManager,
  createEmployee,
  getUsers,
  updateUser,
  deleteUser,
};
