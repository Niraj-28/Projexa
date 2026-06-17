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
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs">Loading employee details...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/employees')} className="flex items-center space-x-1.5 text-xs text-[#B5B5B5] hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Employees</span>
        </button>
        <div className="p-6 text-center text-[#646464] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          Employee profile not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/employees')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">{member.name}</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light uppercase tracking-wider">{member.role.replace('_', ' ')}</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-4 pb-4 border-b border-[#1C1C1C]">
          <div className="h-14 w-14 rounded-full bg-[#1C1C1C] border border-[#3C3C3C] flex items-center justify-center text-lg font-bold text-white uppercase">
            {member.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-base leading-tight">{member.name}</h3>
            <p className="text-xs text-[#646464] mt-0.5">{member.designation || 'Staff Member'} • {member.department?.name || 'No Department'}</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2.5">
            <span className="text-[#646464]">Email Address</span>
            <span className="text-white">{member.email}</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2.5">
            <span className="text-[#646464]">Phone</span>
            <span className="text-white">{member.phone || '--'}</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2.5">
            <span className="text-[#646464]">Joining Date</span>
            <span className="text-white">{member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : '--'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#646464]">Status</span>
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
