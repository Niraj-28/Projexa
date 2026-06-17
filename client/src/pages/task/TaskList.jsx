import React, { useState } from 'react';
import { CheckSquare, ListPlus, Calendar, User, CheckCircle, Clock } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Write unit tests for AuthController', assignee: 'Alex', priority: 'High', status: 'To Do', due: '2026-06-25' },
    { id: 2, title: 'Setup Stripe billing webhooks', assignee: 'Jane', priority: 'Critical', status: 'In Progress', due: '2026-06-20' },
    { id: 3, title: 'Grayscale layout design validation', assignee: 'Sam', priority: 'Medium', status: 'Completed', due: '2026-06-16' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Tasks Desk</h1>
          <p className="text-xs text-[#B5B5B5] mt-1 font-light">Create, delegate, and monitor sprint task list.</p>
        </div>

        <button className="flex items-center space-x-2 bg-white text-[#131313] hover:bg-[#B5B5B5] px-4 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer">
          <ListPlus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
            <h3 className="font-semibold text-white text-sm">Sprint Task Board</h3>
            <span className="text-[10px] text-[#646464]">{tasks.length} Active Items</span>
          </div>

          <div className="divide-y divide-[#1C1C1C]">
            {tasks.map((task) => (
              <div key={task.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-light text-[#B5B5B5]">
                <div className="space-y-1">
                  <p className="font-medium text-white">{task.title}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#646464]">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {task.assignee}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due {task.due}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                    task.priority === 'Critical'
                      ? 'bg-red-500/10 text-red-400'
                      : task.priority === 'High'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>

                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    task.status === 'Completed'
                      ? 'bg-green-500/10 text-green-400'
                      : task.status === 'In Progress'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-[#1C1C1C] text-[#646464]'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
