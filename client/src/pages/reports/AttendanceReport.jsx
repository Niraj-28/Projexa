import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AttendanceReport = () => {
  const navigate = useNavigate();
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
        toast.error('Failed to load attendance metrics report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-xs">Loading attendance metrics...</span>
      </div>
    );
  }

  const onTimeRate = data?.totalShifts > 0 ? (100 - Number(data.delayRate)).toFixed(1) : '100.0';

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/reports')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Attendance Report</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light">Workspace-wide average check-in times and delay logs.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <div className="space-y-3.5 text-xs text-[#598392] font-light">
          <h3 className="font-semibold text-[#01161E] text-sm mb-4">Attendance Stats</h3>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Total Shifts Tracked</span>
            <span className="text-[#01161E] font-medium">{data?.totalShifts || 0} Shifts</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">On-Time Clock-Ins</span>
            <span className="text-green-400 font-medium">{data?.onTimeLogs || 0} Logs ({onTimeRate}%)</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Late Clock-Ins</span>
            <span className="text-yellow-400 font-medium">{data?.lateLogs || 0} Logs ({data?.delayRate || '0.0'}%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Perfect Attendance Employees</span>
            <span className="text-[#01161E]">{data?.perfectAttendanceCount || 0} Staff Members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
