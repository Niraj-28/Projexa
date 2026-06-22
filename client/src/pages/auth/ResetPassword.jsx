import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error('Please fill in both fields.');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    try {
      setSubmitting(true);
      // Simulate network request delays
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Your password has been successfully reset.');
      setSuccess(true);
    } catch (err) {
      toast.error('Failed to reset your password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] grid grid-cols-1 lg:grid-cols-12 font-sans overflow-x-hidden">
      {/* Left Branding Showcase */}
      <AuthShowcase
        heading="Secure Your Workspace Access"
        description="Choose a strong, unique password to secure your personal dashboard and workspace credentials."
      />

      {/* Right Form */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-8 relative z-10 border-l border-[#1C1C1C]">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <Logo />
        </div>

        <div className="w-full max-w-sm space-y-6">
          {!success ? (
            <>
              {/* Header */}
              <div>
                <h2 className="text-[25px] font-medium text-white tracking-tight font-heading">
                  Reset Password
                </h2>
                <p className="text-[15px] text-[#B5B5B5] mt-1 font-light">
                  Enter your new password to regain access
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#646464]" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full auth-input text-sm text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#646464]" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full auth-input text-sm text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full auth-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-6 text-center py-4 bg-[#1C1C1C]/50 border border-[#3C3C3C] p-6 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400 font-bold">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Password Updated</h3>
                <p className="text-xs text-[#B5B5B5] font-light leading-relaxed">
                  Your new password is set. You can now log in to your WorkArea account dashboard.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full auth-btn-primary"
              >
                <span>Return to Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Links back to login */}
          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-[#B5B5B5] hover:text-white transition duration-150"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
