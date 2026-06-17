import React from 'react';
import { Activity, Users, ShieldAlert } from 'lucide-react';

const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">System Analytics</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor active user sessions, response time, server load, and workspace registrations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Daily Active Users (DAU)</span>
          <p className="text-2xl font-medium text-white mt-1">1,489</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Weekly Active Users (WAU)</span>
          <p className="text-2xl font-medium text-white mt-1">5,823</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">System Health</span>
          <p className="text-2xl font-medium text-green-400 mt-1">99.98% Up</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Core Performance Metrics</h3>
        <div className="space-y-4 text-xs text-[#B5B5B5] font-light">
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-[#646464]">
              <span>CPU UTILIZATION</span>
              <span>18%</span>
            </div>
            <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '18%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-[#646464]">
              <span>RAM USAGE</span>
              <span>44% (3.5 GB / 8.0 GB)</span>
            </div>
            <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '44%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-[#646464]">
              <span>DISK STORAGE</span>
              <span>12% (24 GB / 200 GB)</span>
            </div>
            <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
