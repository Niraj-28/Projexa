import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2, Network } from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dep, setDep] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDep = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/departments/${id}`);
        if (res.data && res.data.success) {
          setDep(res.data.department);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load department details');
      } finally {
        setLoading(false);
      }
    };
    fetchDep();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]" />
        <span className="text-xs">Loading department...</span>
      </div>
    );
  }

  if (!dep) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/departments')} className="flex items-center space-x-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Departments</span>
        </button>
        <div className="p-6 text-center text-[#94A3B8] text-xs font-light bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl">
          Department not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/departments')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">{dep.name}</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light uppercase font-mono">Code: {dep.code}</p>
        </div>
      </div>

      <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#E2E8F0]">
          <Network className="h-6 w-6 text-[#0F172A]" />
          <div>
            <h3 className="font-semibold text-[#0F172A] text-sm">{dep.name}</h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">ID: {dep._id}</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-[#64748B] font-light">
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2.5">
            <span className="text-[#94A3B8]">Department Code</span>
            <span className="text-[#0F172A] font-mono">{dep.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Department Lead</span>
            <span className="text-[#0F172A]">{dep.manager?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
