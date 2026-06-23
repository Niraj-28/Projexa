import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Search, Shield, User, Smartphone, Calendar, AlertCircle, Copy, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [createdTempInfo, setCreatedTempInfo] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    role: 'employee', // 'manager' or 'employee'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      if (response.data && response.data.success) {
        setMembers(response.data.users);
      }
    } catch (error) {
      console.error('Fetch members failed:', error);
      toast.error('Failed to load employee list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

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
        
        // Reset form except role
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          designation: '',
          joiningDate: '',
          role: 'employee',
        });
        
        fetchMembers();
      }
    } catch (error) {
      console.error('Create member failed:', error);
      toast.error(error.response?.data?.message || 'Failed to create member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this member?')) return;
    
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.data && response.data.success) {
        toast.success('Member deactivated successfully');
        fetchMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate member');
    }
  };

  const handleActivate = async (id) => {
    if (!window.confirm('Are you sure you want to reactivate this member?')) return;
    
    try {
      const response = await api.put(`/users/${id}`, { isActive: true });
      if (response.data && response.data.success) {
        toast.success('Member reactivated successfully');
        fetchMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reactivate member');
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

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Company Employees</h1>
          <p className="text-sm text-[#598392] mt-1 font-light">Manage and onboard managers and employees into your workspace.</p>
        </div>
        
        {currentUser?.role === 'company_admin' || currentUser?.role === 'manager' ? (
          <button
            onClick={() => {
              setCreatedTempInfo(null);
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 bg-[#124559] text-white hover:bg-[#01161E] px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        ) : null}
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl">
          <span className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider">Total Staff</span>
          <p className="text-2xl font-medium text-[#01161E] mt-1">{members.length}</p>
        </div>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-xl">
          <span className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider">Managers</span>
          <p className="text-2xl font-medium text-[#01161E] mt-1">
            {members.filter((m) => m.role === 'manager').length}
          </p>
        </div>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl">
          <span className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider">Active Status</span>
          <p className="text-2xl font-medium text-green-400 mt-1">
            {members.filter((m) => m.isActive).length} / {members.length}
          </p>
        </div>
      </div>

      {/* Filters and List */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#01161E] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#124559]"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
            <span className="text-xs">Loading employees...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-[#598392] text-xs">
            No employees found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF]">
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-[#EFF6E0]/40 transition-all">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#01161E] text-sm">{member.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{member.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        member.role === 'company_admin'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : member.role === 'manager'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {member.role === 'company_admin' && <Shield className="h-2.5 w-2.5" />}
                        {member.role === 'manager' && <Shield className="h-2.5 w-2.5" />}
                        {member.role === 'employee' && <User className="h-2.5 w-2.5" />}
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#598392] font-light">
                      {member.designation || 'Staff'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        member.isActive
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {member.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          to={`/employees/${member._id}`}
                          className="text-[#598392] hover:text-[#01161E] font-semibold cursor-pointer"
                        >
                          Details
                        </Link>
                        {member._id !== currentUser.id && (
                          <>
                            {(currentUser?.role === 'company_admin' || (currentUser?.role === 'manager' && member.role === 'employee')) && (
                              <Link
                                to={`/employees/edit/${member._id}`}
                                className="text-[#01161E] hover:text-[#598392] font-semibold cursor-pointer"
                              >
                                Edit
                              </Link>
                            )}
                            {currentUser?.role === 'company_admin' && (
                              member.isActive ? (
                                <button
                                  onClick={() => handleDeactivate(member._id)}
                                  className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(member._id)}
                                  className="text-green-400 hover:text-green-300 font-semibold cursor-pointer"
                                >
                                  Activate
                                </button>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboarding Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="font-semibold text-[#01161E] text-base">Onboard New Team Member</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setCreatedTempInfo(null);
                }}
                className="text-[#94A3B8] hover:text-[#01161E] text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              {createdTempInfo ? (
                /* Success Temporary Password Screen */
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold">Copy Temporary Credentials</p>
                      <p className="font-light leading-relaxed">
                        This employee has been created with temporary login credentials. Please copy and share these credentials with them.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl font-mono text-xs text-[#598392] relative space-y-1.5">
                    <p className="text-[10px] text-[#94A3B8] uppercase font-sans font-bold">Welcome to WorkArena</p>
                    <p><span className="text-[#94A3B8]">Email:</span> {createdTempInfo.email}</p>
                    <p><span className="text-[#94A3B8]">Password:</span> {createdTempInfo.password}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyPassword}
                      className="flex-grow flex items-center justify-center gap-2 bg-[#124559] text-white hover:bg-[#01161E] py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
                    >
                      {copiedText ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>Copy Credentials</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setCreatedTempInfo(null);
                      }}
                      className="auth-btn-google px-4"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Add Member Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Role Type</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                      >
                        {currentUser?.role === 'company_admin' && (
                          <option value="manager">Manager</option>
                        )}
                        <option value="employee">Employee</option>
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
                        placeholder="e.g. Lead Designer"
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
                      {submitting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Onboard Staff</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
