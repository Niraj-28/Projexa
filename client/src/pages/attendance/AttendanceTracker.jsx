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
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Attendance Tracker</h1>
          <p className="text-xs text-[#598392] mt-1 font-light font-sans">Verify active shifts, check in/out, and review attendance logs.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-0.5">
          <Link
            to="/attendance"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all bg-[#E2E8F0] text-[#01161E]"
          >
            Tracker
          </Link>
          <Link
            to="/attendance/history"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all text-[#94A3B8] hover:text-[#598392]"
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

      {/* Clock In Widget */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-xl border ${checkedIn ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[#01161E] text-base">Shift Status: {checkedIn ? 'Active' : 'Inactive'}</h3>
            <p className="text-xs text-[#598392] font-light">Log your check-in time for daily verification.</p>
          </div>
        </div>

        <button
          onClick={handleCheckInOut}
          disabled={actionLoading}
          className={`px-6 py-3 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer disabled:opacity-50 ${
            checkedIn
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10'
              : 'bg-[#124559] hover:bg-[#01161E] text-white shadow-[#124559]/10'
          }`}
        >
          {actionLoading ? 'Processing...' : checkedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#FFFFFF]/20">
          <h3 className="font-semibold text-[#01161E] text-xs">Recent Shift Logs</h3>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
            <span className="text-xs">Loading shift records...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#598392] text-xs font-light">
            No attendance records found for your account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF] text-[#598392] font-light">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#EFF6E0]/40 transition-all">
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

export default AttendanceTracker;
