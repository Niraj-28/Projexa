import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', code: '', manager: '' });

  useEffect(() => {
    const fetchDepAndUsers = async () => {
      try {
        setLoading(true);
        const [depRes, usersRes] = await Promise.all([
          api.get(`/departments/${id}`),
          api.get('/users')
        ]);
        if (depRes.data && depRes.data.success) {
          const target = depRes.data.department;
          setFormData({
            name: target.name,
            code: target.code,
            manager: target.manager?._id || ''
          });
        }
        if (usersRes.data && usersRes.data.success) {
          setUsers(usersRes.data.users);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load department data');
      } finally {
        setLoading(false);
      }
    };
    fetchDepAndUsers();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        code: formData.code,
        manager: formData.manager || null
      };
      const res = await api.put(`/departments/${id}`, payload);
      if (res.data && res.data.success) {
        toast.success('Department updated successfully');
        navigate('/departments');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update department');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
        <span className="text-xs">Loading department form...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/departments')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-heading">Edit Department</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Modify department name and code.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#64748B] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Department Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Department Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 uppercase"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Department Manager / Lead</label>
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl p-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#5A42EC] hover:bg-[#4831D4] hover:scale-[1.01] active:scale-[0.99] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-[#5A42EC]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
