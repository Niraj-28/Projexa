import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Smartphone, Lock, Loader2, Briefcase } from 'lucide-react';
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
        <h1 className="text-2xl font-semibold text-white tracking-tight">Account Profile</h1>
        <p className="text-xs text-[#B5B5B5] mt-0.5 font-light font-sans">Manage your personal settings, display information, and account password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Details & Info Form */}
        <div className="lg:col-span-5 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-[#1C1C1C] border-2 border-[#3C3C3C] flex items-center justify-center text-xl font-bold text-white uppercase shadow-md">
              {user?.name ? user.name.slice(0, 2) : 'US'}
            </div>
            <div>
              <h2 className="text-lg font-medium text-white tracking-tight">{user?.name}</h2>
              <span className="text-[10px] text-[#B5B5B5] font-bold bg-[#1C1C1C] px-2 py-0.5 rounded-full border border-[#3C3C3C]/50 uppercase tracking-widest mt-1 inline-block">
                {user?.role ? user.role.replace('_', ' ') : ''}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="border-t border-[#1C1C1C] pt-6 space-y-4 text-xs font-light text-[#B5B5B5]">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#646464] uppercase flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#646464] uppercase flex items-center gap-1.5">
                <Smartphone className="h-3 w-3" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Not provided"
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Mail className="h-4 w-4 text-[#646464] shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-[#646464] uppercase font-bold tracking-wider block">Email Address</span>
                <span className="text-[#B5B5B5] font-medium">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="h-4 w-4 text-[#646464] shrink-0" />
              <div>
                <span className="text-[9px] text-[#646464] uppercase font-bold tracking-wider block">Designation</span>
                <span className="text-[#B5B5B5] font-medium">{user?.designation || 'Staff Member'}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-white hover:bg-[#B5B5B5] text-[#131313] py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-4"
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
        <div className="lg:col-span-7 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Security & Credentials</h2>
            <p className="text-[10px] text-[#646464] mt-0.5">Change your account password securely.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-[#646464] uppercase">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full bg-[#1C1C1C] border border-[#3C3C3C] text-white hover:bg-[#3C3C3C]/30 py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
