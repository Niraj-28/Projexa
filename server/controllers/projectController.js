const Project = require('../models/Project');
const { createNotification } = require('./notificationController');

// @desc    Create a Project (Company Admin only)
// @route   POST /api/projects
// @access  Private (company_admin)
const createProject = async (req, res) => {
  try {
    const { name, description, manager, deadline, status } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a project name' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      company: req.user.company,
      manager: manager || null,
      deadline: deadline || null,
      status: status || 'Planning',
    });

    await createNotification(
      {
        company: req.user.company,
        recipient: manager || null,
        type: 'project',
        title: 'Project created',
        message: `${project.name} was added to the workspace.`,
        metadata: { projectId: project._id },
      },
      req.app.get('io')
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Create Project error:', error);
    res.status(500).json({ success: false, message: 'Server error during project creation', error: error.message });
  }
};

// @desc    Get Projects (Admins and Managers)
// @route   GET /api/projects
// @access  Private (company_admin, manager)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ company: req.user.company }).populate('manager', 'name email');
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('Get Projects error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching projects', error: error.message });
  }
};

// @desc    Get a single Project
// @route   GET /api/projects/:id
// @access  Private (company_admin, manager)
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).populate('manager', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Get Project error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching project', error: error.message });
  }
};

// @desc    Update a Project
// @route   PUT /api/projects/:id
// @access  Private (company_admin, manager)
const updateProject = async (req, res) => {
  try {
    const { name, description, manager, deadline, status } = req.body;
    const project = await Project.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (manager !== undefined) project.manager = manager || null;
    if (deadline !== undefined) project.deadline = deadline || null;
    if (status) project.status = status;

    await project.save();

    await createNotification(
      {
        company: req.user.company,
        recipient: project.manager || null,
        type: 'project',
        title: 'Project updated',
        message: `${project.name} details were updated.`,
        metadata: { projectId: project._id },
      },
      req.app.get('io')
    );

    res.status(200).json({ success: true, message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Update Project error:', error);
    res.status(500).json({ success: false, message: 'Server error updating project', error: error.message });
  }
};

const getProjectsReport = async (req, res) => {
  try {
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const totalProjects = await Project.countDocuments({ company: companyId });
    const planningProjects = await Project.countDocuments({ company: companyId, status: 'Planning' });
    const activeProjects = await Project.countDocuments({ company: companyId, status: 'Active' });
    const completedProjects = await Project.countDocuments({ company: companyId, status: 'Completed' });
    const onHoldProjects = await Project.countDocuments({ company: companyId, status: 'On Hold' });

    res.status(200).json({
      success: true,
      report: {
        totalProjects,
        planningProjects,
        activeProjects,
        completedProjects,
        onHoldProjects,
      },
    });
  } catch (error) {
    console.error('Projects report error:', error);
    res.status(500).json({ success: false, message: 'Server error during projects report generation', error: error.message });
  }
};

const exportProjectsCSV = async (req, res) => {
  try {
    const { convertToCSV } = require('../utils/csvHelper');
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'User does not belong to a company workspace' });
    }

    const projects = await Project.find({ company: companyId }).populate('manager', 'name email');
    const data = projects.map((p) => ({
      ProjectName: p.name,
      Description: p.description || 'N/A',
      Manager: p.manager?.name || 'Unassigned',
      Deadline: p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A',
      Status: p.status,
      CreatedAt: new Date(p.createdAt).toLocaleDateString(),
    }));

    const csvContent = convertToCSV(data, ['ProjectName', 'Description', 'Manager', 'Deadline', 'Status', 'CreatedAt']);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=projects_report.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export projects CSV error:', error);
    res.status(500).json({ success: false, message: 'Server error during CSV export', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  getProjectsReport,
  exportProjectsCSV,
};
