import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceReports = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/attendance')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Attendance Reports</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light font-sans">Analyze monthly attendance summaries and late logs.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-white text-sm">Monthly Attendance Summary</h3>
        <div className="p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl text-center space-y-1.5 text-xs text-[#B5B5B5]">
          <p className="text-[10px] text-[#646464] uppercase font-bold tracking-wider">Average On-Time Rate</p>
          <p className="text-3xl font-semibold text-white">94.8%</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
