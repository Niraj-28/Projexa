import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, User, Phone, Mail, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        if (res.data && res.data.success) {
          const target = res.data.users.find(u => u._id === id);
          setMember(target || null);
        }
      } catch (error) {
        console.error('Failed to load employee details:', error);
        toast.error('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchMemberDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-xs">Loading employee details...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/employees')} className="flex items-center space-x-1.5 text-xs text-[#598392] hover:text-[#01161E] transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Employees</span>
        </button>
        <div className="p-6 text-center text-[#94A3B8] text-xs font-light bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
          Employee profile not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/employees')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">{member.name}</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light uppercase tracking-wider">{member.role.replace('_', ' ')}</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-4 pb-4 border-b border-[#E2E8F0]">
          <div className="h-14 w-14 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-lg font-bold text-[#01161E] uppercase">
            {member.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-[#01161E] text-base leading-tight">{member.name}</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">{member.designation || 'Staff Member'} • {member.department?.name || 'No Department'}</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-[#598392] font-light">
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2.5">
            <span className="text-[#94A3B8]">Email Address</span>
            <span className="text-[#01161E]">{member.email}</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2.5">
            <span className="text-[#94A3B8]">Phone</span>
            <span className="text-[#01161E]">{member.phone || '--'}</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2.5">
            <span className="text-[#94A3B8]">Joining Date</span>
            <span className="text-[#01161E]">{member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : '--'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Status</span>
            <span className={`font-bold ${member.isActive ? 'text-green-400' : 'text-red-400'}`}>
              {member.isActive ? 'ACTIVE' : 'DEACTIVATED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
