import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Globe, Calendar } from 'lucide-react';
import api from '../../services/api';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(user?.company || {});

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/companies/me');
        if (res.data?.success) {
          setCompany(res.data.company);
        }
      } catch {
        setCompany(user?.company || {});
      }
    };

    fetchCompany();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Company Profile</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">View your organization's registration metadata and slug details.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 max-w-xl">
        <div className="space-y-6 text-xs text-[#B5B5B5] font-light">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-[#1C1C1C] flex items-center justify-center text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base leading-tight">{company.name || 'My Organization'}</h3>
              <p className="text-[10px] text-[#646464] font-mono mt-0.5">Workspace Slug: /{company.workspaceUrl || 'slug'}</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-4 border-t border-[#1C1C1C]">
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Company Name</span>
              <span className="text-white font-medium">{company.name || 'Projexa Workspace'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Registration Email</span>
              <span className="text-white">{company.email || '--'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Workspace Slug</span>
              <span className="text-white font-mono">/{company.workspaceUrl}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Created On</span>
              <span className="text-white">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
