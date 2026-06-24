import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FolderGit2, FolderPlus, Clock, KanbanSquare, Search, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    deadline: '',
    status: 'Planning',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const projRes = await api.get('/projects');
      if (projRes.data && projRes.data.success) {
        setProjects(projRes.data.projects);
      }

      // Fetch users list to populate manager dropdown options
      const usersRes = await api.get('/users');
      if (usersRes.data && usersRes.data.success) {
        const workspaceManagers = usersRes.data.users.filter(u => u.role === 'manager' || u.role === 'company_admin');
        setManagers(workspaceManagers);
      }
    } catch (error) {
      console.error('Fetch workspace data failed:', error);
      toast.error('Failed to load projects');
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
    if (!formData.name) {
      return toast.error('Project Name is required');
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        manager: formData.manager || undefined,
        deadline: formData.deadline || undefined,
        status: formData.status,
      };

      const response = await api.post('/projects', payload);
      if (response.data && response.data.success) {
        toast.success('Project created successfully!');
        setFormData({
          name: '',
          description: '',
          manager: '',
          deadline: '',
          status: 'Planning',
        });
        setShowAddModal(false);
        fetchWorkspaceData();
      }
    } catch (error) {
      console.error('Create project failed:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-heading">Active Projects</h1>
          <p className="text-sm text-[#64748B] mt-1 font-light">Track milestones, deliverables, and assigned leads.</p>
        </div>

        {(user?.role === 'company_admin' || user?.role === 'manager') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-[#5A42EC] text-white hover:bg-[#4831D4] px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm p-4 flex items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F5F9] border border-[#E2E8F0] text-[13px] text-[#0F172A] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5A42EC]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
          <span className="text-xs">Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center text-[#64748B] text-sm font-light bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm">
          No projects created in this workspace yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => (
            <div key={p._id} className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-4 hover:border-[#E2E8F0] shadow-premium hover-card transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-9 w-9 rounded-lg bg-[#111111]/5 border border-[#5A42EC]/10 flex items-center justify-center text-[#5A42EC]">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <span className={`badge-status ${p.status === 'Completed'
                      ? 'badge-success'
                      : p.status === 'Planning'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0"></span>
                    {p.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F172A] text-base leading-tight font-heading">{p.name}</h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">Lead: {p.manager?.name || 'Unassigned'}</p>
                </div>
                <p className="text-sm text-[#64748B] font-light leading-relaxed truncate">{p.description || 'No description provided.'}</p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0]/60 flex items-center justify-between text-[11px] text-[#94A3B8]">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'None'}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <Link
                    to={`/projects/${p._id}`}
                    className="text-[#64748B] hover:text-[#5A42EC] font-semibold cursor-pointer"
                  >
                    Details
                  </Link>
                  {(user?.role === 'company_admin' || user?.role === 'manager') && (
                    <Link
                      to={`/projects/edit/${p._id}`}
                      className="text-[#0F172A] hover:text-[#5A42EC] font-semibold cursor-pointer"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm modal-backdrop-animate">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh] overflow-hidden relative border border-slate-100 modal-card-animate">
            {/* Top gradient line */}
            <div className="h-[3.5px] bg-gradient-to-r from-[#5A42EC] via-[#94A3B8] to-[#E2E8F0] shrink-0"></div>

            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-[#0F172A] text-base tracking-tight font-heading">Add New Project</h3>
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
                  <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Grayscale Redesign"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Description
                </label>
                <textarea
                  name="description"
                  placeholder="Provide brief sprint guidelines..."
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Project Lead
                  </label>
                  <select
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Select Lead</option>
                    {managers.map(mgr => (
                      <option key={mgr._id} value={mgr._id}>{mgr.name} ({mgr.role.replace('_', ' ')})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#64748B] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Initial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
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
                  className="flex-1 bg-[#5A42EC] hover:bg-[#4831D4] hover:scale-[1.01] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm shadow-[#5A42EC]/10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Project</span>
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

export default ProjectList;
