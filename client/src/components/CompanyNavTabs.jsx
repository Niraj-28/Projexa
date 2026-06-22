import React from 'react';
import { NavLink } from 'react-router-dom';

const CompanyNavTabs = () => {
  return (
    <div className="flex space-x-1 border-b border-[#1C1C1C] pb-px mb-6">
      <NavLink
        to="/company/profile"
        className={({ isActive }) =>
          `px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            isActive
              ? 'border-white text-white font-bold'
              : 'border-transparent text-[#646464] hover:text-[#B5B5B5]'
          }`
        }
      >
        Company Profile
      </NavLink>
      <NavLink
        to="/company/settings"
        className={({ isActive }) =>
          `px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            isActive
              ? 'border-white text-white font-bold'
              : 'border-transparent text-[#646464] hover:text-[#B5B5B5]'
          }`
        }
      >
        Workspace Settings
      </NavLink>
      <NavLink
        to="/company/subscription"
        className={({ isActive }) =>
          `px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            isActive
              ? 'border-white text-white font-bold'
              : 'border-transparent text-[#646464] hover:text-[#B5B5B5]'
          }`
        }
      >
        Billing & Subscription
      </NavLink>
    </div>
  );
};

export default CompanyNavTabs;
