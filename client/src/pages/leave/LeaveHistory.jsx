import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LeaveHistory = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const res = await api.get('/leaves');
        if (res.data && res.data.success) {
          setLeaves(res.data.leaves);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load leave history');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/leaves')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Leave Log History</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Comprehensive list of all past leave applications.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
            <span className="text-xs">Loading leave history...</span>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8] text-xs font-light">
            No leaves recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F5F9] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F5F9] text-[#64748B] font-light">
                {leaves.map((req) => (
                  <tr key={req._id} className="hover:bg-[#F4F5F9] transition-all">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A]">{req.user?.name || 'Staff'}</p>
                      <p className="text-[10px] text-[#94A3B8]">{req.user?.designation}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">{req.type}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{req.reason}</td>
                    <td className="px-6 py-4 font-mono text-[10px]">
                      {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;
