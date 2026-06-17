import React from 'react';
import toast from 'react-hot-toast';

const CompanySettings = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Workspace settings saved.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Configure organization policies, default working hours, and system parameters.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#B5B5B5] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Shift Start Time</label>
            <input 
              type="text" 
              defaultValue="09:00 AM" 
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none" 
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Shift Grace Period</label>
            <input 
              type="text" 
              defaultValue="15 minutes" 
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none" 
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Weekly Off Days</label>
            <select className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none">
              <option value="sat-sun">Saturday & Sunday</option>
              <option value="sun">Sunday Only</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="bg-white hover:bg-[#B5B5B5] text-[#131313] px-5 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;
