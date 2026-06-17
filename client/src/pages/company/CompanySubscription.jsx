import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

const CompanySubscription = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Billing & Subscription</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor your plan, payment methods, billing history, and team seat limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white text-sm">Current Plan</h3>
            <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
              ACTIVE
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xl font-bold text-white">Professional Plan</p>
            <p className="text-xs text-[#B5B5B5] font-light">₹999 / month • Renews on July 1, 2026</p>
          </div>

          <div className="pt-4 border-t border-[#1C1C1C] flex justify-between items-center text-xs">
            <span className="text-[#646464]">Seat Limits</span>
            <span className="text-white font-medium">12 / 100 Employees</span>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm">Payment Methods</h3>
          <div className="flex items-center space-x-3 text-xs bg-[#0D0D0D] border border-[#1C1C1C] p-4 rounded-xl text-[#B5B5B5]">
            <CreditCard className="h-5 w-5 text-white" />
            <div>
              <p className="font-medium text-white">HDFC Bank Debit Card</p>
              <p className="text-[10px] text-[#646464] font-mono">•••• •••• •••• 4892</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySubscription;
