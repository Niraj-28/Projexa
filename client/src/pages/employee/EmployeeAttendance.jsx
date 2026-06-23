import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const [usersRes, attRes] = await Promise.all([
          api.get('/users'),
          api.get('/attendance')
        ]);

        if (usersRes.data?.success) {
          const target = usersRes.data.users.find(u => u._id === id);
          setEmployee(target || null);
        }

        if (attRes.data?.success) {
          // Filter logs for this specific employee
          const employeeLogs = attRes.data.logs.filter(l => l.user?._id === id);
          setLogs(employeeLogs);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load attendance logs');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-xs">Loading attendance register...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/employees')} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">
            {employee ? `${employee.name}'s Attendance` : 'Employee Attendance'}
          </h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light">Historical shift log registry for this staff member.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8] text-xs font-light">
            No attendance records found for this employee.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF] text-[#598392] font-light">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#EFF6E0]/40 transition-all">
                    <td className="px-6 py-4 font-mono">{log.date}</td>
                    <td className="px-6 py-4">{log.checkIn}</td>
                    <td className="px-6 py-4">{log.checkOut || '--'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        log.status === 'Active' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : log.status === 'Late' 
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
