import React, { useState, useEffect } from 'react';
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
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Attendance Tracker</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light font-sans">Verify active shifts, check in/out, and review attendance logs.</p>
      </div>

      {/* Clock In Widget */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-xl border ${checkedIn ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Shift Status: {checkedIn ? 'Active' : 'Inactive'}</h3>
            <p className="text-xs text-[#B5B5B5] font-light">Log your check-in time for daily verification.</p>
          </div>
        </div>

        <button
          onClick={handleCheckInOut}
          disabled={actionLoading}
          className={`px-6 py-3 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer disabled:opacity-50 ${
            checkedIn
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white hover:bg-[#B5B5B5] text-[#131313]'
          }`}
        >
          {actionLoading ? 'Processing...' : checkedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1C1C1C] bg-[#1C1C1C]/20">
          <h3 className="font-semibold text-white text-xs">Recent Shift Logs</h3>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <span className="text-xs">Loading shift records...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#B5B5B5] text-xs font-light">
            No attendance records found for your account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C]/40 border-b border-[#1C1C1C] text-[#646464] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C] text-[#B5B5B5] font-light">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#1C1C1C]/20 transition-all">
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
