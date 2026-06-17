import React from 'react';
import { Shield, Server, Database, Activity, Cpu } from 'lucide-react';

const Platform = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Super Admin Platform Hub</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor system performance, system load, and company workspace creation.</p>
      </div>

      {/* Load & Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">API Load</span>
            <p className="text-lg font-medium text-white">Normal (12%)</p>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">DB Connections</span>
            <p className="text-lg font-medium text-white">Active (34)</p>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">API Response Time</span>
            <p className="text-lg font-medium text-white">45 ms</p>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-[#B5B5B5]">
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Server OS</span>
            <span className="text-white font-mono">Linux (Ubuntu 22.04 LTS)</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Node Version</span>
            <span className="text-white font-mono">v18.16.0</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Database Engine</span>
            <span className="text-white font-mono">MongoDB Atlas (v6.0)</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Platform Version</span>
            <span className="text-white font-mono">Projexa v1.0.0-rc4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;
