import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Lock, Loader2, KeyRound, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const TemporaryPasswordChange = () => {
  const navigate = useNavigate();
  const { user, changePassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      toast.success('Password updated successfully! Welcome to WorkArena.');
    } catch (err) {
      toast.error(err || 'Failed to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050811] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative font-sans">
      {/* Background spillover glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#124559]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-[#AEC3B0]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Floating Card Container (Fixed height to prevent scrolling) */}
      <div className="w-full max-w-[1000px] h-[580px] bg-white rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl relative z-10 p-2.5 gap-4">
        
        {/* Left Side: Auth Showcase Card */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <AuthShowcase
            heading="Secure Your Workspace"
            description="Please update your temporary password to secure your account. This ensures only you can access your dashboard."
          />
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-6 flex flex-col justify-between px-6 sm:px-10 py-6 h-full relative z-10 overflow-hidden">
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center">
            <div className="cursor-pointer mb-3" onClick={() => navigate('/')}>
              <Logo className="h-6 w-auto" />
            </div>
            <div className="inline-flex p-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-1.5">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h2 className="text-[26px] font-bold text-[#01161E] tracking-tight leading-none mb-1 font-heading">
              Change Password
            </h2>
            <p className="text-[12px] text-[#598392] font-light max-w-[320px]">
              Welcome, {user?.name}! Set a secure password to activate your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 my-auto py-2">
            
            {/* New Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-medium text-[#01161E]">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#F1F5F9]/60 border border-transparent rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#01161E] focus:outline-none focus:bg-white focus:border-[#124559] transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 inset-y-0 flex items-center text-[#598392] hover:text-[#01161E] transition duration-150"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-medium text-[#01161E]">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F1F5F9]/60 border border-transparent rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#01161E] focus:outline-none focus:bg-white focus:border-[#124559] transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 inset-y-0 flex items-center text-[#598392] hover:text-[#01161E] transition duration-150"
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={logout}
                className="flex-1 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#01161E] rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 shadow-sm"
              >
                Sign Out
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#124559] hover:bg-[#01161E] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="text-center pt-1">
            <button 
              onClick={logout} 
              className="text-xs text-[#598392] hover:text-[#01161E] font-medium transition duration-150 cursor-pointer"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemporaryPasswordChange;
