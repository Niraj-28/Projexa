import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import CompanyNavTabs from '../../components/CompanyNavTabs';

const CompanySubscription = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(user?.company || {});
  const [headcount, setHeadcount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        setLoading(true);
        const [compRes, usersRes] = await Promise.all([
          api.get('/companies/me'),
          api.get('/users')
        ]);

        if (compRes.data?.success) {
          setCompany(compRes.data.company);
        }
        if (usersRes.data?.success) {
          setHeadcount(usersRes.data.count || usersRes.data.users?.length || 0);
        }
      } catch (err) {
        console.error('Failed to load subscription details:', err);
        toast.error('Failed to load billing metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptionDetails();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs font-light">Loading billing details...</span>
      </div>
    );
  }

  const activePlan = company.subscriptionPlan || 'Free';
  let seatLimit = 10;
  let priceString = '₹0 / month • Free Tiers';
  let cardString = 'No card required (Free Tier)';
  let cardBrand = 'N/A';

  if (activePlan === 'Professional') {
    seatLimit = 100;
    priceString = '₹999 / month • Renews on July 1, 2026';
    cardString = '•••• •••• •••• 4892';
    cardBrand = 'HDFC Bank Debit Card';
  } else if (activePlan === 'Enterprise') {
    seatLimit = 1000;
    priceString = '₹4,999 / month • Renews on July 1, 2026';
    cardString = '•••• •••• •••• 9811';
    cardBrand = 'ICICI Corporate Credit Card';
  }

  return (
    <div className="space-y-6">
      <CompanyNavTabs />
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Billing & Subscription</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor your plan, payment methods, billing history, and team seat limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white text-sm">Current Plan</h3>
            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
              company.status === 'Suspended'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {company.status?.toUpperCase() || 'ACTIVE'}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xl font-bold text-white">{activePlan} Plan</p>
            <p className="text-xs text-[#B5B5B5] font-light">{priceString}</p>
          </div>

          <div className="pt-4 border-t border-[#1C1C1C] flex justify-between items-center text-xs">
            <span className="text-[#646464]">Seat Limits</span>
            <span className="text-white font-medium">{headcount} / {seatLimit} Employees</span>
          </div>
        </div>

        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm">Payment Methods</h3>
          {activePlan === 'Free' ? (
            <div className="flex items-center space-x-3 text-xs bg-[#0D0D0D] border border-[#1C1C1C] p-4 rounded-xl text-[#646464]">
              <ShieldCheck className="h-5 w-5 text-[#646464]" />
              <div>
                <p className="font-medium text-[#B5B5B5]">Free Tier Active</p>
                <p className="text-[10px]">No billing details required for sandbox workspaces.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-xs bg-[#0D0D0D] border border-[#1C1C1C] p-4 rounded-xl text-[#B5B5B5]">
              <CreditCard className="h-5 w-5 text-white" />
              <div>
                <p className="font-medium text-white">{cardBrand}</p>
                <p className="text-[10px] text-[#646464] font-mono">{cardString}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySubscription;
