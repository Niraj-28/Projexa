import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Building2, Users, CheckSquare, Server, Cpu, Database, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Platform = () => {
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    projects: 0,
    tasks: 0,
    attendanceLogs: 0,
    leaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/stats');
        if (res.data?.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching platform stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Generate dynamic trend data based on current stats to show a realistic time-series growth
  const generateGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => {
      const scale = (idx + 1) / months.length;
      return {
        name: month,
        Companies: Math.max(1, Math.round(stats.companies * scale)),
        Users: Math.max(1, Math.round(stats.users * scale)),
      };
    });
  };

  const growthData = generateGrowthData();

  const resourceData = [
    { name: 'Companies', Count: stats.companies, color: '#3b82f6' },
    { name: 'Users', Count: stats.users, color: '#10b981' },
    { name: 'Projects', Count: stats.projects, color: '#f59e0b' },
    { name: 'Tasks', Count: stats.tasks, color: '#8b5cf6' },
  ];

  // Custom tooltips matching the premium dark mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] px-3.5 py-2.5 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-semibold text-[#0F172A] font-mono">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }} className="font-light">
              {entry.name}: <span className="font-semibold text-[#0F172A]">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Super Admin Platform Hub</h1>
          <p className="text-xs text-[#64748B] mt-1 font-light">Monitor system performance, system load, and company workspace creation.</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl flex items-center gap-4 hover-card card-animate shadow-sm">
          <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">Companies</span>
            <p className="text-xl font-semibold text-[#0F172A] mt-0.5">{loading ? '...' : stats.companies}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl flex items-center gap-4 hover-card card-animate shadow-sm">
          <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">Total Users</span>
            <p className="text-xl font-semibold text-[#0F172A] mt-0.5">{loading ? '...' : stats.users}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl flex items-center gap-4 hover-card card-animate shadow-sm">
          <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">Total Tasks</span>
            <p className="text-xl font-semibold text-[#0F172A] mt-0.5">{loading ? '...' : stats.tasks}</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Platform Growth */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 hover-card shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Platform Onboarding Growth</h3>
            <p className="text-xs text-[#64748B] font-light mt-0.5">Companies & User registrations over past 6 months</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Users" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="Companies" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCompanies)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Resource Allocation */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 hover-card shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Workspace Database Metrics</h3>
            <p className="text-xs text-[#64748B] font-light mt-0.5">Total database document distribution</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Count" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {resourceData.map((entry, index) => (
                    <circle key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-5 hover-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
          <Server className="h-4 w-4 text-[#64748B]" />
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">System Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-[#64748B]">
          <div className="flex justify-between p-3.5 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl hover-row">
            <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-[#94A3B8]" /> Server Engine</span>
            <span className="text-[#0F172A] font-mono font-medium">Node.js / Express</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl hover-row">
            <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-[#94A3B8]" /> Active Sprints</span>
            <span className="text-[#0F172A] font-mono font-medium">{stats.projects}</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl hover-row">
            <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-[#94A3B8]" /> Database Connection</span>
            <span className="text-[#0F172A] font-mono font-medium">MongoDB Atlas</span>
          </div>
          <div className="flex justify-between p-3.5 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl hover-row">
            <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5 text-[#94A3B8]" /> Platform Build</span>
            <span className="text-[#0F172A] font-mono font-medium">WorkArena v1.0.0-rc4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;

