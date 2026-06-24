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
      <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
        <span className="text-xs">Loading project metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/reports')} className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Project Milestone Reports</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Milestone achievements, completed project velocity, and delayed sprints logs.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="space-y-3.5 text-xs text-[#64748B] font-light">
          <h3 className="font-semibold text-[#0F172A] text-sm mb-4">Milestone Overview</h3>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Total Projects Registered</span>
            <span className="text-[#0F172A] font-medium">{data?.totalProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Planning / Setup phase</span>
            <span className="text-amber-500 font-medium">{data?.planningProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Active Deliverables</span>
            <span className="text-indigo-500 font-medium">{data?.activeProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">On Hold status</span>
            <span className="text-rose-500 font-medium">{data?.onHoldProjects || 0} Projects</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Completed Deliverables</span>
            <span className="text-emerald-500 font-medium">{data?.completedProjects || 0} Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsReport;
