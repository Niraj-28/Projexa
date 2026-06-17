import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ListPlus, Calendar, User, Search, Loader2, AlertCircle, Clock, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/users'),
      ]);

      if (tasksRes.data && tasksRes.data.success) {
        setTasks(tasksRes.data.tasks);
      }
      if (projRes.data && projRes.data.success) {
        setProjects(projRes.data.projects);
      }
      if (usersRes.data && usersRes.data.success) {
        // Only allow assigning to managers or employees of this company
        setUsers(usersRes.data.users);
      }
    } catch (error) {
      console.error('Fetch workspace data failed:', error);
      toast.error('Failed to load workspace task desk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.project) {
      return toast.error('Task title and project are required');
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        project: formData.project,
        assignee: formData.assignee || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      };

      const response = await api.post('/tasks', payload);
      if (response.data && response.data.success) {
        toast.success('Task created and assigned successfully!');
        setFormData({
          title: '',
          description: '',
          project: '',
          assignee: '',
          priority: 'medium',
          dueDate: '',
        });
        setShowAddModal(false);
        fetchWorkspaceData();
      }
    } catch (error) {
      console.error('Create task failed:', error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      if (response.data && response.data.success) {
        toast.success('Task status updated');
        // Update local tasks state
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleUpdateTaskAssignee = async (taskId, newAssigneeId) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { assignee: newAssigneeId || null });
      if (response.data && response.data.success) {
        toast.success('Task assignee updated');
        const assignedUser = users.find(u => u._id === newAssigneeId);
        setTasks(prev => prev.map(t => t._id === taskId ? { 
          ...t, 
          assignee: assignedUser ? { _id: assignedUser._id, name: assignedUser.name, email: assignedUser.email } : null 
        } : t));
      }
    } catch (error) {
      console.error('Failed to update task assignee:', error);
      toast.error(error.response?.data?.message || 'Failed to update assignee');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesProject = projectFilter === 'all' || (t.project && t.project._id === projectFilter);

    return matchesSearch && matchesStatus && matchesProject;
  });

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'high':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';
    }
  };

  const formatStatus = (s) => {
    return s.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Tasks Desk</h1>
          <p className="text-xs text-[#B5B5B5] mt-1 font-light">Create, delegate, and monitor sprint task list.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-white text-[#131313] hover:bg-[#B5B5B5] px-4 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
        >
          <ListPlus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#646464]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#B5B5B5]"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col space-y-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-[#B5B5B5] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B5B5B5] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="to_do">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-[#B5B5B5] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B5B5B5] cursor-pointer"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-xs">Loading sprint tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center text-[#B5B5B5] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          No tasks found matching current filters.
        </div>
      ) : (
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
              <h3 className="font-semibold text-white text-sm">Sprint Task Board</h3>
              <span className="text-[10px] text-[#646464] font-medium">{filteredTasks.length} Active Items</span>
            </div>

            <div className="divide-y divide-[#1C1C1C]">
              {filteredTasks.map((task) => (
                <div key={task._id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-light text-[#B5B5B5]">
                  
                  {/* Task details */}
                  <div className="space-y-1.5 flex-grow max-w-xl">
                    <div className="flex items-start gap-2.5">
                      <p className="font-medium text-white text-sm leading-snug">{task.title}</p>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-[#646464] text-xs leading-relaxed line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#646464] font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <span className="text-white bg-[#1C1C1C] border border-[#3C3C3C] px-1.5 py-0.5 rounded text-[9px]">
                          {task.project?.name || 'No Project'}
                        </span>
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="text-[#646464] font-light">Reporter: {task.reporter?.name || 'System'}</span>
                    </div>
                  </div>
                  
                  {/* Quick Controls */}
                  <div className="flex items-center flex-wrap gap-4">
                    {/* Inline Assignee Changer */}
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#646464]" />
                      <select
                        value={task.assignee?._id || ''}
                        onChange={(e) => handleUpdateTaskAssignee(task._id, e.target.value)}
                        className="bg-[#0D0D0D] border border-[#1C1C1C] text-[11px] text-white rounded px-2 py-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Inline Status Changer */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                        className="bg-[#0D0D0D] border border-[#1C1C1C] text-[11px] font-semibold text-[#B5B5B5] rounded px-2 py-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="to_do">TO DO</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="testing">TESTING</option>
                        <option value="completed">COMPLETED</option>
                      </select>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#131313] border border-[#1C1C1C] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-[#1C1C1C] flex justify-between items-center">
              <h3 className="font-semibold text-white text-sm">Create Sprint Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#646464] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Task Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Implement user dashboard widgets"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Description</label>
                <textarea
                  name="description"
                  placeholder="Provide checklist or implementation specs..."
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#646464] uppercase">Project *</label>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#646464] uppercase">Assignee</label>
                  <select
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleChange}
                    className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  >
                    <option value="">Assign Later</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role.replace('_', ' ')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#646464] uppercase">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#646464] uppercase">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-[#B5B5B5] rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 auth-btn-google text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 auth-btn-primary disabled:opacity-50 text-xs"
                >
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

