import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        setLoading(true);
        const [projRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/users')
        ]);
        if (projRes.data?.success) setProjects(projRes.data.projects);
        if (usersRes.data?.success) setUsers(usersRes.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectOptions();
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

      const res = await api.post('/tasks', payload);
      if (res.data && res.data.success) {
        toast.success('Task created successfully!');
        navigate('/tasks');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/tasks')} className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Create Sprint Task</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Add new deliverable card to product backlog.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#64748B] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Task Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Verify database schema indexes"
              value={formData.title}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Description</label>
            <textarea
              name="description"
              placeholder="Provide checklist or specs..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none resize-none focus:border-[#5A42EC] transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Project *</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
                required
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Assignee</label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#64748B] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#5A42EC] hover:bg-[#4831D4] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
