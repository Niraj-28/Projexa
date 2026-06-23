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
      <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-xs">Loading department...</span>
      </div>
    );
  }

  if (!dep) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/departments')} className="flex items-center space-x-1.5 text-xs text-[#598392] hover:text-[#01161E] transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Departments</span>
        </button>
        <div className="p-6 text-center text-[#94A3B8] text-xs font-light bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
          Department not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/departments')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">{dep.name}</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light uppercase font-mono">Code: {dep.code}</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#E2E8F0]">
          <Network className="h-6 w-6 text-[#01161E]" />
          <div>
            <h3 className="font-semibold text-[#01161E] text-sm">{dep.name}</h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">ID: {dep._id}</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-[#598392] font-light">
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2.5">
            <span className="text-[#94A3B8]">Department Code</span>
            <span className="text-[#01161E] font-mono">{dep.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Department Lead</span>
            <span className="text-[#01161E]">{dep.manager?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
