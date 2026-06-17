import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Building2, User, Mail, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${id}`);
        if (res.data && res.data.success) {
          setCompany(res.data.company);
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

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs">Loading workspace details...</span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/platform/companies')} className="flex items-center space-x-1.5 text-xs text-[#B5B5B5] hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workspaces</span>
        </button>
        <div className="p-6 text-center text-[#646464] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          Workspace not found or inactive.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/platform/companies')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">{company.name}</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light font-mono">ID: {company._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company profile card */}
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm">Workspace Metadata</h3>
          
          <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Workspace Name</span>
              <span className="text-white font-medium">{company.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Company Email</span>
              <span className="text-white">{company.email || '--'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Slug Address</span>
              <span className="text-white font-mono">/{company.workspaceUrl}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Created Date</span>
              <span className="text-white">{new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#646464]">Status</span>
              <span className="text-green-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Administrator profile */}
        <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm">Onboarded Administrator</h3>
          
          <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Admin Name</span>
              <span className="text-white font-medium">{company.adminName || 'Admin User'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1C1C1C] pb-2">
              <span className="text-[#646464]">Admin Email</span>
              <span className="text-white">{company.adminEmail || 'admin@company.com'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
