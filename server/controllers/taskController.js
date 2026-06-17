const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create a Task (Company Admin and Manager only)
// @route   POST /api/tasks
// @access  Private (company_admin, manager)
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignee, priority, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ success: false, message: 'Please provide task title and project' });
    }

    // Verify project belongs to same company
    const projectRecord = await Project.findOne({ _id: project, company: req.user.company });
    if (!projectRecord) {
      return res.status(400).json({ success: false, message: 'Invalid project ID or project not in company workspace' });
    }

    if (assignee) {
      const assigneeUser = await User.findOne({ _id: assignee, company: req.user.company });
      if (!assigneeUser) {
        return res.status(400).json({ success: false, message: 'Assignee must belong to the same company workspace' });
      }
    }

    const task = await Task.create({
      title,
      description: description || '',
      project,
      company: req.user.company,
      assignee: assignee || null,
      reporter: req.user.id,
      priority: priority || 'medium',
      status: 'to_do',
      dueDate: dueDate || null,
    });

    await createNotification(
      {
        company: req.user.company,
        recipient: assignee || null,
        type: 'task',
        title: 'Task assigned',
        message: `${task.title} was added to ${projectRecord.name}.`,
        metadata: { taskId: task._id, projectId: projectRecord._id },
      },
      req.app.get('io')
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create Task error:', error);
    res.status(500).json({ success: false, message: 'Server error during task creation', error: error.message });
  }
};

// @desc    Get Tasks (Employees get their own; Admins/Managers get all scoped by company)
// @route   GET /api/tasks
// @access  Private (company_admin, manager, employee)
const getTasks = async (req, res) => {
  try {
    let query = { company: req.user.company };

    if (req.user.role === 'employee') {
      // Employees can only see tasks assigned to them
      query.assignee = req.user.id;
    } else {
      // Optional query filters for admins and managers
      if (req.query.project) query.project = req.query.project;
      if (req.query.assignee) query.assignee = req.query.assignee;
      if (req.query.status) query.status = req.query.status;
    }

    const tasks = await Task.find(query)
      .populate('project', 'name status')
      .populate('assignee', 'name email')
      .populate('reporter', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Get Tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tasks', error: error.message });
  }
};

// @desc    Update Task details or status
// @route   PUT /api/tasks/:id
// @access  Private (company_admin, manager, employee)
const updateTask = async (req, res) => {
  try {
    const { title, description, assignee, priority, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Workspace scoping check
    if (task.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update tasks from other company workspaces' });
    }

    // Role-based editing rules
    if (req.user.role === 'employee') {
      // Employees can only update task status (e.g. check off as completed)
      if (task.assignee && task.assignee.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update tasks assigned to other employees' });
      }
      if (status) {
        task.status = status;
      }
    } else {
      // Admins and Managers can edit everything
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignee !== undefined) task.assignee = assignee || null;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (dueDate !== undefined) task.dueDate = dueDate || null;
    }

    await task.save();

    if (status || assignee !== undefined) {
      await createNotification(
        {
          company: req.user.company,
          recipient: task.assignee || null,
          type: 'task',
          title: status ? 'Task status updated' : 'Task reassigned',
          message: `${task.title} is now ${task.status.replace(/_/g, ' ')}.`,
          metadata: { taskId: task._id },
        },
        req.app.get('io')
      );
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error('Update Task error:', error);
    res.status(500).json({ success: false, message: 'Server error updating task', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
};
