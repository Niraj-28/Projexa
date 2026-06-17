import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import { Lock, Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const TemporaryPasswordChange = () => {
  const { user, changePassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
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
      await changePassword(null, newPassword);
      toast.success('Password updated successfully! Welcome to Projexa.');
    } catch (err) {
      toast.error(err || 'Failed to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center p-6 relative font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="glass-card max-w-md w-full p-8 space-y-6 relative z-10 border border-[#3C3C3C]">
        <div className="flex justify-center">
          <Logo light={true} />
        </div>
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-2">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-medium text-white tracking-tight">Temporary Password Detected</h2>
          <p className="text-xs text-[#B5B5B5] font-light max-w-xs mx-auto leading-relaxed">
            Welcome, {user?.name}! Since your account was created by an administrator, you must update your password before proceeding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-semibold text-[#B5B5B5] uppercase tracking-wider">New Password</label>
            <div className="relative">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-[#646464]" />
              </div>
              <input
                type="password"
                placeholder="New Password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full auth-input text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-[#646464]" />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full auth-input text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex-1 auth-btn-google text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 auth-btn-primary disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemporaryPasswordChange;
