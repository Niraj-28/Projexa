import React from 'react';
import { Shield, Key, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const PlatformSettings = () => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Platform settings updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Platform Settings</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light font-sans">Configure base environment constraints, billing details, database backups, and secure admin keys.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6 text-xs text-[#B5B5B5] font-light">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Backup Schedule</label>
              <select className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none">
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily (Midnight)</option>
                <option value="weekly">Weekly (Sunday)</option>
              </select>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">API Rate Limit</label>
              <input 
                type="text" 
                defaultValue="100 req/min"
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Super Admin MFA</label>
              <select className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none">
                <option value="enabled">Force Enabled</option>
                <option value="disabled">Optional</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Global Sandbox Mode</label>
              <select className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none">
                <option value="off">Off (Production)</option>
                <option value="on">On (Mock Transactions)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="bg-white hover:bg-[#B5B5B5] text-[#131313] px-6 py-2.5 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlatformSettings;
