import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CompanyNavTabs from '../../components/CompanyNavTabs';

const CompanySettings = () => {
  const { updateCompany } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [shiftStart, setShiftStart] = useState('09:00 AM');
  const [shiftGrace, setShiftGrace] = useState(15);
  const [weeklyOff, setWeeklyOff] = useState('sat-sun');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/me');
        if (res.data?.success && res.data.company) {
          setName(res.data.company.name || '');
          setEmail(res.data.company.email || '');
          setIndustry(res.data.company.industry || '');
          setShiftStart(res.data.company.shiftStart || '09:00 AM');
          setShiftGrace(res.data.company.shiftGrace || 15);
          setWeeklyOff(res.data.company.weeklyOff || 'sat-sun');
        }
      } catch (err) {
        console.error('Failed to load company settings:', err);
        toast.error('Failed to load workspace settings');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanySettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Workspace Name and Company Email are required.');
    }
    try {
      setSubmitting(true);
      const res = await api.put('/companies/me', {
        name,
        email,
        industry,
        shiftStart,
        shiftGrace,
        weeklyOff,
      });
      if (res.data?.success) {
        toast.success('Workspace settings saved successfully.');
        updateCompany({
          name,
          email,
          industry,
          shiftStart,
          shiftGrace,
          weeklyOff,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-14 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-sm font-light">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CompanyNavTabs />
      
      <div>
        <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-[#598392] mt-1 font-light">Configure organization policies, default working hours, and system parameters.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 hover-card card-animate">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-[#598392] font-light">
          {/* Dual column input grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Workspace Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200" 
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Company Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Industry</label>
              <input 
                type="text" 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200" 
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Shift Start Time</label>
              <input 
                type="text" 
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Shift Grace Period (Minutes)</label>
              <input 
                type="number" 
                value={shiftGrace}
                onChange={(e) => setShiftGrace(Number(e.target.value))}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200" 
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Weekly Off Days</label>
              <select 
                value={weeklyOff}
                onChange={(e) => setWeeklyOff(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200"
              >
                <option value="sat-sun">Saturday & Sunday</option>
                <option value="sun">Sunday Only</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#124559] hover:bg-[#01161E] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;
