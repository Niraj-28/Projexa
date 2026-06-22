import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FolderGit2, FolderPlus, Clock, KanbanSquare, Search, Loader2 } from 'lucide-react';
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Active Projects</h1>
          <p className="text-xs text-[#B5B5B5] mt-1 font-light">Track milestones, deliverables, and assigned leads.</p>
        </div>

        {(user?.role === 'company_admin' || user?.role === 'manager') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-white text-[#131313] hover:bg-[#B5B5B5] px-4 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-4 flex items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#646464]" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#B5B5B5]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-xs">Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center text-[#B5B5B5] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          No projects created in this workspace yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => (
            <div key={p._id} className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4 hover:border-[#3C3C3C] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-9 w-9 rounded-lg bg-white/5 border border-[#1C1C1C] flex items-center justify-center text-[#B5B5B5]">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    p.status === 'Completed'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : p.status === 'Planning'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base leading-tight">{p.name}</h3>
                  <p className="text-[10px] text-[#646464] mt-0.5">Lead: {p.manager?.name || 'Unassigned'}</p>
                </div>
                <p className="text-xs text-[#B5B5B5] font-light leading-relaxed truncate">{p.description || 'No description provided.'}</p>
              </div>

              <div className="pt-4 border-t border-[#1C1C1C]/60 flex items-center justify-between text-[10px] text-[#646464]">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'None'}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <Link
                    to={`/projects/${p._id}`}
                    className="text-[#B5B5B5] hover:text-white font-semibold cursor-pointer"
                  >
                    Details
                  </Link>
                  {(user?.role === 'company_admin' || user?.role === 'manager') && (
                    <Link
                      to={`/projects/edit/${p._id}`}
                      className="text-white hover:text-[#B5B5B5] font-semibold cursor-pointer"
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
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#131313] border border-[#1C1C1C] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-[#1C1C1C] flex justify-between items-center">
              <h3 className="font-semibold text-white text-sm">Add New Project</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#646464] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Project Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Grayscale Redesign"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Description</label>
                <textarea
                  name="description"
                  placeholder="Provide brief sprint guidelines..."
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#646464] uppercase">Project Lead</label>
                  <select
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  >
                    <option value="">Select Lead</option>
                    {managers.map(mgr => (
                      <option key={mgr._id} value={mgr._id}>{mgr.name} ({mgr.role.replace('_', ' ')})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#646464] uppercase">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-[#B5B5B5] rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
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
                  className="flex-1 auth-btn-google text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 auth-btn-primary disabled:opacity-50 text-xs"
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
