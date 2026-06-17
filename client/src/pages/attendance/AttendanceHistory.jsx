import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/attendance');
        if (res.data && res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/attendance')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Shift Clock History</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Comprehensive list of all logged company check-ins.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <span className="text-xs">Loading history logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#646464] text-xs font-light">
            No shift logs recorded in this workspace.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C]/40 border-b border-[#1C1C1C] text-[#646464] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C] text-[#B5B5B5] font-light">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#1C1C1C]/20 transition-all">
                    <td className="px-6 py-4 font-semibold text-white">{log.user?.name || 'Staff'}</td>
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

export default AttendanceHistory;
