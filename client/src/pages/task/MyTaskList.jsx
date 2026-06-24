import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Loader2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      if (response.data && response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Fetch my tasks failed:', error);
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      if (response.data && response.data.success) {
        toast.success(newStatus === 'completed' ? 'Task marked as Completed! Great job.' : 'Task status updated.');
        setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Update task status failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 border border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'testing':
        return 'bg-pink-500/10 text-pink-600 border border-pink-500/20';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'to_do':
      default:
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-heading">My Tasks</h1>
        <p className="text-xs text-[#64748B] mt-1 font-light">List of active tasks assigned to you. Mark them complete once resolved.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0]/60 pb-3 text-[#94A3B8] text-xs font-semibold">
            <span>TASK DESCRIPTION</span>
            <span>STATUS</span>
          </div>

          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center text-[#64748B] space-y-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#5A42EC]" />
              <span className="text-xs">Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-xs text-[#64748B] text-center py-6 font-light">No tasks assigned to you. Enjoy your day!</p>
          ) : (
            <div className="divide-y divide-[#E2E8F0]/40">
              {tasks.map((task) => (
                <div key={task._id} className="py-4 flex items-center justify-between gap-4 text-xs text-[#64748B] hover-row -mx-6 px-6 transition-colors">
                  <div className="space-y-1">
                    <p className={`font-bold text-[#0F172A] ${task.status === 'completed' ? 'line-through opacity-40' : ''}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[#94A3B8] text-[11px] leading-relaxed max-w-lg">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-[#94A3B8] pt-1">
                      {task.project && (
                        <span className="text-[#5A42EC] bg-[#f5f5f5]/5 border border-[#5A42EC]/10 px-2 py-0.5 rounded-full text-[9px] font-semibold">
                          {task.project.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3.5 w-3.5" /> Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div>
                    {task.status === 'completed' ? (
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          COMPLETED
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(task._id, 'in_progress')}
                          className="text-[#94A3B8] hover:text-[#0F172A] text-[10px] font-bold cursor-pointer underline underline-offset-2 transition-colors"
                        >
                          Reopen
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                          className={`text-[10px] font-bold rounded-full px-2.5 py-1 focus:outline-none cursor-pointer transition-colors mr-2 ${getStatusBadgeClass(task.status)}`}
                        >
                          <option value="to_do">TO DO</option>
                          <option value="in_progress">IN PROGRESS</option>
                          <option value="testing">TESTING</option>
                        </select>
                        <button
                          onClick={() => handleUpdateStatus(task._id, 'completed')}
                          className="bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#5A42EC] hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition duration-150 cursor-pointer shadow-sm"
                        >
                          Mark Completed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTaskList;
