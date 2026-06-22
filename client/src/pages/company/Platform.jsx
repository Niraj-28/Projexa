import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Server, Database, Activity, Building2, Users, CheckSquare } from 'lucide-react';

const Platform = () => {
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    projects: 0,
    tasks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/companies/stats');
        if (res.data?.success) {
          setStats(res.data.stats);
        }
      } catch {
        // Keep zero-state values if the API is unavailable.
      }
    };

    fetchStats();
  }, []);

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
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Companies</span>
            <p className="text-lg font-medium text-white">{stats.companies}</p>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Users</span>
            <p className="text-lg font-medium text-white">{stats.users}</p>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Tasks</span>
            <p className="text-lg font-medium text-white">{stats.tasks}</p>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-[#B5B5B5]">
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Server OS</span>
            <span className="text-white font-mono">Node.js / Express</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Projects</span>
            <span className="text-white font-mono">{stats.projects}</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Database Engine</span>
            <span className="text-white font-mono">MongoDB Atlas</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
            <span>Platform Version</span>
            <span className="text-white font-mono">WorkArea v1.0.0-rc4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;
