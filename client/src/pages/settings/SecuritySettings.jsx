import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Security Center</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Monitor active developer sessions and system logs.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl text-xs text-[#B5B5B5]">
          <ShieldCheck className="h-6 w-6 text-green-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">Multi-Tenant Isolation Verification</p>
            <p className="text-[10px] text-[#646464] mt-0.5 leading-relaxed font-light">
              Your account is isolated under your workspace tenant ID. Authentication certificates are stored in cookies and HTTP headers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
