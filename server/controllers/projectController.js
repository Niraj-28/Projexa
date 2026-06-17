const Project = require('../models/Project');

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

module.exports = {
  createProject,
  getProjects,
};
