import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Loader2, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
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
      <div className="p-14 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-sm font-light">Loading billing details...</span>
      </div>
    );
  }

  const activePlan = company.subscriptionPlan || 'Free';
  const seatLimit = company.seatLimit || 10;
  const priceString = company.priceString || '₹0 / month • Free Tiers';
  const cardString = company.cardString || 'No card required (Free Tier)';
  const cardBrand = company.cardBrand || 'N/A';
  const autoRenew = company.autoRenew || false;
  const renewalDate = company.renewalDate || 'N/A';

  return (
    <div className="space-y-8">
      <CompanyNavTabs />
      
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Billing & Subscription</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor your plan, payment methods, billing history, and team seat limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-5 hover-card card-animate flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-[#646464]">Current Plan</h3>
              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                company.status === 'Suspended'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                {company.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-xl font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                {activePlan} Plan
              </p>
              <p className="text-xs text-[#B5B5B5] font-light">
                {priceString} {renewalDate !== 'N/A' && `• Renews on ${renewalDate}`}
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-[#1C1C1C] flex justify-between items-center text-xs font-light text-[#B5B5B5]">
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-[#646464]" /> Team seat occupancy</span>
            <span className="text-white font-medium">{headcount} / {seatLimit} Employees</span>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-5 hover-card card-animate flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-[#646464]">Payment Details</h3>
            
            {activePlan === 'Free' ? (
              <div className="flex items-center space-x-3 text-xs bg-[#0D0D0D] border border-[#1C1C1C] p-4.5 rounded-xl text-[#B5B5B5]">
                <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Free Sandbox Tier Active</p>
                  <p className="text-[10px] text-[#646464] mt-0.5">No billing information is required for sandbox workspaces.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-xs bg-[#0D0D0D] border border-[#1C1C1C] p-4.5 rounded-xl text-[#B5B5B5]">
                <CreditCard className="h-5 w-5 text-white shrink-0" />
                <div>
                  <p className="font-semibold text-white">{cardBrand}</p>
                  <p className="text-[10px] text-[#646464] font-mono mt-0.5">{cardString}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-[#1C1C1C] flex justify-between items-center text-xs font-light text-[#B5B5B5]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#646464]" /> Auto-renewal settings</span>
            <span className="text-white font-medium">{autoRenew ? 'Auto-renew ON' : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySubscription;
