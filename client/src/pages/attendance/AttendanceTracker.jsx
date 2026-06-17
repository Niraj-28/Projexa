import React, { useState } from 'react';
import { Clock, CheckCircle, ArrowRightLeft, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceTracker = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, date: '2026-06-16', checkIn: '09:05 AM', checkOut: '06:00 PM', status: 'On Time' },
    { id: 2, date: '2026-06-15', checkIn: '08:58 AM', checkOut: '05:45 PM', status: 'On Time' },
  ]);

  const handleCheckInOut = () => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = new Date().toISOString().split('T')[0];

    if (!checkedIn) {
      setCheckedIn(true);
      toast.success('Successfully checked in! Have a great shift.');
      // Add mock log entry
      setLogs([{ id: Date.now(), date: dateString, checkIn: timeString, checkOut: '--', status: 'Active' }, ...logs]);
    } else {
      setCheckedIn(false);
      toast.success('Successfully checked out! See you tomorrow.');
      // Update checkOut of the first log
      setLogs(logs.map((log, idx) => idx === 0 ? { ...log, checkOut: timeString, status: 'On Time' } : log));
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
          className={`px-6 py-3 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer ${
            checkedIn
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white hover:bg-[#B5B5B5] text-[#131313]'
          }`}
        >
          {checkedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1C1C1C] bg-[#1C1C1C]/20">
          <h3 className="font-semibold text-white text-xs">Recent Shift Logs</h3>
        </div>

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
                <tr key={log.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                  <td className="px-6 py-4 font-mono">{log.date}</td>
                  <td className="px-6 py-4">{log.checkIn}</td>
                  <td className="px-6 py-4">{log.checkOut}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-[#1C1C1C] text-[#646464]'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
