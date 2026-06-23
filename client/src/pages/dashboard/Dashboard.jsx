import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, FolderGit2, CheckSquare, TrendingUp, ArrowUpRight, Clock, Loader2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, projRes, tasksRes, leavesRes, attendanceRes] = await Promise.all([
        api.get('/users'),
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/leaves'),
        api.get('/attendance')
      ]);

      if (usersRes.data?.success) setUsers(usersRes.data.users);
      if (projRes.data?.success) setProjects(projRes.data.projects);
      if (tasksRes.data?.success) setTasks(tasksRes.data.tasks);
      if (leavesRes.data?.success) setLeaves(leavesRes.data.leaves);
      if (attendanceRes.data?.success) setAttendance(attendanceRes.data.logs);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Error loading workspace metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute stats
  const totalEmployees = users.length;
  const totalProjects = projects.length;
  const openTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayCheckedInCount = attendance.filter(log => log.date === todayDateStr).length;
  const attendanceRate = totalEmployees > 0 ? Math.round((todayCheckedInCount / totalEmployees) * 100) : 0;
  
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const taskVelocityRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Compute projects with progress
  const projectListWithProgress = projects.slice(0, 5).map(p => {
    const projectTasks = tasks.filter(t => t.project && t.project._id === p._id);
    const completedCount = projectTasks.filter(t => t.status === 'completed').length;
    const progressVal = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;
    
    return {
      id: p._id,
      name: p.name,
      status: p.status,
      manager: p.manager?.name || 'Unassigned',
      progress: progressVal,
    };
  });

  // Calculate task distribution for the Donut Chart
  const getTaskStatusData = () => {
    const counts = {
      to_do: tasks.filter(t => t.status === 'to_do').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      testing: tasks.filter(t => t.status === 'testing').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };

    const hasData = counts.to_do > 0 || counts.in_progress > 0 || counts.testing > 0 || counts.completed > 0;
    if (!hasData) return [];

    return [
      { name: 'To Do', value: counts.to_do, color: '#3b82f6' },
      { name: 'In Progress', value: counts.in_progress, color: '#f59e0b' },
      { name: 'Testing', value: counts.testing, color: '#ec4899' },
      { name: 'Completed', value: counts.completed, color: '#10b981' },
    ].filter(item => item.value > 0);
  };

  const taskStatusData = getTaskStatusData();

  // Calculate 7-Day Attendance Rate Trend
  const getAttendanceTrendData = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates.map(dStr => {
      const dayLogs = attendance.filter(log => log.date === dStr);
      const checkedIn = dayLogs.length;
      const rate = totalEmployees > 0 ? Math.round((checkedIn / totalEmployees) * 100) : 0;
      
      const dateObj = new Date(dStr);
      const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date: label,
        'Attendance Rate (%)': rate,
        'Checked In': checkedIn,
      };
    });
  };

  const attendanceTrendData = getAttendanceTrendData();

  // Custom tooltips matching the premium dark mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1C1C1C] border border-[#3C3C3C] px-3.5 py-2.5 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-semibold text-white font-mono">{label || 'Task Summary'}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }} className="font-light">
              {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          { label: 'Total Employees', value: totalEmployees, subtitle: 'Managers & Staff', icon: <Users className="h-5 w-5 text-blue-400" />, link: '/employees' },
          { label: 'Active Projects', value: totalProjects, subtitle: 'Sprints in progress', icon: <FolderGit2 className="h-5 w-5 text-yellow-400" />, link: '/projects' },
          { label: 'Open Tasks', value: openTasksCount, subtitle: 'Assigned to team', icon: <CheckSquare className="h-5 w-5 text-green-400" />, link: '/tasks' },
          { label: 'Daily Attendance', value: `${attendanceRate}%`, subtitle: `${todayCheckedInCount} Checked-in Today`, icon: <Clock className="h-5 w-5 text-purple-400" />, link: '/attendance' }
        ].map((card, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(card.link)}
            className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-3 hover:border-[#3C3C3C] transition-all cursor-pointer hover-card"
          >
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

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-xs font-light">Loading workspace reports...</span>
        </div>
      ) : (
        <>
          {/* Active Projects and Task Status Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4 hover-card">
              <div className="flex justify-between items-center border-b border-[#1C1C1C] pb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">Active Projects</h3>
                  <p className="text-[10px] text-[#646464]">Current deliverables and deadlines</p>
                </div>
                <button 
                  onClick={() => navigate('/projects')}
                  className="text-[10px] text-[#B5B5B5] hover:text-white font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              {projectListWithProgress.length === 0 ? (
                <p className="text-xs text-[#646464] py-8 text-center font-light">No projects added yet.</p>
              ) : (
                <div className="divide-y divide-[#1C1C1C] text-xs">
                  {projectListWithProgress.map((p) => (
                    <div key={p.id} className="py-4 flex items-center justify-between gap-4">
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
                          <div className="bg-[#B5B5B5] h-full transition-all duration-300" style={{ width: `${p.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          p.status === 'Completed'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : p.status === 'Planning'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column: Task Distribution */}
            <div className="lg:col-span-4 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4 hover-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#1C1C1C] pb-4">
                  <div>
                    <h3 className="font-semibold text-white text-sm">Task Status Distribution</h3>
                    <p className="text-[10px] text-[#646464]">Sprint task load metrics</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>

                <div className="h-48 w-full flex items-center justify-center mt-2">
                  {taskStatusData.length === 0 ? (
                    <p className="text-xs text-[#646464] font-light">No tasks to display.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Status Legends */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#B5B5B5] pt-2 border-t border-[#1C1C1C]">
                {taskStatusData.length === 0 ? (
                  <p className="col-span-2 text-center text-[#646464] font-light py-2">Create tasks to track sprint status.</p>
                ) : (
                  taskStatusData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="truncate">{item.name} ({item.value})</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom row: 7-Day Attendance rate trend */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4 hover-card">
              <div className="flex justify-between items-center border-b border-[#1C1C1C] pb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">7-Day Attendance Rate Trend</h3>
                  <p className="text-[10px] text-[#646464]">Staff engagement and presence history</p>
                </div>
                <Calendar className="h-4 w-4 text-[#B5B5B5]" />
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" vertical={false} />
                    <XAxis dataKey="date" stroke="#646464" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#646464" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Attendance Rate (%)" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAttendance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Metrics stats summary */}
            <div className="lg:col-span-4 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-5 hover-card flex flex-col justify-between">
              <div className="border-b border-[#1C1C1C] pb-4">
                <h3 className="font-semibold text-white text-sm">Productivity Velocity</h3>
                <p className="text-[10px] text-[#646464]">Current sprint productivity rate</p>
              </div>

              <div className="text-center p-5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl my-auto">
                <p className="text-[9px] text-[#646464] uppercase font-bold tracking-wider">Overall Task Velocity</p>
                <p className="text-3xl font-semibold text-white mt-1">{taskVelocityRate}%</p>
                <p className="text-[10px] text-green-400 mt-1 font-medium">Sprint completion rate</p>
              </div>

              <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light pt-4 border-t border-[#1C1C1C]">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#646464]">Completed Tasks</span>
                  <span className="text-white font-medium">{completedTasksCount} / {totalTasksCount}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#646464]">Pending Approvals</span>
                  <span className="text-white font-medium">{pendingLeavesCount} leaves</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#646464]">Active Projects</span>
                  <span className="text-white font-medium">{totalProjects}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
