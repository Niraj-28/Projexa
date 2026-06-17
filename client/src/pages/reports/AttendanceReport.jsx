import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceReport = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/reports')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Attendance Report</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Workspace-wide average check-in times and delay logs.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <h3 className="font-semibold text-white text-sm mb-4">Attendance Stats</h3>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Total Shifts Tracked</span>
            <span className="text-white font-medium">84 Shifts</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Average Delay Rate</span>
            <span className="text-white text-yellow-400">4.2% (Late logs)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#646464]">Perfect Week Records</span>
            <span className="text-white">6 Employees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
