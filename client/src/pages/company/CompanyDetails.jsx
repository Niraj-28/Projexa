import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Active');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Free');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${id}`);
        if (res.data && res.data.success) {
          setCompany(res.data.company);
          setStatus(res.data.company.status || 'Active');
          setSubscriptionPlan(res.data.company.subscriptionPlan || 'Free');
        }
      } catch (error) {
        console.error('Failed to load company details:', error);
        toast.error('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, [id]);

  const handleAdminSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put(`/companies/${id}`, {
        status,
        subscriptionPlan,
      });
      if (res.data && res.data.success) {
        setCompany(res.data.company);
        toast.success('Workspace administration settings updated successfully');
      }
    } catch (error) {
      console.error('Failed to update company administration settings:', error);
      toast.error('Failed to save administrative configuration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-14 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
        <span className="text-sm">Loading workspace details...</span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/platform/companies')} className="flex items-center space-x-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-all duration-200">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workspaces</span>
        </button>
        <div className="p-8 text-center text-[#94A3B8] text-sm font-light bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm">
          Workspace not found or inactive.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/platform/companies')} className="p-2.5 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition-all duration-200 cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight font-heading">{company.name}</h1>
          <p className="text-sm text-[#64748B] mt-0.5 font-light font-mono">ID: {company._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company profile card */}
        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-[#0F172A] text-[15px] font-heading">Workspace Metadata</h3>

          <div className="space-y-3.5 text-sm text-[#64748B] font-light">
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Workspace Name</span>
              <span className="text-[#0F172A] font-bold">{company.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Company Email</span>
              <span className="text-[#0F172A] font-semibold">{company.email || '--'}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Slug Address</span>
              <span className="text-[#0F172A] font-mono font-semibold">/{company.workspaceUrl}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Created Date</span>
              <span className="text-[#0F172A] font-semibold">{new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Subscription Plan</span>
              <span className="text-[#5A42EC] bg-[#5A42EC]/5 border border-[#5A42EC]/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{company.subscriptionPlan || 'Free'}</span>
            </div>
            <div className="flex justify-between hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                company.status === 'Suspended' 
                  ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' 
                  : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${company.status === 'Suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                {(company.status || 'Active').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Administrator profile */}
        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-[#0F172A] text-[15px] font-heading">Onboarded Administrator</h3>

          <div className="space-y-3.5 text-sm text-[#64748B] font-light">
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Admin Name</span>
              <span className="text-[#0F172A] font-bold">{company.adminName || 'Unassigned Admin'}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0]/60 pb-3 hover-row rounded px-2 -mx-2 transition-colors">
              <span className="text-[#94A3B8] font-medium">Admin Email</span>
              <span className="text-[#0F172A] font-semibold">{company.adminEmail || '--'}</span>
            </div>
          </div>
        </div>

        {/* Platform Settings & Administration Form */}
        <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-5 md:col-span-2 shadow-sm">
          <h3 className="font-bold text-[#0F172A] text-[15px] font-heading">Platform Administration</h3>
          <form onSubmit={handleAdminSave} className="space-y-7 text-sm text-[#64748B] font-light">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-[#94A3B8] uppercase">Workspace Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-[#F4F5F9] border border-[#E2E8F0] text-sm text-[#0F172A] rounded-xl p-3 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-[#94A3B8] uppercase">Subscription Plan</label>
                <select
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value)}
                  className="bg-[#F4F5F9] border border-[#E2E8F0] text-sm text-[#0F172A] rounded-xl p-3 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200 cursor-pointer"
                >
                  <option value="Free">Free</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#5A42EC] hover:bg-[#4831D4] disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] text-white px-7 py-3 rounded-xl text-sm font-bold shadow-sm shadow-[#5A42EC]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Administrative Settings</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
