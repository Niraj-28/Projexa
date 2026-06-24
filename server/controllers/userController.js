const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');

// Resolve department input (name or ID) to ObjectId, creating it on the fly if needed
const resolveDepartment = async (departmentInput, companyId) => {
  if (!departmentInput) return null;

  const trimmedInput = String(departmentInput).trim();
  if (!trimmedInput) return null;

  // 1. Check if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(trimmedInput)) {
    const dept = await Department.findOne({ _id: trimmedInput, company: companyId });
    if (dept) return dept._id;
  }

  // 2. Search by case-insensitive name
  let dept = await Department.findOne({
    company: companyId,
    name: { $regex: new RegExp('^' + trimmedInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') }
  });

  if (dept) {
    return dept._id;
  }

  // 3. Create a new department on the fly
  let baseCode = trimmedInput
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);
  if (!baseCode) baseCode = 'DEPT';

  let code = baseCode;
  let attempts = 0;
  let codeExists = true;

  while (codeExists && attempts < 100) {
    const checkCode = await Department.findOne({ company: companyId, code });
    if (!checkCode) {
      codeExists = false;
    } else {
      attempts++;
      code = `${baseCode}${attempts}`;
    }
  }

  const newDept = await Department.create({
    name: trimmedInput,
    code,
    company: companyId
  });

  return newDept._id;
};

// @desc    Create a Manager (Company Admin only)
// @route   POST /api/users/create-manager
// @access  Private (company_admin)
const createManager = async (req, res) => {
  try {
    const { name, email, phone, department, designation } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide name and email' });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Check seat limit
    const company = req.user.company;
    if (!company) {
      return res.status(400).json({ success: false, message: 'Workspace context not found' });
    }
    let seatLimit = 10;
    if (company.subscriptionPlan === 'Professional') {
      seatLimit = 100;
    } else if (company.subscriptionPlan === 'Enterprise') {
      seatLimit = 1000;
    }

    const activeHeadcount = await User.countDocuments({ company: company._id || company, isActive: true });
    if (activeHeadcount >= seatLimit) {
      return res.status(400).json({
        success: false,
        message: `Seat limit reached (${seatLimit} seats). Please upgrade your subscription plan to add more users.`
      });
    }

    // Temporary password as requested by user
    const tempPassword = 'Temp@123';

    const resolvedDept = await resolveDepartment(department, req.user.company);

    const manager = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: tempPassword, // Will be hashed by pre-save hook
      role: 'manager',
      company: req.user.company, // Must be the same company as the admin
      department: resolvedDept,
      designation: designation || 'Manager',
      phone: phone || '',
      mustChangePassword: true,
      isActive: true,
      status: 'Active'
    });

    // Send email and SMS with credentials
    const { sendEmail, sendSMS } = require('../utils/messaging');
    const companyName = (req.user.company && req.user.company.name) || 'WorkArea Workspace';

    await sendEmail({
      to: manager.email,
      subject: `Welcome to ${companyName} - Your Temporary Credentials`,
      body: `Hello ${manager.name},\n\nYou have been onboarded as a Manager in ${companyName}.\n\nHere are your login credentials:\nEmail: ${manager.email}\nTemporary Password: ${tempPassword}\n\nPlease login at ${process.env.CLIENT_URL || 'http://localhost:5173'} and update your password on first login.\n\nBest regards,\n${companyName} Team`
    });

    if (manager.phone) {
      await sendSMS({
        to: manager.phone,
        body: `Welcome to ${companyName}! You have been added as a Manager. Log in at ${process.env.CLIENT_URL || 'http://localhost:5173'} with Email: ${manager.email} and Temp Password: ${tempPassword}`
      });
    }

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
        phone: manager.phone,
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

    // Check seat limit
    const company = req.user.company;
    if (!company) {
      return res.status(400).json({ success: false, message: 'Workspace context not found' });
    }
    let seatLimit = 10;
    if (company.subscriptionPlan === 'Professional') {
      seatLimit = 100;
    } else if (company.subscriptionPlan === 'Enterprise') {
      seatLimit = 1000;
    }

    const activeHeadcount = await User.countDocuments({ company: company._id || company, isActive: true });
    if (activeHeadcount >= seatLimit) {
      return res.status(400).json({
        success: false,
        message: `Seat limit reached (${seatLimit} seats). Please upgrade your subscription plan to add more users.`
      });
    }

    // Temporary password as requested by user
    const tempPassword = 'Temp@123';

    const resolvedDept = await resolveDepartment(department, req.user.company);

    const employee = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: tempPassword, // Will be hashed by pre-save hook
      role: 'employee',
      company: req.user.company, // Must be the same company
      department: resolvedDept,
      designation: designation || 'Employee',
      phone: phone || '',
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      mustChangePassword: true,
      isActive: true,
      status: 'Active'
    });

    // Send email and SMS with credentials
    const { sendEmail, sendSMS } = require('../utils/messaging');
    const companyName = (req.user.company && req.user.company.name) || 'WorkArea Workspace';

    await sendEmail({
      to: employee.email,
      subject: `Welcome to ${companyName} - Your Temporary Credentials`,
      body: `Hello ${employee.name},\n\nYou have been onboarded as an Employee in ${companyName}.\n\nHere are your login credentials:\nEmail: ${employee.email}\nTemporary Password: ${tempPassword}\n\nPlease login at ${process.env.CLIENT_URL || 'http://localhost:5173'} and update your password on first login.\n\nBest regards,\n${companyName} Team`
    });

    if (employee.phone) {
      await sendSMS({
        to: employee.phone,
        body: `Welcome to ${companyName}! You have been added to the workspace. Log in at ${process.env.CLIENT_URL || 'http://localhost:5173'} with Email: ${employee.email} and Temp Password: ${tempPassword}`
      });
    }

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

// @desc    Get the current user's profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('company department');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile', error: error.message });
  }
};

// @desc    Update the current user's profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = async (req, res) => {
  try {
    const { name, phone, designation } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (designation !== undefined) user.designation = designation;

    await user.save();
    await user.populate('company department');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update current user error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile', error: error.message });
  }
};

// @desc    Update a User
// @route   PUT /api/users/:id
// @access  Private (company_admin, manager, or self)
const updateUser = async (req, res) => {
  try {
    const { name, phone, department, designation, role, isActive, status } = req.body;
    
    const userToEdit = await User.findById(req.params.id);
    if (!userToEdit) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Role-based Multi-tenant check: Can only edit user of the same company (unless super_admin)
    if (req.user.role !== 'super_admin') {
      const userCompanyId = req.user.company && (req.user.company._id || req.user.company).toString();
      const targetCompanyId = userToEdit.company && (userToEdit.company._id || userToEdit.company).toString();
      if (!userCompanyId || !targetCompanyId || userCompanyId !== targetCompanyId) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit users of other companies' });
      }
    }

    // Role validation: manager cannot change roles or de-activate users
    if (req.user.role === 'manager' && (role || isActive !== undefined || status)) {
      return res.status(403).json({ success: false, message: 'Managers cannot modify user roles or activation status' });
    }

    // Update fields
    if (name) userToEdit.name = name;
    if (phone !== undefined) userToEdit.phone = phone;
    if (department !== undefined) {
      const companyId = userToEdit.company || req.user.company;
      userToEdit.department = await resolveDepartment(department, companyId);
    }
    if (designation !== undefined) userToEdit.designation = designation;
    if (role && req.user.role === 'company_admin') userToEdit.role = role;
    
    const willBeActive = (isActive !== undefined && isActive) || (status && status === 'Active');
    const wasActive = userToEdit.isActive;

    if (willBeActive && !wasActive && req.user.role === 'company_admin') {
      const companyId = userToEdit.company || req.user.company;
      const Company = require('../models/Company');
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(400).json({ success: false, message: 'Workspace context not found' });
      }

      let seatLimit = 10;
      if (company.subscriptionPlan === 'Professional') {
        seatLimit = 100;
      } else if (company.subscriptionPlan === 'Enterprise') {
        seatLimit = 1000;
      }

      const activeHeadcount = await User.countDocuments({ company: companyId, isActive: true });
      if (activeHeadcount >= seatLimit) {
        return res.status(400).json({
          success: false,
          message: `Seat limit reached (${seatLimit} seats). Cannot activate user. Please upgrade your subscription plan.`
        });
      }
    }
    
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
      const userCompanyId = req.user.company && (req.user.company._id || req.user.company).toString();
      const targetCompanyId = userToDelete.company && (userToDelete.company._id || userToDelete.company).toString();
      if (!userCompanyId || !targetCompanyId || userCompanyId !== targetCompanyId) {
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

const getEmployeeReport = async (req, res) => {
  try {
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const totalStaff = await User.countDocuments({ company: companyId });
    const activeStaff = await User.countDocuments({ company: companyId, isActive: true });
    const admins = await User.countDocuments({ company: companyId, role: 'company_admin', isActive: true });
    const managers = await User.countDocuments({ company: companyId, role: 'manager', isActive: true });
    const employees = await User.countDocuments({ company: companyId, role: 'employee', isActive: true });
    const inactive = await User.countDocuments({ company: companyId, isActive: false });

    const users = await User.find({ company: companyId }).populate('department');
    const deptHeadcounts = {};
    users.forEach((u) => {
      if (u.isActive) {
        const deptName = u.department?.name || 'Unassigned';
        deptHeadcounts[deptName] = (deptHeadcounts[deptName] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      report: {
        totalStaff,
        activeStaff,
        admins,
        managers,
        employees,
        inactive,
        deptHeadcounts,
      },
    });
  } catch (error) {
    console.error('Employee report error:', error);
    res.status(500).json({ success: false, message: 'Server error during employee report generation', error: error.message });
  }
};

const exportEmployeesCSV = async (req, res) => {
  try {
    const { convertToCSV } = require('../utils/csvHelper');
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const users = await User.find({ company: companyId }).populate('department');
    const data = users.map((u) => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Department: u.department?.name || 'N/A',
      Designation: u.designation || 'N/A',
      Phone: u.phone || 'N/A',
      JoiningDate: u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : 'N/A',
      Status: u.isActive ? 'Active' : 'Inactive',
    }));

    const csvContent = convertToCSV(data, ['Name', 'Email', 'Role', 'Department', 'Designation', 'Phone', 'JoiningDate', 'Status']);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees_report.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export employees CSV error:', error);
    res.status(500).json({ success: false, message: 'Server error during CSV export', error: error.message });
  }
};

module.exports = {
  createManager,
  createEmployee,
  getUsers,
  getMe,
  updateMe,
  updateUser,
  deleteUser,
  getEmployeeReport,
  exportEmployeesCSV,
};
