import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Please enter your email address.');
    }

    try {
      setSubmitting(true);
      const res = await forgotPassword(email);
      toast.success(res?.message || 'Instructions sent successfully.');
      setSuccess(true);
    } catch (err) {
      toast.error(err || 'Failed to trigger password recovery. Check your email address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F4F5F9] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative font-sans">
      {/* Background spillover glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#5A42EC]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-[#C0B6FC]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Floating Card Container (Fixed height to prevent scrolling) */}
      <div className="w-full max-w-[1000px] h-[580px] bg-white rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl relative z-10 p-2.5 gap-4">
        
        {/* Left Side: Auth Showcase Card */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <AuthShowcase
            heading="Recover Account"
            description="Don't worry. Enter your registered email address and we'll help you reset your password in seconds."
          />
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-6 flex flex-col justify-between px-6 sm:px-10 py-6 h-full relative z-10 overflow-hidden">
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center">
            <div className="cursor-pointer mb-4" onClick={() => navigate('/')}>
              <Logo className="h-6 w-auto" />
            </div>
            <h2 className="text-[26px] font-bold text-[#0F172A] tracking-tight leading-none mb-1.5 font-heading">
              Forgot Password
            </h2>
            <p className="text-[12px] text-[#64748B] font-light">
              Enter your email to receive recovery instructions
            </p>
          </div>

          <div className="my-auto py-4 w-full">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-medium text-[#0F172A]">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4F5F9]/60 border border-transparent rounded-xl px-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#5A42EC] transition-all duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#5A42EC] hover:bg-[#4831D4] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4 bg-[#F4F5F9]/30 border border-[#E2E8F0] p-5 rounded-2xl">
                <div className="h-10 w-10 rounded-full bg-[#5A42EC]/10 border border-[#5A42EC]/20 flex items-center justify-center mx-auto text-[#5A42EC] font-bold">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[#0F172A] font-heading">Check Your Inbox</h3>
                  <p className="text-[11px] text-[#64748B] font-light leading-relaxed">
                    Instructions sent to <strong className="text-[#0F172A] font-mono">{email}</strong>. Use the link to reset your password.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/reset-password')}
                  className="w-full bg-[#5A42EC] hover:bg-[#4831D4] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Go to Reset Password</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Link */}
          <div className="text-center pt-1">
            <Link to="/login" className="text-xs text-[#0F172A] font-bold hover:underline transition duration-150 inline-flex items-center justify-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
