import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceTracker = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance');
      if (res.data && res.data.success) {
        setLogs(res.data.logs);

        // Check if there is an active check-in today (today's log without checkOut time)
        const today = new Date().toISOString().split('T')[0];
        const activeTodayLog = res.data.logs.find(log => log.date === today && !log.checkOut);

        setCheckedIn(!!activeTodayLog);
      }
    } catch (error) {
      console.error('Failed to load attendance logs:', error);
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCheckInOut = async () => {
    try {
      setActionLoading(true);
      if (!checkedIn) {
        // Perform Check-in
        const res = await api.post('/attendance/check-in');
        if (res.data && res.data.success) {
          toast.success('Successfully checked in! Have a great shift.');
          setCheckedIn(true);
          fetchLogs();
        }
      } else {
        // Perform Check-out
        const res = await api.post('/attendance/check-out');
        if (res.data && res.data.success) {
          toast.success('Successfully checked out! See you tomorrow.');
          setCheckedIn(false);
          fetchLogs();
        }
      }
    } catch (error) {
      console.error('Check-in/out failed:', error);
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-heading">Attendance Tracker</h1>
          <p className="text-xs text-[#64748B] mt-1 font-light font-sans">Verify active shifts, check in/out, and review attendance logs.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl p-1">
          <Link
            to="/attendance"
            className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-[#5A42EC] shadow-sm"
          >
            Tracker
          </Link>
          <Link
            to="/attendance/history"
            className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-white/40"
          >
            History
          </Link>
          <Link
            to="/attendance/reports"
            className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-white/40"
          >
            Reports
          </Link>
        </div>
      </div>

      {/* Clock In Widget */}
      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl border ${checkedIn ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A] text-base font-heading">Shift Status: {checkedIn ? 'Active' : 'Inactive'}</h3>
            <p className="text-xs text-[#64748B] font-light">Log your check-in time for daily verification.</p>
          </div>
        </div>

        <button
          onClick={handleCheckInOut}
          disabled={actionLoading}
          className={`px-6 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] ${checkedIn
            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
            : 'bg-[#5A42EC] hover:bg-[#4831D4] text-white shadow-[#5A42EC]/20'
            }`}
        >
          {actionLoading ? 'Processing...' : checkedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E2E8F0]/60">
          <h3 className="font-bold text-[#0F172A] text-[15px] font-heading">Recent Shift Logs</h3>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
            <span className="text-xs">Loading shift records...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] text-xs font-light">
            No attendance records found for your account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] border-b border-[#E2E8F0]/60 text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F%]/40 text-[#64748B]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#F5F5F5]/5 transition-all">
                    <td className="px-6 py-4 font-mono font-bold text-[#0F172A]">{log.date}</td>
                    <td className="px-6 py-4 font-medium">{log.checkIn}</td>
                    <td className="px-6 py-4 font-medium">{log.checkOut || '--'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${log.status === 'Active'
                        ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        : log.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${log.status === 'Active'
                          ? 'bg-blue-500'
                          : log.status === 'Late'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          }`}></span>
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

export default AttendanceTracker;
