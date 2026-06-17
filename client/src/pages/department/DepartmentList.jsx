import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Network, PlusCircle, Users, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentList = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments');
      if (response.data && response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error('Fetch departments failed:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
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
      const response = await api.post('/departments', formData);
      if (response.data && response.data.success) {
        toast.success('Department created successfully!');
        setFormData({ name: '', code: '' });
        setShowAddModal(false);
        fetchDepartments();
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Workspace Departments</h1>
          <p className="text-xs text-[#B5B5B5] mt-1 font-light">Organize employees and projects into logical divisions.</p>
        </div>
        
        {user?.role === 'company_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-white text-[#131313] hover:bg-[#B5B5B5] px-4 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-4 flex items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#646464]" />
          <input
            type="text"
            placeholder="Search departments by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#B5B5B5]"
          />
        </div>
      </div>

      {/* Department Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-xs">Loading departments...</span>
        </div>
      ) : filteredDeps.length === 0 ? (
        <div className="p-12 text-center text-[#B5B5B5] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          No departments registered in this company workspace yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeps.map((d) => (
            <div key={d._id} className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-3 hover:border-[#3C3C3C] transition-all">
              <div className="flex justify-between items-center">
                <Network className="h-6 w-6 text-[#B5B5B5]" />
                <span className="font-mono text-[10px] text-[#646464] font-bold">{d.code}</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mt-1">{d.name}</h3>
                <p className="text-[10px] text-[#646464] mt-0.5 font-light">
                  Manager: {d.manager?.name || 'Unassigned'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#131313] border border-[#1C1C1C] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-[#1C1C1C] flex justify-between items-center">
              <h3 className="font-semibold text-white text-sm">Add New Department</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#646464] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Department Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Engineering"
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
                  placeholder="e.g. ENG"
                  value={formData.code}
                  onChange={handleChange}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none uppercase"
                  required
                />
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
                  {submitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
