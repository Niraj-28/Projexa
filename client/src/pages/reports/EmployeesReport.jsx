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
      <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
        <span className="text-xs">Loading employee metrics...</span>
      </div>
    );
  }

  const deptCounts = data?.deptHeadcounts || {};

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/reports')} className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Employee Reports</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light font-sans">Workspace demographics, headcount growth, and deactivations summary.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="space-y-3.5 text-xs text-[#64748B] font-light">
          <h3 className="font-semibold text-[#0F172A] text-sm mb-4">Onboarding Demographics</h3>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Total Registered Staff</span>
            <span className="text-[#0F172A] font-medium">{data?.totalStaff || 0} Members</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Active Administrators</span>
            <span className="text-[#0F172A]">{data?.admins || 0} Admin</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Active Managers</span>
            <span className="text-[#0F172A]">{data?.managers || 0} Managers</span>
          </div>
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#94A3B8]">Active Employees</span>
            <span className="text-[#0F172A]">{data?.employees || 0} Employees</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Inactive Accounts</span>
            <span className="text-rose-500 font-medium">{data?.inactive || 0} Deactivated</span>
          </div>
        </div>

        {/* Headcount by Department */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-3.5 text-xs text-[#64748B] font-light">
          <h3 className="font-semibold text-[#0F172A] text-sm">Headcount by Department</h3>
          {Object.keys(deptCounts).length === 0 ? (
            <p className="text-[10px] text-[#94A3B8] italic">No active department allocations found.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center border-b border-[#E2E8F0]/40 pb-2 last:border-0 last:pb-0">
                  <span className="text-[#64748B]">{dept}</span>
                  <span className="text-[#0F172A] font-bold bg-[#F4F5F9] px-2 py-0.5 rounded font-mono text-[10px] border border-[#E2E8F0]">{count}</span>
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
