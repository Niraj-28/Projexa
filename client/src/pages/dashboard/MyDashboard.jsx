import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Clock, CalendarDays, Bell, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, logsRes, leavesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/attendance'),
        api.get('/leaves'),
      ]);

      if (tasksRes.data?.success) setTasks(tasksRes.data.tasks);
      if (logsRes.data?.success) {
        setLogs(logsRes.data.logs);
        const today = new Date().toISOString().split('T')[0];
        const activeTodayLog = logsRes.data.logs.find(log => log.date === today && !log.checkOut);
        setCheckedIn(!!activeTodayLog);
      }
      if (leavesRes.data?.success) setLeaves(leavesRes.data.leaves);
    } catch (error) {
      console.error('Failed to load employee dashboard:', error);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCheckInOut = async () => {
    try {
      setActionLoading(true);
      if (!checkedIn) {
        const res = await api.post('/attendance/check-in');
        if (res.data && res.data.success) {
          toast.success('Successfully checked in!');
          setCheckedIn(true);
          fetchDashboardData();
        }
      } else {
        const res = await api.post('/attendance/check-out');
        if (res.data && res.data.success) {
          toast.success('Successfully checked out!');
          setCheckedIn(false);
          fetchDashboardData();
        }
      }
    } catch (error) {
      console.error('Action failed:', error);
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const openTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1C1C1C] to-[#131313] border border-[#1C1C1C] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-bold text-[#646464] uppercase tracking-widest font-mono">STAFF HOME</span>
          <h1 className="text-xl font-medium text-white tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-[#B5B5B5] font-light leading-relaxed">
            Here is your personal workspace summary for today. Track your sprint tasks, clock your daily shifts, and request leaves.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#646464] uppercase tracking-wider">My Open Tasks</span>
            <CheckSquare className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-semibold text-white tracking-tight">{loading ? '...' : openTasks.length}</p>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#646464] uppercase tracking-wider">Shift Status</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-semibold text-white tracking-tight">
            {loading ? '...' : checkedIn ? 'ACTIVE' : 'INACTIVE'}
          </p>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#646464] uppercase tracking-wider">My Leave Applications</span>
            <CalendarDays className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-semibold text-white tracking-tight">{loading ? '...' : leaves.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-xs font-light">Loading workspace...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Tasks list */}
          <div className="lg:col-span-8 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1C1C1C] pb-4">
              <div>
                <h3 className="font-semibold text-white text-sm font-heading">My Current Tasks</h3>
                <p className="text-[10px] text-[#646464]">Active sprint responsibilities</p>
              </div>
              <button 
                onClick={() => navigate('/my-tasks')}
                className="text-[10px] text-[#B5B5B5] hover:text-white font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Desk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {openTasks.length === 0 ? (
              <p className="text-xs text-[#646464] py-8 text-center font-light">All assigned tasks completed! Great work.</p>
            ) : (
              <div className="divide-y divide-[#1C1C1C] text-xs">
                {openTasks.slice(0, 5).map(task => (
                  <div key={task._id} className="py-3.5 flex items-center justify-between text-xs text-[#B5B5B5]">
                    <div className="space-y-0.5">
                      <p className="font-medium text-white">{task.title}</p>
                      <p className="text-[10px] text-[#646464]">{task.project?.name || 'Sprint Project'}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Check-in clock Widget */}
          <div className="lg:col-span-4 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#1C1C1C] pb-4">
              <h3 className="font-semibold text-white text-sm">Quick Attendance</h3>
              <p className="text-[10px] text-[#646464]">Clock in or out for today's shift</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl text-center space-y-1.5">
                <span className="text-[9px] text-[#646464] uppercase font-bold tracking-wider">Shift Clock</span>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {checkedIn ? 'Shift Active' : 'Offline'}
                </p>
              </div>

              <button
                onClick={handleCheckInOut}
                disabled={actionLoading}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer disabled:opacity-50 ${
                  checkedIn
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white hover:bg-[#B5B5B5] text-[#131313]'
                }`}
              >
                {actionLoading ? 'Processing...' : checkedIn ? 'Check Out' : 'Check In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDashboard;
