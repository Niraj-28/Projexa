import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  Building2, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CompanyNavTabs from '../../components/CompanyNavTabs';

const CompanySubscription = () => {
  const { user, updateCompany } = useAuth();
  const [company, setCompany] = useState(user?.company || {});
  const [headcount, setHeadcount] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Modal / Interaction State
  const [targetPlan, setTargetPlan] = useState(null);
  const [downgradeModalOpen, setDowngradeModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const [compRes, usersRes] = await Promise.all([
        api.get('/companies/me'),
        api.get('/users')
      ]);

      if (compRes.data?.success) {
        setCompany(compRes.data.company);
        // Sync context
        updateCompany(compRes.data.company);
      }
      if (usersRes.data?.success) {
        const activeUsers = (usersRes.data.users || []).filter(u => u.isActive !== false);
        setHeadcount(activeUsers.length);
      }
    } catch (err) {
      console.error('Failed to load subscription details:', err);
      toast.error('Failed to load billing metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  useEffect(() => {
    if (!loading && company.subscriptionPlan === 'Free') {
      const queryParams = new URLSearchParams(location.search);
      const checkoutPlan = queryParams.get('checkout');
      if (checkoutPlan && (checkoutPlan === 'Professional' || checkoutPlan === 'Enterprise')) {
        // Remove query parameter from address bar to prevent repeated checkout on reload
        navigate(location.pathname, { replace: true });
        handleRazorpayCheckout(checkoutPlan);
      }
    }
  }, [loading, company.subscriptionPlan, location.search, navigate]);

  const handleOpenDowngrade = (planName) => {
    setTargetPlan(planName);
    setDowngradeModalOpen(true);
  };

  const handleRazorpayCheckout = async (planName) => {
    try {
      setProcessing(true);
      
      // 1. Call Backend to create order
      const orderRes = await api.post('/payments/razorpay-order', { plan: planName });
      if (!orderRes.data?.success) throw new Error('Order creation failed');

      const { orderId, amount, currency } = orderRes.data;

      // 2. Configure SDK options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "WorkArena",
        description: `Upgrade Workspace to ${planName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            setProcessing(true);
            // 3. Send payment tokens back to the server to verify signature and update DB
            const verifyRes = await api.post('/payments/verify-signature', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planName
            });

            if (verifyRes.data?.success) {
              toast.success(`Welcome to the ${planName} Plan!`);
              setCompany(verifyRes.data.company);
              updateCompany(verifyRes.data.company);
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error("Signature validation failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999',
        },
        theme: {
          color: "#0F172A" // Sleek Monochrome Black style to match theme
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not initialize transaction. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const executeDowngrade = async () => {
    try {
      setProcessing(true);
      const res = await api.put('/companies/me/subscription', {
        subscriptionPlan: targetPlan
      });

      if (res.data?.success) {
        toast.success(`Plan changed to ${targetPlan}.`);
        setCompany(res.data.company);
        updateCompany(res.data.company);
        setDowngradeModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Downgrade transaction declined.');
    } finally {
      setProcessing(false);
    }
  };

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
  const occupancyPercentage = Math.min(Math.round((headcount / seatLimit) * 100), 100);

  // Plan Details for comparison cards
  const plansInfo = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      limit: 10,
      description: 'Ideal for small startup teams starting their workflow.',
      features: ['Up to 10 active seats', 'Standard Chat discussions', 'Basic project task logs', 'Shared attendance logs']
    },
    {
      name: 'Professional',
      price: '₹999',
      period: 'per month',
      limit: 100,
      description: 'Built for high performance expanding enterprises.',
      features: ['Up to 100 active seats', 'Priority channel chat', 'Advanced project timelines', 'Shift grace periods', 'Standard export tools']
    },
    {
      name: 'Enterprise',
      price: '₹4,999',
      period: 'per month',
      limit: 1000,
      description: 'Ultimate dashboard control for large professional structures.',
      features: ['Up to 1000 active seats', 'Multi-tenant configurations', 'Custom analytics suite', 'Unlimited historic data logs', '24/7 dedicated support']
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <CompanyNavTabs />
      
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Billing & Subscription</h1>
        <p className="text-xs text-[#64748B] mt-1 font-light">Monitor your plan, payment methods, active workspace headcount, and seat limits.</p>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Overview */}
        <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-neutral-400 text-[10px] uppercase tracking-wider">Current Tier</h3>
              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                company.status === 'Suspended'
                  ? 'bg-neutral-200 text-neutral-600 border border-neutral-300'
                  : 'bg-neutral-900 text-white'
              }`}>
                {company.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-bold text-[#0F172A] flex items-center gap-1.5 font-heading">
                {activePlan} Plan
              </p>
              <p className="text-xs text-[#64748B] font-light">
                {priceString} {renewalDate !== 'N/A' && `• Renews on ${renewalDate}`}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-5 border-t border-[#E2E8F0]">
            <div className="flex justify-between items-center text-xs font-light text-[#64748B]">
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-[#94A3B8]" /> Team seat occupancy</span>
              <span className="text-[#0F172A] font-semibold">{headcount} / {seatLimit} Active Users</span>
            </div>
            
            {/* Occupancy Progress Bar */}
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-neutral-900 h-full rounded-full transition-all duration-500" 
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment Details Overview */}
        <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-400 text-[10px] uppercase tracking-wider">Payment Settings</h3>
            
            {activePlan === 'Free' ? (
              <div className="flex items-center space-x-3 text-xs bg-white border border-[#E2E8F0] p-4.5 rounded-xl text-[#64748B]">
                <ShieldCheck className="h-5 w-5 text-[#0F172A] shrink-0" />
                <div>
                  <p className="font-semibold text-[#0F172A]">Free Sandbox Active</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">No card required for basic workspace limits.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-xs bg-white border border-[#E2E8F0] p-4.5 rounded-xl text-[#64748B]">
                <CreditCard className="h-5 w-5 text-[#0F172A] shrink-0" />
                <div>
                  <p className="font-semibold text-[#0F172A]">{(company.cardBrand || '').replace(' Debit Card', '') || cardBrand}</p>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">{cardString}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-[#E2E8F0] flex justify-between items-center text-xs font-light text-[#64748B]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#94A3B8]" /> Renewal setting</span>
            <span className="text-[#0F172A] font-semibold">{autoRenew ? 'Auto-renew enabled' : 'Not applicable'}</span>
          </div>
        </div>
      </div>

      {/* Plan Pricing Matrix */}
      <div className="space-y-6 pt-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Available Subscription Plans</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Select a plan level that accommodates your organizational headcount requirements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plansInfo.map((plan) => {
            const isCurrent = activePlan === plan.name;
            const limitExceeded = headcount > plan.limit;

            return (
              <div 
                key={plan.name} 
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-200 ${
                  isCurrent 
                    ? 'border-neutral-900 border-2 shadow-sm ring-1 ring-neutral-900' 
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm uppercase tracking-wider text-neutral-800">{plan.name}</span>
                    {isCurrent && (
                      <span className="bg-neutral-100 border border-neutral-300 text-neutral-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Current Plan
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-neutral-900">{plan.price}</span>
                      <span className="text-xs text-neutral-400 font-light">/ {plan.period}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-light">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#F1F3F5]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 font-light">
                        <CheckCircle2 className="h-4 w-4 text-neutral-800 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {isCurrent ? (
                    <button 
                      disabled 
                      className="w-full bg-neutral-100 border border-neutral-300 text-neutral-400 py-2.5 rounded-xl text-xs font-semibold cursor-not-allowed"
                    >
                      Active Plan
                    </button>
                  ) : plan.name === 'Free' || (activePlan === 'Enterprise' && plan.name === 'Professional') ? (
                    // Downgrade Action
                    <button
                      onClick={() => handleOpenDowngrade(plan.name)}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition border duration-200 cursor-pointer ${
                        limitExceeded
                          ? 'border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed'
                          : 'border-neutral-300 text-neutral-800 hover:bg-neutral-50'
                      }`}
                    >
                      {limitExceeded ? 'Headcount Exceeds Limit' : `Downgrade to ${plan.name}`}
                    </button>
                  ) : (
                    // Upgrade Action
                    <button
                      onClick={() => handleRazorpayCheckout(plan.name)}
                      disabled={processing}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-semibold transition duration-200 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {processing && targetPlan === plan.name ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      ) : null}
                      <span>Upgrade to {plan.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Downgrade Modal Confirmation */}
      {downgradeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setDowngradeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-2xl">
              <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Downgrade Workspace Limits</h4>
                <p className="text-xs text-red-700 font-light leading-relaxed">
                  Downgrading subscription limits to <span className="font-semibold">{targetPlan}</span> reduces available workspace seats. Auto-renewals and advanced features will be updated.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-light text-neutral-600 bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
                <span>Active Headcount:</span>
                <span className="font-bold text-neutral-950">{headcount} Users</span>
              </div>

              <div className="flex justify-between items-center text-sm font-light text-neutral-600 bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
                <span>Target Plan Limit:</span>
                <span className="font-bold text-neutral-950">
                  {targetPlan === 'Free' ? '10 Seats' : '100 Seats'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setDowngradeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-500 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDowngrade}
                disabled={processing}
                className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                {processing ? (
                  <Loader2 className="h-3 w-3 animate-spin text-white" />
                ) : null}
                Confirm Downgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySubscription;
