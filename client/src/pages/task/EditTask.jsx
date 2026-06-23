import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    status: 'to_do',
  });

  useEffect(() => {
    const fetchTaskAndUsers = async () => {
      try {
        setLoading(true);
        const [tasksRes, usersRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/users')
        ]);
        if (tasksRes.data && tasksRes.data.success) {
          const target = tasksRes.data.tasks.find(t => t._id === id);
          if (target) {
            setFormData({
              title: target.title,
              description: target.description || '',
              assignee: target.assignee?._id || '',
              dueDate: target.dueDate ? target.dueDate.split('T')[0] : '',
              priority: target.priority,
              status: target.status,
            });
          }
        }
        if (usersRes.data && usersRes.data.success) {
          setUsers(usersRes.data.users);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskAndUsers();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put(`/tasks/${id}`, formData);
      if (res.data && res.data.success) {
        toast.success('Task details updated successfully');
        navigate('/tasks');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-xs">Loading task details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/tasks')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Edit Task</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light">Modify sprint task specifications and status.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#598392] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
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
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Assignee</label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none pl-2 bg-[#F8FAFC]"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role.replace('_', ' ')})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#598392] rounded-lg p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
              >
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
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

export default EditTask;
