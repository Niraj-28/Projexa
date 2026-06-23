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
        return 'text-red-400 font-bold uppercase text-[9px]';
      case 'high':
        return 'text-yellow-400 font-semibold uppercase text-[9px]';
      case 'medium':
        return 'text-blue-400 font-medium uppercase text-[9px]';
      default:
        return 'text-neutral-400 font-light uppercase text-[9px]';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">My Tasks</h1>
        <p className="text-xs text-[#598392] mt-1 font-light">List of active tasks assigned to you. Mark them complete once resolved.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 text-[#94A3B8] text-xs">
            <span>TASK DESCRIPTION</span>
            <span>STATUS</span>
          </div>

          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center text-[#598392] space-y-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#01161E]" />
              <span className="text-xs">Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-xs text-[#598392] text-center py-6 font-light">No tasks assigned to you. Enjoy your day!</p>
          ) : (
            <div className="divide-y divide-[#FFFFFF]">
              {tasks.map((task) => (
                <div key={task._id} className="py-4 flex items-center justify-between gap-4 text-xs font-light text-[#598392]">
                  <div className="space-y-1">
                    <p className={`font-medium text-[#01161E] ${task.status === 'completed' ? 'line-through opacity-40' : ''}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[#94A3B8] text-[11px] leading-relaxed max-w-lg">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-[#94A3B8] pt-0.5">
                      {task.project && (
                        <span className="text-[#01161E] bg-[#FFFFFF] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[9px]">
                          {task.project.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className={getPriorityBadgeClass(task.priority)}>{task.priority} PRIORITY</span>
                    </div>
                  </div>

                  <div>
                    {task.status === 'completed' ? (
                      <div className="flex items-center gap-2">
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded text-[10px] font-bold">
                          COMPLETED
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(task._id, 'in_progress')}
                          className="text-[#94A3B8] hover:text-[#01161E] text-[10px] font-semibold cursor-pointer underline underline-offset-2"
                        >
                          Reopen
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                          className="bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-semibold text-[#598392] rounded px-2 py-1.5 focus:outline-none cursor-pointer mr-1"
                        >
                          <option value="to_do">TO DO</option>
                          <option value="in_progress">IN PROGRESS</option>
                          <option value="testing">TESTING</option>
                        </select>
                        <button
                          onClick={() => handleUpdateStatus(task._id, 'completed')}
                          className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#01161E] hover:bg-white hover:text-black px-3 py-1.5 rounded text-[10px] font-semibold transition duration-150 cursor-pointer"
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
