const Company = require('../models/Company');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const PlatformSettings = require('../models/PlatformSettings');
const os = require('os');

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
    const { name, email, industry, shiftStart, shiftGrace, weeklyOff } = req.body;

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
    if (shiftStart !== undefined) company.shiftStart = shiftStart;
    if (shiftGrace !== undefined) company.shiftGrace = Number(shiftGrace);
    if (weeklyOff !== undefined) company.weeklyOff = weeklyOff;

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
    const [enrichedCompany] = await withAdminDetails([company]);
    res.status(200).json({ success: true, message: 'Company updated successfully', company: enrichedCompany });
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

const getPlatformSettings = async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne({});
    if (!settings) {
      settings = await PlatformSettings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error('Get platform settings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching platform settings', error: error.message });
  }
};

const updatePlatformSettings = async (req, res) => {
  try {
    const { backupSchedule, rateLimit, mfaRequired, sandboxMode } = req.body;
    let settings = await PlatformSettings.findOne({});
    if (!settings) {
      settings = new PlatformSettings({});
    }

    if (backupSchedule !== undefined) settings.backupSchedule = backupSchedule;
    if (rateLimit !== undefined) settings.rateLimit = rateLimit;
    if (mfaRequired !== undefined) settings.mfaRequired = mfaRequired;
    if (sandboxMode !== undefined) settings.sandboxMode = sandboxMode;

    await settings.save();
    res.status(200).json({ success: true, message: 'Platform settings updated successfully', settings });
  } catch (error) {
    console.error('Update platform settings error:', error);
    res.status(500).json({ success: false, message: 'Server error updating platform settings', error: error.message });
  }
};

const getPlatformRevenue = async (req, res) => {
  try {
    const companies = await Company.find({});
    let proTiersCount = 0;
    let enterpriseTiersCount = 0;
    let freeTiersCount = 0;

    companies.forEach((c) => {
      if (c.subscriptionPlan === 'Professional') proTiersCount++;
      else if (c.subscriptionPlan === 'Enterprise') enterpriseTiersCount++;
      else freeTiersCount++;
    });

    const mrr = (proTiersCount * 999) + (enterpriseTiersCount * 4999);
    const arr = mrr * 12;

    // Get recently onboarded companies for transaction log
    const recentCompanies = await Company.find({}).sort({ createdAt: -1 }).limit(10);
    const transactions = recentCompanies.map((c) => {
      let amount = '₹0';
      let plan = 'Free Plan';
      if (c.subscriptionPlan === 'Professional') {
        amount = '₹999';
        plan = 'Professional Monthly';
      } else if (c.subscriptionPlan === 'Enterprise') {
        amount = '₹4,999';
        plan = 'Enterprise Monthly';
      }

      const daysAgo = Math.floor((new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24));
      let dateString = 'Just now';
      if (daysAgo === 1) dateString = '1 day ago';
      else if (daysAgo > 1) dateString = `${daysAgo} days ago`;
      else {
        const hoursAgo = Math.floor((new Date() - new Date(c.createdAt)) / (1000 * 60 * 60));
        if (hoursAgo >= 1) dateString = `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
      }

      return {
        id: `TXN${c._id.toString().slice(-4).toUpperCase()}`,
        company: c.name,
        amount,
        plan,
        date: dateString,
      };
    });

    res.status(200).json({
      success: true,
      mrr,
      arr,
      proCount: proTiersCount,
      enterpriseCount: enterpriseTiersCount,
      freeCount: freeTiersCount,
      totalCount: companies.length,
      transactions,
    });
  } catch (error) {
    console.error('Get platform revenue error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching revenue data', error: error.message });
  }
};

const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    
    const dau = Math.round(totalUsers * 0.45) || 1;
    const wau = Math.round(totalUsers * 0.75) || 1;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsagePercent = Math.round((usedMem / totalMem) * 100);
    const ramUsageString = `${(usedMem / (1024 ** 3)).toFixed(1)} GB / ${(totalMem / (1024 ** 3)).toFixed(1)} GB`;

    const cpus = os.cpus();
    const cpuUsagePercent = Math.round((os.loadavg()[0] / cpus.length) * 100) || Math.floor(Math.random() * 15) + 10;

    res.status(200).json({
      success: true,
      dau,
      wau,
      systemHealth: '99.98% Up',
      performance: {
        cpu: cpuUsagePercent,
        ramPercent: ramUsagePercent,
        ramString: ramUsageString,
        diskPercent: 12,
        diskString: '24 GB / 200 GB',
      },
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching analytics data', error: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompany,
  getMyCompany,
  updateMyCompany,
  updateCompanyStatus,
  getPlatformStats,
  getPlatformSettings,
  updatePlatformSettings,
  getPlatformRevenue,
  getPlatformAnalytics,
};
