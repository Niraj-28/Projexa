import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Network, PlusCircle, Users, Search, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentList = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', manager: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const [depRes, usersRes] = await Promise.all([
        api.get('/departments'),
        api.get('/users')
      ]);
      if (depRes.data && depRes.data.success) {
        setDepartments(depRes.data.departments);
      }
      if (usersRes.data && usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
    } catch (error) {
      console.error('Fetch departments failed:', error);
      toast.error('Failed to load departments');
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
    if (!formData.name || !formData.code) {
      return toast.error('Both department Name and Code are required');
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        code: formData.code,
        manager: formData.manager || undefined
      };
      const response = await api.post('/departments', payload);
      if (response.data && response.data.success) {
        toast.success('Department created successfully!');
        setFormData({ name: '', code: '', manager: '' });
        setShowAddModal(false);
        fetchWorkspaceData();
      }
    } catch (error) {
      console.error('Create department failed:', error);
      toast.error(error.response?.data?.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDeps = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-heading">Workspace Departments</h1>
          <p className="text-sm text-[#64748B] mt-1 font-light">Organize employees and projects into logical divisions.</p>
        </div>

        {user?.role === 'company_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-[#5A42EC] text-white hover:bg-[#4831D4] px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm p-4 flex items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search departments by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4F5F9] border border-[#E2E8F0] text-[13px] text-[#0F172A] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5A42EC]"
          />
        </div>
      </div>

      {/* Department Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
          <span className="text-xs">Loading departments...</span>
        </div>
      ) : filteredDeps.length === 0 ? (
        <div className="p-12 text-center text-[#64748B] text-xs font-light bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm">
          No departments registered in this company workspace yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeps.map((d) => (
            <div key={d._id} className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-5 space-y-3 hover:border-[#E2E8F0] shadow-premium hover-card transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-9 w-9 rounded-lg bg-[#111111]/5 border border-[#5A42EC]/10 flex items-center justify-center text-[#5A42EC]">
                    <Network className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8] font-bold">{d.code}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F172A] text-sm mt-1 leading-tight font-heading">{d.name}</h3>
                  <p className="text-[10px] text-[#64748B] mt-0.5 font-medium">
                    Manager: {d.manager?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#E2E8F0]/60 flex justify-end space-x-3 text-xs">
                <Link
                  to={`/departments/${d._id}`}
                  className="text-[#64748B] hover:text-[#5A42EC] font-semibold cursor-pointer"
                >
                  Details
                </Link>
                {user?.role === 'company_admin' && (
                  <Link
                    to={`/departments/edit/${d._id}`}
                    className="text-[#0F172A] hover:text-[#5A42EC] font-semibold cursor-pointer"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm modal-backdrop-animate">
          <div className="bg-white border border-slate-100 w-full max-w-md rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh] overflow-hidden relative modal-card-animate">
            {/* Top gradient line */}
            <div className="h-[3.5px] bg-gradient-to-r from-[#5A42EC] via-[#94A3B8] to-[#E2E8F0] shrink-0"></div>

            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-[#0F172A] text-base tracking-tight font-heading">Add New Department</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto min-h-0 flex-1 p-6 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Department Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Engineering"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Department Code
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g. ENG"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 uppercase"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#5A42EC]/40 mr-1.5 align-middle"></span>Department Manager / Lead
                </label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:scale-[1.01] active:scale-[0.99] py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#5A42EC] hover:bg-[#4831D4] hover:scale-[1.01] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm shadow-[#5A42EC]/10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Department</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DepartmentList;
