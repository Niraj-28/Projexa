import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, FolderGit2, CheckSquare, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    employees: 0,
    projects: 5,
    tasks: 12,
    attendance: 98,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users');
        if (response.data && response.data.success) {
          setStats((prev) => ({
            ...prev,
            employees: response.data.users.length,
          }));
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1C1C1C] to-[#131313] border border-[#1C1C1C] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-bold text-[#646464] uppercase tracking-widest font-mono">WORKSPACE HOME</span>
          <h1 className="text-xl font-medium text-white tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-[#B5B5B5] font-light leading-relaxed">
            Here is an overview of what is happening in your workspace today. Manage projects, tasks, and employees.
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: stats.employees, subtitle: 'Managers & Staff', icon: <Users className="h-5 w-5 text-blue-400" /> },
          { label: 'Active Projects', value: stats.projects, subtitle: 'Sprints in progress', icon: <FolderGit2 className="h-5 w-5 text-yellow-400" /> },
          { label: 'Open Tasks', value: stats.tasks, subtitle: 'Assigned to team', icon: <CheckSquare className="h-5 w-5 text-green-400" /> },
          { label: 'Attendance Rate', value: `${stats.attendance}%`, subtitle: 'Daily check-in average', icon: <Clock className="h-5 w-5 text-purple-400" /> }
        ].map((card, idx) => (
          <div key={idx} className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-3 hover:border-[#3C3C3C] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#646464] uppercase tracking-wider">{card.label}</span>
              <div className="h-8 w-8 rounded-lg bg-[#1C1C1C] flex items-center justify-center border border-[#3C3C3C]/40">
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white tracking-tight">{loading ? '...' : card.value}</p>
              <p className="text-[10px] text-[#646464] mt-0.5 font-light">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Projects and Activity Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1C1C1C] pb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Active Projects</h3>
              <p className="text-[10px] text-[#646464]">Current deliverables and deadlines</p>
            </div>
            <button className="text-[10px] text-[#B5B5B5] hover:text-white font-semibold flex items-center gap-0.5">
              <span>View All</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-[#1C1C1C] text-xs">
            {[
              { name: 'Projexa Redesign', progress: 75, status: 'In Progress', manager: 'Niraj K.' },
              { name: 'Multi-Tenant Authentication', progress: 90, status: 'Testing', manager: 'Sarah Chen' },
              { name: 'HRMS Attendance Tracker', progress: 40, status: 'In Progress', manager: 'David Miller' },
              { name: 'Reporting API Endpoints', progress: 100, status: 'Completed', manager: 'Emma Watson' }
            ].map((p, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex-grow max-w-xs">
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-[10px] text-[#646464] mt-0.5">Lead: {p.manager}</p>
                </div>
                <div className="w-48 hidden sm:block">
                  <div className="flex justify-between text-[10px] text-[#646464] mb-1">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1C1C1C] border border-[#3C3C3C]/30 rounded-full overflow-hidden">
                    <div className="bg-[#B5B5B5] h-full" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                    p.status === 'Completed'
                      ? 'bg-green-500/10 text-green-400'
                      : p.status === 'Testing'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1C1C1C] pb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Productivity Velocity</h3>
              <p className="text-[10px] text-[#646464]">Sprint achievement metrics</p>
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>

          <div className="pt-2 text-xs space-y-4">
            <div className="text-center p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
              <p className="text-[9px] text-[#646464] uppercase font-bold tracking-wider">Weekly Output</p>
              <p className="text-3xl font-semibold text-white mt-1">94.2%</p>
              <p className="text-[10px] text-green-400 mt-1 font-medium">+4.8% from last week</p>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#646464]">Completed Tasks</span>
                <span className="text-white font-medium">32 / 38</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#646464]">Pending Approvals</span>
                <span className="text-white font-medium">6</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#646464]">Active Sprints</span>
                <span className="text-white font-medium">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
