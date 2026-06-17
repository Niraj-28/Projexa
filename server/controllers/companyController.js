const Company = require('../models/Company');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

const withAdminDetails = async (companies) => {
  const companyIds = companies.map((company) => company._id);
  const admins = await User.find({
    company: { $in: companyIds },
    role: 'company_admin',
  }).select('name email company');

  const adminByCompany = new Map(admins.map((admin) => [admin.company.toString(), admin]));

  return companies.map((company) => {
    const admin = adminByCompany.get(company._id.toString());
    const data = company.toObject();
    return {
      ...data,
      adminName: admin?.name || 'Unassigned Admin',
      adminEmail: admin?.email || '',
    };
  });
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ createdAt: -1 });
    const enrichedCompanies = await withAdminDetails(companies);

    res.status(200).json({
      success: true,
      count: enrichedCompanies.length,
      companies: enrichedCompanies,
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching companies', error: error.message });
  }
};

const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const [enrichedCompany] = await withAdminDetails([company]);
    res.status(200).json({ success: true, company: enrichedCompany });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching company', error: error.message });
  }
};

const getMyCompany = async (req, res) => {
  try {
    if (!req.user.company) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const company = await Company.findById(req.user.company);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    console.error('Get current company error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching company profile', error: error.message });
  }
};

const updateMyCompany = async (req, res) => {
  try {
    const { name, email, industry } = req.body;

    if (!req.user.company) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const company = await Company.findById(req.user.company);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (name) company.name = name;
    if (email) company.email = email.toLowerCase();
    if (industry !== undefined) company.industry = industry;

    await company.save();
    res.status(200).json({ success: true, message: 'Company profile updated successfully', company });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ success: false, message: 'Server error updating company profile', error: error.message });
  }
};

const updateCompanyStatus = async (req, res) => {
  try {
    const { status, subscriptionPlan } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (status) company.status = status;
    if (subscriptionPlan) company.subscriptionPlan = subscriptionPlan;

    await company.save();
    res.status(200).json({ success: true, message: 'Company updated successfully', company });
  } catch (error) {
    console.error('Update company status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating company', error: error.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const [companies, users, projects, tasks, attendanceLogs, leaves] = await Promise.all([
      Company.countDocuments(),
      User.countDocuments(),
      Project.countDocuments(),
      Task.countDocuments(),
      Attendance.countDocuments(),
      Leave.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        companies,
        users,
        projects,
        tasks,
        attendanceLogs,
        leaves,
      },
    });
  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching platform stats', error: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompany,
  getMyCompany,
  updateMyCompany,
  updateCompanyStatus,
  getPlatformStats,
};
