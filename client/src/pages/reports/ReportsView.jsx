import React from 'react';
import { FileBarChart2, Download, Printer, Filter } from 'lucide-react';

const ReportsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Workspace Reports</h1>
          <p className="text-xs text-[#B5B5B5] mt-1 font-light">Generate, schedule, and print metrics and analytics reports.</p>
        </div>
        <button className="flex items-center space-x-2 bg-white text-[#131313] hover:bg-[#B5B5B5] px-4 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
          <h3 className="font-semibold text-white text-sm">Reports Generator</h3>
          <Filter className="h-4 w-4 text-[#646464]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-[#B5B5B5]">
          <div className="p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Daily Attendance Report</p>
              <p className="text-[10px] text-[#646464] mt-0.5">Summary of shifts clocked in/out today</p>
            </div>
            <button className="text-xs font-semibold hover:text-white text-[#B5B5B5]">Generate</button>
          </div>

          <div className="p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Monthly Tasks Completion</p>
              <p className="text-[10px] text-[#646464] mt-0.5">Sprint task velocity metrics</p>
            </div>
            <button className="text-xs font-semibold hover:text-white text-[#B5B5B5]">Generate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
