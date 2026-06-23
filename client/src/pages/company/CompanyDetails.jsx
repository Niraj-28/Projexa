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
      <div className="p-14 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-sm">Loading workspace details...</span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/platform/companies')} className="flex items-center space-x-2 text-sm text-[#598392] hover:text-[#01161E] transition-all duration-200">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workspaces</span>
        </button>
        <div className="p-8 text-center text-[#94A3B8] text-sm font-light bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
          Workspace not found or inactive.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/platform/companies')} className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition-all duration-200 cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-[#01161E] tracking-tight">{company.name}</h1>
          <p className="text-sm text-[#598392] mt-0.5 font-light font-mono">ID: {company._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company profile card */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 hover-card">
          <h3 className="font-semibold text-[#01161E] text-[15px]">Workspace Metadata</h3>

          <div className="space-y-3.5 text-sm text-[#598392] font-light">
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Workspace Name</span>
              <span className="text-[#01161E] font-medium">{company.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Company Email</span>
              <span className="text-[#01161E]">{company.email || '--'}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Slug Address</span>
              <span className="text-[#01161E] font-mono">/{company.workspaceUrl}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Created Date</span>
              <span className="text-[#01161E]">{new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Subscription Plan</span>
              <span className="text-[#01161E] uppercase font-semibold">{company.subscriptionPlan || 'Free'}</span>
            </div>
            <div className="flex justify-between hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Status</span>
              <span className={`font-bold px-2 py-1 rounded text-[10px] ${company.status === 'Suspended' ? 'text-red-400' : 'text-green-400'
                }`}>
                {(company.status || 'Active').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Administrator profile */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 hover-card">
          <h3 className="font-semibold text-[#01161E] text-[15px]">Onboarded Administrator</h3>

          <div className="space-y-3.5 text-sm text-[#598392] font-light">
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Admin Name</span>
              <span className="text-[#01161E] font-medium">{company.adminName || 'Unassigned Admin'}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3 hover-row rounded px-2 -mx-2">
              <span className="text-[#94A3B8]">Admin Email</span>
              <span className="text-[#01161E]">{company.adminEmail || '--'}</span>
            </div>
          </div>
        </div>

        {/* Platform Settings & Administration Form */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-5 md:col-span-2 hover-card">
          <h3 className="font-semibold text-[#01161E] text-[15px]">Platform Administration</h3>
          <form onSubmit={handleAdminSave} className="space-y-7 text-sm text-[#598392] font-light">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-[#94A3B8] uppercase">Workspace Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200"
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
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200"
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
              className="bg-[#124559] hover:bg-[#01161E] disabled:opacity-50 text-white px-7 py-3 rounded-lg text-sm font-semibold shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
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
