import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    deadline: '',
    status: 'Planning',
  });

  useEffect(() => {
    const fetchProjectAndManagers = async () => {
      try {
        setLoading(true);
        const [projRes, usersRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get('/users')
        ]);
        if (projRes.data && projRes.data.success) {
          const target = projRes.data.project;
          setFormData({
            name: target.name,
            description: target.description || '',
            manager: target.manager?._id || '',
            deadline: target.deadline ? target.deadline.split('T')[0] : '',
            status: target.status,
          });
        }
        if (usersRes.data && usersRes.data.success) {
          const workspaceManagers = usersRes.data.users.filter(u => u.role === 'manager' || u.role === 'company_admin');
          setManagers(workspaceManagers);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndManagers();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put(`/projects/${id}`, formData);
      if (res.data && res.data.success) {
        toast.success('Project settings updated');
        navigate('/projects');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-xs">Loading project details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/projects')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Edit Project</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light font-sans">Modify milestones and details.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#598392] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Project Lead</label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none pl-2 bg-[#F8FAFC]"
              >
                <option value="">Select Lead</option>
                {managers.map(mgr => (
                  <option key={mgr._id} value={mgr._id}>{mgr.name} ({mgr.role.replace('_', ' ')})</option>
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
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#598392] rounded-lg p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
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
            className="w-full bg-[#124559] hover:bg-[#01161E] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
