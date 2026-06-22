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
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs">Loading department form...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/departments')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Edit Department</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Modify department name and code.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#B5B5B5] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Department Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Department Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none uppercase"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Department Manager / Lead</label>
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none pl-2 bg-[#131313]"
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
            className="w-full bg-white hover:bg-[#B5B5B5] text-[#131313] py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
