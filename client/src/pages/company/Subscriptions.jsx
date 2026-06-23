import React, { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';
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
      <div className="p-14 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-sm font-light">Loading subscriptions details...</span>
      </div>
    );
  }

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#01161E] tracking-tight">Platform Subscriptions</h1>
        <p className="text-sm text-[#598392] mt-1.5 font-light">Monitor monthly recurring revenue and active billing cycles.</p>
      </div>

      {/* Revenue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl hover-card card-animate">
          <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider block">Estimated MRR</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-semibold text-[#01161E]">{formatPrice(data?.mrr || 0)}</span>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl hover-card card-animate">
          <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider block">Pro Tiers Active</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-semibold text-[#01161E]">{data?.proCount || 0}</span>
            <span className="text-xs text-[#94A3B8]">Workspaces</span>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl hover-card card-animate">
          <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider block">Enterprise Tiers Active</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-semibold text-[#01161E]">{data?.enterpriseCount || 0}</span>
            <span className="text-xs text-[#94A3B8]">Workspaces</span>
          </div>
        </div>
      </div>

      {/* Billing Cycles */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 hover-card">
        <h3 className="text-[15px] font-semibold text-[#01161E]">Subscription Management Summary</h3>
        <div className="text-sm space-y-3.5 font-light text-[#598392]">
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between hover-row">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>Standard Billing Engine</span>
            </div>
            <span className="text-[#01161E] font-mono">{data?.billingEngine || 'Stripe API (Connected)'}</span>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between hover-row">
            <div className="flex items-center space-x-2.5">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Average Customer Lifetime Value</span>
            </div>
            <span className="text-[#01161E] font-mono">{formatPrice(data?.averageLtv || 4990)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
