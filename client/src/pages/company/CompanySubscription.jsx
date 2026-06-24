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
      <div className="p-14 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]" />
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
        <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Billing & Subscription</h1>
        <p className="text-xs text-[#64748B] mt-1 font-light">Monitor your plan, payment methods, billing history, and team seat limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 hover-card card-animate flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-[#0F172A] text-xs uppercase tracking-wider text-[#94A3B8]">Current Plan</h3>
              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                company.status === 'Suspended'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                {company.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-xl font-bold text-[#0F172A] flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                {activePlan} Plan
              </p>
              <p className="text-xs text-[#64748B] font-light">
                {priceString} {renewalDate !== 'N/A' && `• Renews on ${renewalDate}`}
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-[#E2E8F0] flex justify-between items-center text-xs font-light text-[#64748B]">
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-[#94A3B8]" /> Team seat occupancy</span>
            <span className="text-[#0F172A] font-medium">{headcount} / {seatLimit} Employees</span>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 hover-card card-animate flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-[#0F172A] text-xs uppercase tracking-wider text-[#94A3B8]">Payment Details</h3>
            
            {activePlan === 'Free' ? (
              <div className="flex items-center space-x-3 text-xs bg-[#F4F5F9] border border-[#E2E8F0] p-4.5 rounded-xl text-[#64748B]">
                <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
                <div>
                  <p className="font-semibold text-[#0F172A]">Free Sandbox Tier Active</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">No billing information is required for sandbox workspaces.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-xs bg-[#F4F5F9] border border-[#E2E8F0] p-4.5 rounded-xl text-[#64748B]">
                <CreditCard className="h-5 w-5 text-[#0F172A] shrink-0" />
                <div>
                  <p className="font-semibold text-[#0F172A]">{cardBrand}</p>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">{cardString}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-[#E2E8F0] flex justify-between items-center text-xs font-light text-[#64748B]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#94A3B8]" /> Auto-renewal settings</span>
            <span className="text-[#0F172A] font-medium">{autoRenew ? 'Auto-renew ON' : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySubscription;
