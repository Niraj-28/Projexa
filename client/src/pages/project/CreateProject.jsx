import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    deadline: '',
    status: 'Planning',
  });

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        if (res.data && res.data.success) {
          const workspaceManagers = res.data.users.filter(u => u.role === 'manager' || u.role === 'company_admin');
          setManagers(workspaceManagers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
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

      const res = await api.post('/projects', payload);
      if (res.data && res.data.success) {
        toast.success('Project created successfully!');
        navigate('/projects');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/projects')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-heading">Create Project</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Launch a new sprint scope and define deadlines.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#64748B] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Project Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. WorkArena Frontend Integration"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Description</label>
            <textarea
              name="description"
              placeholder="Provide brief sprint rules..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Lead Manager</label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
              >
                <option value="">Select Lead</option>
                {managers.map(mgr => (
                  <option key={mgr._id} value={mgr._id}>{mgr.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#64748B] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Initial Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#5A42EC] hover:bg-[#4831D4] hover:scale-[1.01] active:scale-[0.99] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-[#5A42EC]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
