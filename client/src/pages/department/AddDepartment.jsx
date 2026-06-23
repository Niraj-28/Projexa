import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddDepartment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      return toast.error('Both department Name and Code are required');
    }

    try {
      setSubmitting(true);
      const response = await api.post('/departments', formData);
      if (response.data && response.data.success) {
        toast.success('Department created successfully!');
        navigate('/departments');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/departments')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Add Department</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light">Create a new department unit inside your workspace.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#598392] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Department Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Engineering"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Department Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g. ENG"
              value={formData.code}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#124559] hover:bg-[#01161E] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Creating...' : 'Create Department'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
