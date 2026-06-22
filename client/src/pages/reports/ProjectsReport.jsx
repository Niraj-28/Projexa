import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProjectsReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects/report');
        if (res.data?.success) {
          setData(res.data.report);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load project sprint metrics report');
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
        <span className="text-xs">Loading project metrics...</span>
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Project Milestone Reports</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Milestone achievements, completed project velocity, and delayed sprints logs.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <h3 className="font-semibold text-white text-sm mb-4">Milestone Overview</h3>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Total Projects Registered</span>
            <span className="text-white font-medium">{data?.totalProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Planning / Setup phase</span>
            <span className="text-white text-yellow-400">{data?.planningProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Active Deliverables</span>
            <span className="text-white text-blue-400">{data?.activeProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">On Hold status</span>
            <span className="text-white text-red-400">{data?.onHoldProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#646464]">Completed Deliverables</span>
            <span className="text-white text-green-400">{data?.completedProjects || 0} Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsReport;
