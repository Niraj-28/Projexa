import React, { useState, useEffect } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const IndianRupee = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13h4.5a4.5 4.5 0 0 0 0-9H6" />
    <path d="M14.5 13 6 21" />
  </svg>
);

const Layers = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-10 5 10 5 10-5-10-5Z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </svg>
);

const RevenueView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/platform-revenue');
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load system revenue statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="p-14 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-sm font-light">Loading revenue details...</span>
      </div>
    );
  }

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // Prepare subscription plan distribution pie data
  const getPlanData = () => {
    const plans = [
      { name: 'Free Tier', value: data?.freeCount || 0, color: '#94A3B8' },
      { name: 'Professional Plan', value: data?.proCount || 0, color: '#3b82f6' },
      { name: 'Enterprise Plan', value: data?.enterpriseCount || 0, color: '#10b981' }
    ];
    return plans.filter(p => p.value > 0);
  };

  const planData = getPlanData();

  // Create revenue trajectory leading up to current MRR
  const getRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const finalMRR = data?.mrr || 0;
    return months.map((month, idx) => {
      const multiplier = (idx + 1) / months.length;
      return {
        name: month,
        Revenue: Math.round(finalMRR * multiplier),
      };
    });
  };

  const revenueData = getRevenueData();

  // Custom tooltips matching the premium dark mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] px-3.5 py-2.5 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-semibold text-[#01161E] font-mono">{label || 'Value'}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }} className="font-light">
              {entry.name}: <span className="font-semibold text-[#01161E]">{entry.name === 'Revenue' ? formatPrice(entry.value) : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">System Revenue</h1>
        <p className="text-xs text-[#598392] mt-1 font-light">Monitor monthly recurring revenue, active subscription tiers, and transaction statistics.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl hover-card card-animate flex items-center gap-4">
          <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl w-11 h-11 flex items-center justify-center select-none font-bold text-lg">
            ₹
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">MRR (Monthly)</span>
            <p className="text-xl font-semibold text-[#01161E] mt-0.5">{formatPrice(data?.mrr || 0)}</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl hover-card card-animate flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">ARR (Annual)</span>
            <p className="text-xl font-semibold text-[#01161E] mt-0.5">{formatPrice(data?.arr || 0)}</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl hover-card card-animate flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">Active Tiers</span>
            <p className="text-xl font-semibold text-green-400 mt-0.5">{data?.totalCount || 0} Workspaces</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Trajectory */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 hover-card">
          <div>
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Revenue Growth Performance</h3>
            <p className="text-xs text-[#598392] font-light mt-0.5">Estimated MRR trajectory over the last 6 months</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Plan Distribution */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 hover-card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Subscription Tiers Share</h3>
                <p className="text-xs text-[#598392] font-light mt-0.5">Ratio of active plans across workspaces</p>
              </div>
            </div>

            <div className="h-48 w-full flex items-center justify-center mt-2">
              {planData.length === 0 ? (
                <p className="text-xs text-[#94A3B8] font-light">No subscription plan details.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Plan Legends */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-[#598392] pt-2 border-t border-[#E2E8F0]">
            {planData.length === 0 ? (
              <p className="col-span-3 text-center text-[#94A3B8] font-light py-2">No tiers present.</p>
            ) : (
              planData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 justify-center">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 hover-card">
        <h3 className="text-xs font-bold text-[#01161E] uppercase tracking-wider mb-5">Transaction History (Onboardings)</h3>
        {data?.transactions?.length === 0 ? (
          <p className="text-xs text-[#94A3B8] py-6 text-center font-light">No transaction activity recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Workspace</th>
                  <th className="pb-3 text-center">Transaction ID</th>
                  <th className="pb-3 text-center">Plan</th>
                  <th className="pb-3 pr-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60">
                {data?.transactions?.map((txn) => (
                  <tr key={txn.id} className="hover-row transition-colors duration-150 group">
                    {/* Left: Workspace Name */}
                    <td className="py-4 pl-2">
                      <span className="font-semibold text-[#01161E] text-xs block">{txn.company}</span>
                    </td>
                    {/* Center: Transaction ID */}
                    <td className="py-4 text-center text-[11px] font-medium text-[#598392] font-mono">
                      {txn.id}
                    </td>
                    {/* Center: Plan */}
                    <td className="py-4 text-center text-xs font-semibold text-[#01161E]">
                      {txn.plan}
                    </td>
                    {/* Right: Amount & Date */}
                    <td className="py-4 pr-2 text-right">
                      <p className="font-bold text-[#01161E] text-xs">{txn.amount}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{txn.date}</p>
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

export default RevenueView;
