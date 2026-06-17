import React from 'react';
import { CreditCard, DollarSign, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

const Subscriptions = () => {
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
            <span className="text-2xl font-semibold text-white">₹24,950</span>
            <span className="text-[10px] text-green-400 font-medium">+12% MoM</span>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Pro Tiers Active</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-semibold text-white">25</span>
            <span className="text-[10px] text-[#646464]">Workspaces</span>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Enterprise Workspaces</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-semibold text-white">4</span>
            <span className="text-[10px] text-yellow-400 font-medium">Custom contracts</span>
          </div>
        </div>
      </div>

      {/* Billing Cycles */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Subscription Management Summary</h3>
        <div className="text-xs space-y-3 font-light text-[#B5B5B5]">
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
