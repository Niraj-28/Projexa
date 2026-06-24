import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ListPlus, Calendar, User, Search, Loader2, AlertCircle, Clock, CheckSquare, X } from 'lucide-react';
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
        return 'bg-red-500/10 text-red-600 border border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'testing':
        return 'bg-pink-500/10 text-pink-600 border border-pink-500/20';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'to_do':
      default:
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
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
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-heading">Tasks Desk</h1>
          <p className="text-sm text-[#64748B] mt-1 font-light">Create, delegate, and monitor sprint task list.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#5A42EC] text-white hover:bg-[#4831D4] px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm transition-all cursor-pointer"
        >
          <ListPlus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F5F9] border border-[#E2E8F0] text-[13px] text-[#0F172A] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5A42EC]"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col space-y-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-[13px] text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A42EC] cursor-pointer"
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
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-[13px] text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5A42EC] cursor-pointer"
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
        <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
          <span className="text-xs">Loading sprint tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center text-[#64748B] text-xs font-light bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl">
          No tasks found matching current filters.
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0]/60 pb-3">
              <h3 className="font-bold text-[#0F172A] text-[15px] font-heading">Sprint Task Board</h3>
              <span className="text-[11px] text-[#94A3B8] font-medium">{filteredTasks.length} Active Items</span>
            </div>

            <div className="divide-y divide-[#E2E8F0]/40">
              {filteredTasks.map((task) => (
                <div key={task._id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-[#64748B] hover-row -mx-6 px-6 transition-colors">

                  {/* Task details */}
                  <div className="space-y-1.5 flex-grow max-w-xl">
                    <div className="flex items-start gap-2.5">
                      <p className="font-bold text-[#0F172A] text-sm leading-snug">{task.title}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-[#94A3B8] text-xs leading-relaxed line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#94A3B8] font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <span className="text-[#5A42EC] bg-[#111111]/5 border border-[#5A42EC]/10 px-2 py-0.5 rounded-full text-[9px] font-semibold">
                          {task.project?.name || 'No Project'}
                        </span>
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="text-[#94A3B8] font-normal">Reporter: {task.reporter?.name || 'System'}</span>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center flex-wrap gap-4">
                    {/* Inline Assignee Changer */}
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#94A3B8]" />
                      <select
                        value={task.assignee?._id || ''}
                        onChange={(e) => handleUpdateTaskAssignee(task._id, e.target.value)}
                        className="bg-[#F4F5F9] border border-[#E2E8F0] text-[11px] text-[#0F172A] rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer font-medium"
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
                        className={`text-[11px] font-bold rounded-full px-3 py-1.5 focus:outline-none cursor-pointer transition-colors ${getStatusBadgeClass(task.status)}`}
                      >
                        <option value="to_do">TO DO</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="testing">TESTING</option>
                        <option value="completed">COMPLETED</option>
                      </select>
                    </div>

                    {/* Details / Edit Links */}
                    <div className="flex items-center space-x-3 text-xs pl-2.5 border-l border-[#E2E8F0]">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="text-[#64748B] hover:text-[#0F172A] font-bold cursor-pointer transition-colors"
                      >
                        Details
                      </Link>
                      {(user?.role === 'company_admin' || user?.role === 'manager') && (
                        <Link
                          to={`/tasks/edit/${task._id}`}
                          className="text-[#5A42EC] hover:text-[#4831D4] font-bold cursor-pointer transition-colors"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm modal-backdrop-animate">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh] overflow-hidden relative border border-slate-100 modal-card-animate">
            {/* Top gradient line */}
            <div className="h-[4px] bg-[#5A42EC] shrink-0"></div>

            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-[#0F172A] text-base tracking-tight font-heading">Create Sprint Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto min-h-0 flex-1 p-6 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A42EC] mr-1.5 align-middle"></span>Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Implement user dashboard widgets"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A42EC] mr-1.5 align-middle"></span>Description
                </label>
                <textarea
                  name="description"
                  placeholder="Provide checklist or implementation specs..."
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A42EC] mr-1.5 align-middle"></span>Project *
                  </label>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A42EC] mr-1.5 align-middle"></span>Assignee
                  </label>
                  <select
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
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
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A42EC] mr-1.5 align-middle"></span>Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A42EC] mr-1.5 align-middle"></span>Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#64748B] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:scale-[1.01] active:scale-[0.99] py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-grow bg-[#5A42EC] hover:bg-[#4831D4] hover:scale-[1.01] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm shadow-[#5A42EC]/10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Task</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TaskList;


