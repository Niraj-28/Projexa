import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateProfile({ name, phone });
      toast.success('Profile settings updated');
    } catch (error) {
      toast.error(error || 'Failed to update profile settings');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Profile Settings</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light font-sans">Modify your display name, contact phone, and avatar fields.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4 text-xs text-[#64748B] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg p-2.5 focus:outline-none focus:border-[#5A42EC] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#5A42EC] hover:bg-[#4831D4] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer mt-2"
          >
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
