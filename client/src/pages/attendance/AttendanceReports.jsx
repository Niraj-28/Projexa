import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AttendanceReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/attendance/report');
        if (res.data?.success) {
          setData(res.data.report);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load attendance report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const isEmployee = user?.role === 'employee';
  const onTimeRate = data?.totalShifts > 0 ? (100 - Number(data.delayRate)).toFixed(1) : '100.0';

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/attendance')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Attendance Reports</h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-light font-sans">
              {isEmployee 
                ? 'Analyze your personal shift hour statistics and on-time rate.'
                : 'Analyze monthly attendance summaries and late logs.'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#F4F5F9] border border-[#E2E8F0] rounded-lg p-0.5">
          <Link
            to="/attendance"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all text-[#94A3B8] hover:text-[#64748B]"
          >
            Tracker
          </Link>
          <Link
            to="/attendance/history"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all text-[#94A3B8] hover:text-[#64748B]"
          >
            History
          </Link>
          <Link
            to="/attendance/reports"
            className="px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all bg-[#E2E8F0] text-[#0F172A]"
          >
            Reports
          </Link>
        </div>
      </div>

      <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-[#0F172A] text-sm">
          {isEmployee ? 'Personal Shift Summary' : 'Monthly Attendance Summary'}
        </h3>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]" />
            <span className="text-xs">Loading report...</span>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-light text-[#64748B]">
            <div className="p-4 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-center space-y-1.5">
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Average On-Time Rate</p>
              <p className="text-3xl font-semibold text-[#0F172A]">{onTimeRate}%</p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#94A3B8]">Total Shifts Tracked</span>
                <span className="text-[#0F172A] font-medium">{data?.totalShifts || 0} Shifts</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#94A3B8]">On-Time Clock-Ins</span>
                <span className="text-green-400 font-medium">{data?.onTimeLogs || 0} Logs</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#94A3B8]">Late Clock-Ins</span>
                <span className="text-yellow-400 font-medium">{data?.lateLogs || 0} Logs ({data?.delayRate || '0.0'}% late)</span>
              </div>
              {!isEmployee && (
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Perfect Attendance Employees</span>
                  <span className="text-[#0F172A]">{data?.perfectAttendanceCount || 0} Staff Members</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;
