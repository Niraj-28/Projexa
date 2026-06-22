import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TasksReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tasks/report');
        if (res.data?.success) {
          setData(res.data.report);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load tasks completion metrics report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs">Loading task metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/reports')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Task Completion Reports</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light font-sans">Sprint task velocities, completion ratios, and outstanding backlogs.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <h3 className="font-semibold text-white text-sm mb-4">Sprint Completion Rates</h3>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Total Workspace Tasks</span>
            <span className="text-white font-medium">{data?.totalTasks || 0} Tasks</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Completed checklist</span>
            <span className="text-white text-green-400">{data?.completionRate || 0}% ({data?.completedTasks || 0} tasks)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#646464]">Outstanding sprint items</span>
            <span className="text-white text-yellow-400">{data?.outstandingTasks || 0} Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksReport;
