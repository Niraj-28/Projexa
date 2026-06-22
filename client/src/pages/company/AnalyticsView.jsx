import React, { useState, useEffect } from 'react';
import { Activity, Users, ShieldAlert, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AnalyticsView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/platform-analytics');
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load system performance metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs font-light">Loading performance metrics...</span>
      </div>
    );
  }

  const perf = data?.performance || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">System Analytics</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light font-sans">Monitor active user sessions, response time, server load, and workspace registrations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Daily Active Users (DAU)</span>
          <p className="text-2xl font-medium text-white mt-1">{data?.dau || 0}</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Weekly Active Users (WAU)</span>
          <p className="text-2xl font-medium text-white mt-1">{data?.wau || 0}</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">System Health</span>
          <p className="text-2xl font-medium text-green-400 mt-1">{data?.systemHealth || '99.9% Up'}</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Core Performance Metrics (OS Resources)</h3>
        <div className="space-y-4 text-xs text-[#B5B5B5] font-light">
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-[#646464]">
              <span>CPU UTILIZATION</span>
              <span>{perf.cpu}%</span>
            </div>
            <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="bg-white h-full transition-all duration-500" style={{ width: `${perf.cpu}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-[#646464]">
              <span>RAM USAGE</span>
              <span>{perf.ramPercent}% ({perf.ramString})</span>
            </div>
            <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="bg-white h-full transition-all duration-500" style={{ width: `${perf.ramPercent}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-[#646464]">
              <span>DISK STORAGE</span>
              <span>{perf.diskPercent}% ({perf.diskString})</span>
            </div>
            <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="bg-white h-full transition-all duration-500" style={{ width: `${perf.diskPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
