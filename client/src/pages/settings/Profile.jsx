import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Smartphone, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.error('Full Name is required.');
    }
    try {
      setSavingProfile(true);
      await updateProfile({ name, phone });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('All password fields are required.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match.');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long.');
    }

    try {
      setUpdatingPassword(true);
      await changePassword(currentPassword, newPassword);
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err || 'Failed to change password. Please verify current password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight font-heading">Account Profile</h1>
        <p className="text-xs text-[#737373] mt-0.5 font-light font-sans">Manage your personal settings, display information, and account password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Details & Info Form */}
        <div className="lg:col-span-5 bg-white border border-[#E5E5E5]/80 rounded-[20px] p-6 space-y-6 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-white border-2 border-[#E5E5E5] flex items-center justify-center text-xl font-bold text-[#111111] uppercase shadow-md">
              {user?.name ? user.name.slice(0, 2) : 'US'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111111] tracking-tight font-heading">{user?.name}</h2>
              <span className="text-[10px] text-[#111111] font-bold bg-[#F5F5F5]/10 px-3 py-0.5 rounded-full border border-[#111111]/10 uppercase tracking-widest mt-1.5 inline-block">
                {user?.role ? user.role.replace('_', ' ') : ''}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="border-t border-[#E5E5E5]/60 pt-6 space-y-4 text-xs text-[#737373]">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#A3A3A3] uppercase flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#111111] rounded-xl p-2.5 focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                required
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#A3A3A3] uppercase flex items-center gap-1.5">
                <Smartphone className="h-3 w-3" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Not provided"
                className="bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#111111] rounded-xl p-2.5 focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Mail className="h-4 w-4 text-[#A3A3A3] shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-[#A3A3A3] uppercase font-bold tracking-wider block">Email Address</span>
                <span className="text-[#737373] font-semibold">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="h-4 w-4 text-[#A3A3A3] shrink-0" />
              <div>
                <span className="text-[9px] text-[#A3A3A3] uppercase font-bold tracking-wider block">Designation</span>
                <span className="text-[#737373] font-semibold">{user?.designation || 'Staff Member'}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-[#111111] hover:bg-[#000000] hover:scale-[1.01] active:scale-[0.99] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-4"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <span>Save Profile Details</span>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5]/80 rounded-[20px] p-6 space-y-4 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-[#111111] tracking-tight font-heading">Security & Credentials</h2>
            <p className="text-[10px] text-[#A3A3A3] mt-0.5">Change your account password securely.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#A3A3A3] uppercase">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#111111] rounded-xl p-2.5 focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#A3A3A3] uppercase">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#111111] rounded-xl p-2.5 focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#A3A3A3] uppercase">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#111111] rounded-xl p-2.5 focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full bg-[#111111] hover:bg-[#000000] hover:scale-[1.01] active:scale-[0.99] py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {updatingPassword ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
