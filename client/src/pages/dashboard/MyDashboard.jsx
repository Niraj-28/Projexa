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
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-[#124559] via-[#0f3645] to-[#01161E] border border-[#124559]/20 rounded-[24px] p-8 relative overflow-hidden shadow-md shadow-[#124559]/5">
        <div className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] bg-white/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute left-[30%] bottom-[-20%] h-[200px] w-[200px] bg-[#AEC3B0]/10 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-[9px] font-bold text-[#AEC3B0] uppercase tracking-[0.2em] font-mono">STAFF HOME</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-[#AEC3B0] font-light leading-relaxed max-w-2xl">
            Here is your personal workspace summary for today. Track your sprint tasks, clock your daily shifts, and request leaves.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-5 flex flex-col justify-between hover-card shadow-premium">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">My Open Tasks</span>
            <div className="h-9 w-9 rounded-xl bg-[#124559]/5 flex items-center justify-center border border-[#124559]/10 text-[#124559] shadow-sm">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#01161E] tracking-tight">{loading ? '...' : openTasks.length}</p>
        </div>

        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-5 flex flex-col justify-between hover-card shadow-premium">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Shift Status</span>
            <div className="h-9 w-9 rounded-xl bg-[#124559]/5 flex items-center justify-center border border-[#124559]/10 text-[#124559] shadow-sm">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <span className="text-2xl font-bold text-[#01161E]">...</span>
            ) : (
              <span className={`badge-status ${checkedIn ? 'badge-success' : 'badge-pending'}`}>
                {checkedIn ? 'ACTIVE SHIFT' : 'OFFLINE'}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-5 flex flex-col justify-between hover-card shadow-premium">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Leaves Filed</span>
            <div className="h-9 w-9 rounded-xl bg-[#124559]/5 flex items-center justify-center border border-[#124559]/10 text-[#124559] shadow-sm">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#01161E] tracking-tight">{loading ? '...' : leaves.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#124559]" />
          <span className="text-xs font-light">Loading workspace...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Tasks list */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-4 shadow-premium hover-card">
            <div className="flex justify-between items-center border-b border-[#E2E8F0]/60 pb-4">
              <div>
                <h3 className="font-bold text-[#01161E] text-[15px] font-heading">My Current Tasks</h3>
                <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">Active sprint responsibilities</p>
              </div>
              <button 
                onClick={() => navigate('/my-tasks')}
                className="text-[10px] text-[#124559] hover:text-[#01161E] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Desk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {openTasks.length === 0 ? (
              <p className="text-xs text-[#94A3B8] py-8 text-center font-light">All assigned tasks completed! Great work.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {openTasks.slice(0, 5).map(task => (
                  <div key={task._id} className="py-3.5 flex items-center justify-between text-xs text-[#598392]">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#01161E]">{task.title}</p>
                      <p className="text-[10px] text-[#94A3B8] font-medium">{task.project?.name || 'Sprint Project'}</p>
                    </div>
                    <span className={`badge-status ${
                      task.priority === 'high'
                        ? 'badge-failed'
                        : task.priority === 'medium'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Check-in clock Widget */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-4 shadow-premium hover-card flex flex-col justify-between">
            <div className="border-b border-[#E2E8F0]/60 pb-4">
              <h3 className="font-bold text-[#01161E] text-[15px] font-heading">Attendance Shift</h3>
              <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">Clock in or out for today's shift</p>
            </div>

            <div className="space-y-4 my-auto py-4">
              <div className="p-5 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]/50 border border-slate-100 rounded-2xl text-center space-y-1.5 shadow-inner">
                <span className="text-[9px] text-[#94A3B8] uppercase font-bold tracking-wider">Shift Clock</span>
                <p className="text-2xl font-extrabold text-[#01161E] tracking-tight">
                  {checkedIn ? 'Shift Active' : 'Offline'}
                </p>
              </div>

              <button
                onClick={handleCheckInOut}
                disabled={actionLoading}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer disabled:opacity-50 shadow-sm ${
                  checkedIn
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10'
                    : 'bg-[#124559] hover:bg-[#01161E] text-white shadow-[#124559]/10'
                }`}
              >
                {actionLoading ? 'Processing...' : checkedIn ? 'Check Out' : 'Check In'}
              </button>
            </div>

            <div className="text-center pt-2 text-[10px] text-[#94A3B8] font-semibold tracking-wide border-t border-slate-100">
              Daily Shift: 9 hours standard
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDashboard;
