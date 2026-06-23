import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Mail, Link2, Calendar } from 'lucide-react';
import api from '../../services/api';
import CompanyNavTabs from '../../components/CompanyNavTabs';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(user?.company || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/me');
        if (res.data?.success) {
          setCompany(res.data.company);
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [user]);

  return (
    <div className="space-y-8">
      <CompanyNavTabs />
      
      <div>
        <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Company Profile</h1>
        <p className="text-xs text-[#598392] mt-1 font-light">View your organization's registration metadata and slug details.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 hover-card card-animate">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-[#E2E8F0] flex items-center justify-center text-[#01161E]">
              <Building2 className="h-6 w-6 text-[#598392]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#01161E] text-base leading-tight">{company.name || 'My Organization'}</h3>
              <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">Workspace Slug: /{company.workspaceUrl || 'slug'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#E2E8F0] text-xs font-light">
            <div className="flex justify-between items-center p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover-row">
              <span className="flex items-center gap-2 text-[#94A3B8] font-medium">
                <Building2 className="h-4 w-4" /> Company Name
              </span>
              <span className="text-[#01161E] font-medium text-right">{company.name || 'WorkArena Workspace'}</span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover-row">
              <span className="flex items-center gap-2 text-[#94A3B8] font-medium">
                <Mail className="h-4 w-4" /> Registration Email
              </span>
              <span className="text-[#01161E] font-medium text-right">{company.email || '--'}</span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover-row">
              <span className="flex items-center gap-2 text-[#94A3B8] font-medium">
                <Link2 className="h-4 w-4" /> Workspace Slug
              </span>
              <span className="text-[#01161E] font-mono font-medium text-right">/{company.workspaceUrl}</span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover-row">
              <span className="flex items-center gap-2 text-[#94A3B8] font-medium">
                <Calendar className="h-4 w-4" /> Created On
              </span>
              <span className="text-[#01161E] font-medium text-right">
                {company.createdAt ? new Date(company.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
