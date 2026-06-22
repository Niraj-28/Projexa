import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EmployeesReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/report');
        if (res.data?.success) {
          setData(res.data.report);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load employee demographics report');
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
        <span className="text-xs">Loading employee metrics...</span>
      </div>
    );
  }

  const deptCounts = data?.deptHeadcounts || {};

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/reports')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Employee Reports</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light font-sans">Workspace demographics, headcount growth, and deactivations summary.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-6">
        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <h3 className="font-semibold text-white text-sm mb-4">Onboarding Demographics</h3>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Total Registered Staff</span>
            <span className="text-white font-medium">{data?.totalStaff || 0} Members</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Active Administrators</span>
            <span className="text-white">{data?.admins || 0} Admin</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Active Managers</span>
            <span className="text-white">{data?.managers || 0} Managers</span>
          </div>
          <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
            <span className="text-[#646464]">Active Employees</span>
            <span className="text-white">{data?.employees || 0} Employees</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#646464]">Inactive Accounts</span>
            <span className="text-white text-red-400">{data?.inactive || 0} Deactivated</span>
          </div>
        </div>

        {/* Headcount by Department */}
        <div className="pt-4 border-t border-[#1C1C1C] space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <h3 className="font-semibold text-white text-sm">Headcount by Department</h3>
          {Object.keys(deptCounts).length === 0 ? (
            <p className="text-[10px] text-[#646464] italic">No active department allocations found.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center border-b border-[#1C1C1C]/40 pb-2 last:border-0 last:pb-0">
                  <span className="text-[#B5B5B5]">{dept}</span>
                  <span className="text-white font-bold bg-[#1C1C1C] px-2 py-0.5 rounded font-mono text-[10px] border border-[#3C3C3C]/20">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesReport;
