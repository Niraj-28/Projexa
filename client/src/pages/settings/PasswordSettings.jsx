import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PasswordSettings = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all fields.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    try {
      setSubmitting(true);
      await changePassword(currentPassword, newPassword);
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      toast.error(err || 'Failed to change password. Please verify your current password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#598392] hover:text-[#01161E] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#01161E] tracking-tight">Change Password</h1>
          <p className="text-xs text-[#598392] mt-0.5 font-light">Update your login security credentials.</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#598392] font-light">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#01161E] rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#124559] hover:bg-[#01161E] text-white py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordSettings;
