import React, { useState } from 'react';
import { CheckSquare, AlertTriangle, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTaskList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Implement local storage persistent state', priority: 'Medium', due: '2026-06-22', status: 'In Progress' },
    { id: 2, title: 'Verify CSS border classes for rounded cards', priority: 'Low', due: '2026-06-28', status: 'To Do' },
  ]);

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    toast.success('Task marked as Completed! Great job.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">My Tasks</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">List of active tasks assigned to you. Mark them complete once resolved.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3 text-[#646464] text-xs">
            <span>TASK DESCRIPTION</span>
            <span>STATUS</span>
          </div>

          {tasks.length === 0 ? (
            <p className="text-xs text-[#B5B5B5] text-center py-6 font-light">No tasks assigned to you. Enjoy your day!</p>
          ) : (
            <div className="divide-y divide-[#1C1C1C]">
              {tasks.map((task) => (
                <div key={task.id} className="py-4 flex items-center justify-between gap-4 text-xs font-light text-[#B5B5B5]">
                  <div className="space-y-1">
                    <p className={`font-medium text-white ${task.status === 'Completed' ? 'line-through opacity-40' : ''}`}>{task.title}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#646464]">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due {task.due}</span>
                      <span className="font-semibold text-yellow-500 uppercase text-[9px]">{task.priority} PRIORITY</span>
                    </div>
                  </div>

                  <div>
                    {task.status === 'Completed' ? (
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded text-[10px] font-bold">
                        COMPLETED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="bg-[#1C1C1C] border border-[#3C3C3C] text-white hover:bg-white hover:text-black px-3 py-1.5 rounded text-[10px] font-semibold transition duration-150 cursor-pointer"
                      >
                        Mark Completed
                      </button>
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
