import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PlatformSettings = () => {
  const [backupSchedule, setBackupSchedule] = useState('daily');
  const [rateLimit, setRateLimit] = useState('100 req/min');
  const [mfaRequired, setMfaRequired] = useState('disabled');
  const [sandboxMode, setSandboxMode] = useState('off');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/platform-settings');
        if (res.data?.success && res.data.settings) {
          const { backupSchedule, rateLimit, mfaRequired, sandboxMode } = res.data.settings;
          setBackupSchedule(backupSchedule || 'daily');
          setRateLimit(rateLimit || '100 req/min');
          setMfaRequired(mfaRequired || 'disabled');
          setSandboxMode(sandboxMode || 'off');
        }
      } catch (err) {
        console.error('Failed to load platform settings:', err);
        toast.error('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put('/companies/platform-settings', {
        backupSchedule,
        rateLimit,
        mfaRequired,
        sandboxMode,
      });
      if (res.data?.success) {
        toast.success('Platform settings updated successfully.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save configuration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-14 flex flex-col items-center justify-center text-[#598392] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#01161E]" />
        <span className="text-sm font-light">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#01161E] tracking-tight">Platform Settings</h1>
        <p className="text-sm text-[#598392] mt-1.5 font-light">Configure base environment constraints, billing details, database backups, and secure admin keys.</p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 hover-card">
        <form onSubmit={handleSave} className="space-y-7 text-sm text-[#598392] font-light">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase">Backup Schedule</label>
              <select 
                value={backupSchedule}
                onChange={(e) => setBackupSchedule(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily (Midnight)</option>
                <option value="weekly">Weekly (Sunday)</option>
              </select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase">API Rate Limit</label>
              <input 
                type="text" 
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase">Super Admin MFA</label>
              <select 
                value={mfaRequired}
                onChange={(e) => setMfaRequired(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200"
              >
                <option value="enabled">Force Enabled</option>
                <option value="disabled">Optional</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase">Global Sandbox Mode</label>
              <select 
                value={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#01161E] rounded-lg p-3 focus:outline-none focus:border-[#124559] transition-all duration-200"
              >
                <option value="off">Off (Production)</option>
                <option value="on">On (Mock Transactions)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#124559] hover:bg-[#01161E] disabled:opacity-50 text-white px-7 py-3 rounded-lg text-sm font-semibold shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlatformSettings;
