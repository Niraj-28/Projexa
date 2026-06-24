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
              ? 'border-[#111111] text-[#111111] font-bold'
              : 'border-transparent text-[#A3A3A3] hover:text-[#737373]'
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
              ? 'border-[#111111] text-[#111111] font-bold'
              : 'border-transparent text-[#A3A3A3] hover:text-[#737373]'
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
              ? 'border-[#111111] text-[#111111] font-bold'
              : 'border-transparent text-[#A3A3A3] hover:text-[#737373]'
          }`
        }
      >
        Billing & Subscription
      </NavLink>
    </div>
  );
};

export default CompanyNavTabs;
