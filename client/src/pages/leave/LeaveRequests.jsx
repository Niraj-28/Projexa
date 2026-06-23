import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CalendarRange, Loader2, Check, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Leave Request Form State (Employees)
  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Approvals view filters (Admin/Manager)
  const [statusFilter, setStatusFilter] = useState('Pending');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves');
      if (res.data && res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (error) {
      console.error('Fetch leaves failed:', error);
      toast.error('Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      return toast.error('Please fill in all leave request details.');
    }

    try {
      setSubmitting(true);
      const res = await api.post('/leaves', {
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      if (res.data && res.data.success) {
        toast.success('Leave request submitted successfully!');
        setFormData({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
        fetchLeaves();
      }
    } catch (error) {
      console.error('Submit leave failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (leaveId, decision) => {
    try {
      const res = await api.put(`/leaves/${leaveId}`, { status: decision });
      if (res.data && res.data.success) {
        toast.success(`Leave request ${decision.toLowerCase()} successfully`);
        // Update local state
        setLeaves(prev => prev.map(item => item._id === leaveId ? { ...item, status: decision, approvedBy: { name: user.name } } : item));
      }
    } catch (error) {
      console.error('Update leave status failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update request');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    }
  };

  const isEmployee = user?.role === 'employee';

  if (!isEmployee) {
    // ADMIN / MANAGER APPROVALS VIEW
    const filteredLeaves = leaves.filter(item => statusFilter === 'all' || item.status === statusFilter);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Leave Approvals Desk</h1>
            <p className="text-xs text-[#598392] mt-1 font-light">Review and manage company employees leave applications.</p>
          </div>

          <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-0.5">
            {['Pending', 'Approved', 'Rejected', 'all'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-[#E2E8F0] text-[#01161E]' 
                    : 'text-[#94A3B8] hover:text-[#598392]'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
            <span className="text-xs">Loading leave requests...</span>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="p-12 text-center text-[#598392] text-xs font-light bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
            No {statusFilter !== 'all' ? statusFilter.toLowerCase() : ''} leave requests found.
          </div>
        ) : (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFFFFF] text-[#598392] font-light">
                  {filteredLeaves.map((req) => (
                    <tr key={req._id} className="hover:bg-[#EFF6E0]/40 transition-all">
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#01161E]">{req.user?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-[#94A3B8]">{req.user?.designation || 'Staff'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#01161E]">{req.type}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{req.reason}</td>
                      <td className="px-6 py-4 font-mono text-[10px]">
                        {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusBadgeClass(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(req._id, 'Approved')}
                              className="p-1.5 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition cursor-pointer"
                              title="Approve"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                              className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                              title="Reject"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8] font-medium italic">
                            By {req.approvedBy?.name || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // EMPLOYEE VIEW (Submit & Track)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Submit Form */}
      <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 h-max">
        <div>
          <h2 className="text-base font-semibold text-[#01161E] tracking-tight">Request Leave</h2>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">Submit a formal request for manager verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Leave Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none focus:border-[#124559]"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#598392] rounded-lg p-2.5 focus:outline-none focus:border-[#124559]"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#598392] rounded-lg p-2.5 focus:outline-none focus:border-[#124559]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Reason</label>
            <textarea
              name="reason"
              placeholder="Provide a brief explanation..."
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none resize-none focus:border-[#124559]"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#124559] hover:bg-[#01161E] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Request</span>
            )}
          </button>
        </form>
      </div>

      {/* Right Requests History */}
      <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[#01161E] tracking-tight">Request History</h2>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">Track review decisions and status</p>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#01161E]" />
            <span className="text-xs">Loading request history...</span>
          </div>
        ) : leaves.length === 0 ? (
          <p className="text-xs text-[#598392] text-center py-12 font-light">No leave applications logged yet.</p>
        ) : (
          <div className="divide-y divide-[#FFFFFF]">
            {leaves.map((req) => (
              <div key={req._id} className="py-4 flex items-center justify-between gap-4 text-xs font-light text-[#598392]">
                <div className="space-y-1">
                  <p className="font-semibold text-[#01161E]">{req.type}</p>
                  <p className="text-[10px] text-[#94A3B8]">{req.reason}</p>
                  <p className="text-[10px] text-[#598392] font-mono">
                    {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                  {req.approvedBy && (
                    <span className="text-[9px] text-[#94A3B8] italic">
                      Reviewed by {req.approvedBy.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
