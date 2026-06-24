import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Security Center</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Monitor active developer sessions and system logs.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B]">
          <ShieldCheck className="h-6 w-6 text-green-400 shrink-0" />
          <div>
            <p className="font-semibold text-[#0F172A]">Multi-Tenant Isolation Verification</p>
            <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-relaxed font-light">
              Your account is isolated under your workspace tenant ID. Authentication certificates are stored in cookies and HTTP headers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
