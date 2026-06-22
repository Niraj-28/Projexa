import React, { useState, useEffect } from 'react';
import { Shield, Key, Database, Loader2 } from 'lucide-react';
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
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs font-light">Loading configuration...</span>
      </div>
    );
  }

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
              <select 
                value={backupSchedule}
                onChange={(e) => setBackupSchedule(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-[#B5B5B5]"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily (Midnight)</option>
                <option value="weekly">Weekly (Sunday)</option>
              </select>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">API Rate Limit</label>
              <input 
                type="text" 
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-[#B5B5B5]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Super Admin MFA</label>
              <select 
                value={mfaRequired}
                onChange={(e) => setMfaRequired(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-[#B5B5B5]"
              >
                <option value="enabled">Force Enabled</option>
                <option value="disabled">Optional</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Global Sandbox Mode</label>
              <select 
                value={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-[#B5B5B5]"
              >
                <option value="off">Off (Production)</option>
                <option value="on">On (Mock Transactions)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="bg-white hover:bg-[#B5B5B5] disabled:opacity-50 text-[#131313] px-6 py-2.5 rounded-lg text-xs font-semibold shadow transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
