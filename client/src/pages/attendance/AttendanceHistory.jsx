import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/attendance');
        if (res.data && res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/attendance')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Shift Clock History</h1>
            <p className="text-xs text-[#598392] mt-0.5 font-light">Comprehensive list of all logged company check-ins.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-0.5">
          <Link
            to="/attendance"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all text-[#94A3B8] hover:text-[#598392]"
          >
            Tracker
          </Link>
          <Link
            to="/attendance/history"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all bg-[#E2E8F0] text-[#01161E]"
          >
            History
          </Link>
          <Link
            to="/attendance/reports"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all text-[#94A3B8] hover:text-[#598392]"
          >
            Reports
          </Link>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
            <span className="text-xs">Loading history logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8] text-xs font-light">
            No shift logs recorded in this workspace.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF] text-[#598392] font-light">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#EFF6E0]/40 transition-all">
                    <td className="px-6 py-4 font-semibold text-[#01161E]">{log.user?.name || 'Staff'}</td>
                    <td className="px-6 py-4 font-mono">{log.date}</td>
                    <td className="px-6 py-4">{log.checkIn}</td>
                    <td className="px-6 py-4">{log.checkOut || '--'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        log.status === 'Active' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : log.status === 'Late' 
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {log.status}
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

export default AttendanceHistory;
