import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState(false);
  const [createdTempInfo, setCreatedTempInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    role: 'employee',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return toast.error('Name and Email are required.');
    }

    try {
      setSubmitting(true);
      let endpoint = formData.role === 'manager' ? '/users/create-manager' : '/users/create-employee';
      
      const payload = {
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        department: formData.department || undefined,
        phone: formData.phone || undefined,
        joiningDate: formData.joiningDate || undefined
      };

      const response = await api.post(endpoint, payload);
      if (response.data && response.data.success) {
        toast.success(`${formData.role === 'manager' ? 'Manager' : 'Employee'} created successfully!`);
        setCreatedTempInfo({
          email: formData.email,
          password: response.data.tempPassword || 'Temp@123',
        });
      }
    } catch (error) {
      console.error('Create member failed:', error);
      toast.error(error.response?.data?.message || 'Failed to create member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPassword = () => {
    if (!createdTempInfo) return;
    const textToCopy = `Welcome to WorkArena\nEmail: ${createdTempInfo.email}\nPassword: ${createdTempInfo.password}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    toast.success('Credentials copied to clipboard!');
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/employees')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Onboard Staff</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light">Create credentials for a new manager or employee.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        {createdTempInfo ? (
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-xl flex items-start gap-3 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Credentials Generated Successfully</p>
                <p className="font-light leading-relaxed">
                  Please copy and share these temporary credentials with the employee. They will be forced to update their password on their first login.
                </p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl font-mono text-xs text-[#598392] space-y-1.5">
              <p className="text-[10px] text-[#94A3B8] uppercase font-sans font-bold">Workspace Credentials</p>
              <p><span className="text-[#94A3B8]">Email:</span> {createdTempInfo.email}</p>
              <p><span className="text-[#94A3B8]">Password:</span> {createdTempInfo.password}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCopyPassword}
                className="flex-grow flex items-center justify-center gap-2 bg-[#124559] text-white hover:bg-[#01161E] py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
              >
                {copiedText ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>Copy Credentials</span>
              </button>
              <button
                onClick={() => navigate('/employees')}
                className="auth-btn-google px-6 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#598392] font-light">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Role Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="rahul@company.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Designation</label>
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Lead Developer"
                  value={formData.designation}
                  onChange={handleChange}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                />
              </div>
              {formData.role === 'employee' ? (
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#598392] rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Joining Date</label>
                  <div className="bg-[#F8FAFC]/40 border border-[#E2E8F0] text-xs text-[#94A3B8]/80 rounded-lg p-2.5 select-none leading-normal">
                    Immediate (Manager)
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#124559] hover:bg-[#01161E] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Onboarding...</span>
                </>
              ) : (
                <span>Onboard Employee</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEmployee;
