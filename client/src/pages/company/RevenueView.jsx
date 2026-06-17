import React from 'react';
import { CreditCard, TrendingUp, DollarSign } from 'lucide-react';

const RevenueView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">System Revenue</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor monthly recurring revenue, active subscription tiers, and transaction statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">MRR (Monthly)</span>
          <p className="text-2xl font-medium text-white mt-1">₹4,52,000</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">ARR (Annual)</span>
          <p className="text-2xl font-medium text-white mt-1">₹54,24,000</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Active Tiers</span>
          <p className="text-2xl font-medium text-green-400 mt-1">112 Workspaces</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Transaction History</h3>
        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          {[
            { id: "TXN1009", company: "Dev Technologies", amount: "₹999", plan: "Professional Monthly", date: "Just now" },
            { id: "TXN1008", company: "Alpha Services", amount: "₹4,999", plan: "Enterprise Monthly", date: "2 hours ago" },
            { id: "TXN1007", company: "Beta Logistics", amount: "₹999", plan: "Professional Monthly", date: "1 day ago" }
          ].map((txn) => (
            <div key={txn.id} className="flex justify-between items-center py-2 border-b border-[#1C1C1C] last:border-0">
              <div>
                <p className="font-semibold text-white">{txn.company}</p>
                <p className="text-[10px] text-[#646464] font-mono">{txn.id} • {txn.plan}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{txn.amount}</p>
                <p className="text-[10px] text-[#646464]">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueView;
