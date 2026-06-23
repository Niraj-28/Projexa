import React from 'react';
import { NavLink } from 'react-router-dom';

const CompanyNavTabs = () => {
  return (
    <div className="flex space-x-1 border-b border-[#E2E8F0] pb-px mb-6">
      <NavLink
        to="/company/profile"
        className={({ isActive }) =>
          `px-5 py-3 text-[13px] font-semibold border-b-2 transition-all cursor-pointer ${
            isActive
              ? 'border-[#124559] text-[#01161E] font-bold'
              : 'border-transparent text-[#94A3B8] hover:text-[#598392]'
          }`
        }
      >
        Company Profile
      </NavLink>
      <NavLink
        to="/company/settings"
        className={({ isActive }) =>
          `px-5 py-3 text-[13px] font-semibold border-b-2 transition-all cursor-pointer ${
            isActive
              ? 'border-[#124559] text-[#01161E] font-bold'
              : 'border-transparent text-[#94A3B8] hover:text-[#598392]'
          }`
        }
      >
        Workspace Settings
      </NavLink>
      <NavLink
        to="/company/subscription"
        className={({ isActive }) =>
          `px-5 py-3 text-[13px] font-semibold border-b-2 transition-all cursor-pointer ${
            isActive
              ? 'border-[#124559] text-[#01161E] font-bold'
              : 'border-transparent text-[#94A3B8] hover:text-[#598392]'
          }`
        }
      >
        Billing & Subscription
      </NavLink>
    </div>
  );
};

export default CompanyNavTabs;
