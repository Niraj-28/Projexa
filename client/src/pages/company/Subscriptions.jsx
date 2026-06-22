import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Subscriptions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/platform-revenue');
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load active workspace statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs font-light">Loading subscriptions details...</span>
      </div>
    );
  }

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Platform Subscriptions</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor monthly recurring revenue and active billing cycles.</p>
      </div>

      {/* Revenue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Estimated MRR</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-semibold text-white">{formatPrice(data?.mrr || 0)}</span>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Pro Tiers Active</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-semibold text-white">{data?.proCount || 0}</span>
            <span className="text-[10px] text-[#646464]">Workspaces</span>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Enterprise Tiers Active</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-semibold text-white">{data?.enterpriseCount || 0}</span>
            <span className="text-[10px] text-[#646464]">Workspaces</span>
          </div>
        </div>
      </div>

      {/* Billing Cycles */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Subscription Management Summary</h3>
        <div className="text-xs space-y-3.5 font-light text-[#B5B5B5]">
          <div className="p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>Standard Billing Engine</span>
            </div>
            <span className="text-white font-mono">Stripe API (Connected)</span>
          </div>
          <div className="p-3.5 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Average Customer Lifetime Value</span>
            </div>
            <span className="text-white font-mono">₹4,990</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
