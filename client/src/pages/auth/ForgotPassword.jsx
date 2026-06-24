import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Request Email, 2 = Verify OTP, 3 = Reset Password, 4 = Success
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(new Array(6).fill(''));
  const [resetToken, setResetToken] = useState('');
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const otpInputsRef = useRef([]);
  const { forgotPassword, verifyOtp, resetForgottenPassword } = useAuth();
  const navigate = useNavigate();

  // Auto focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Countdown timer effect for OTP resend cooldown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startResendTimer = () => {
    setTimer(60);
  };

  const handleOtpChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, ''); // allow only numbers
    const newOtpValues = [...otpValues];
    newOtpValues[index] = val;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (val !== '' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otpValues[index] === '' && index > 0) {
        // Focus previous input on backspace if current is empty
        otpInputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpValues(digits);
      // Focus the last input
      if (otpInputsRef.current[5]) {
        otpInputsRef.current[5].focus();
      }
    } else {
      toast.error('Please paste a valid 6-digit numeric OTP');
    }
  };

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email address.');
    }

    try {
      setSubmitting(true);
      const res = await forgotPassword(email.trim());
      toast.success(res?.message || 'Verification code sent!', { icon: '🔑' });
      setStep(2);
      startResendTimer();
      setOtpValues(new Array(6).fill('')); // Reset OTP inputs
    } catch (err) {
      toast.error(err || 'Failed to send OTP code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      return toast.error('Please enter the 6-digit verification code.');
    }

    try {
      setSubmitting(true);
      const res = await verifyOtp(email.trim(), fullOtp);
      toast.success('Code verified successfully!', { icon: '✅' });
      setResetToken(res.resetToken);
      setStep(3);
    } catch (err) {
      toast.error(err || 'Invalid or expired verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill in both fields.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    try {
      setSubmitting(true);
      await resetForgottenPassword(resetToken, newPassword);
      toast.success('Password updated successfully!', { icon: '🔒' });
      setStep(4);
    } catch (err) {
      toast.error(err || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F5F5F5] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative font-sans">
      {/* Background spillover glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#111111]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-[#737373]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

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
            <div className="cursor-pointer mb-3" onClick={() => navigate('/')}>
              <Logo className="h-6 w-auto" />
            </div>
            {step < 4 && (
              <div className="w-full flex items-center justify-between mb-2 text-[9px] max-w-[240px] mx-auto">
                <span className={`font-semibold uppercase tracking-wider ${step === 1 ? 'text-[#111111]' : 'text-[#A3A3A3]'}`}>1. Request</span>
                <div className="h-px bg-[#E5E5E5] flex-grow mx-2"></div>
                <span className={`font-semibold uppercase tracking-wider ${step === 2 ? 'text-[#111111]' : 'text-[#A3A3A3]'}`}>2. Verify</span>
                <div className="h-px bg-[#E5E5E5] flex-grow mx-2"></div>
                <span className={`font-semibold uppercase tracking-wider ${step === 3 ? 'text-[#111111]' : 'text-[#A3A3A3]'}`}>3. Reset</span>
              </div>
            )}
          </div>

          <div className="my-auto py-2 w-full">
            {step === 1 && (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none mb-1 font-heading">
                    Forgot Password
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light">
                    Enter your email to receive verification OTP code
                  </p>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-4">
                  {/* Email Field */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none mb-1 font-heading">
                    Verify Code
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light max-w-xs mx-auto">
                    We sent a 6-digit verification code to <span className="font-semibold text-[#111111]">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* 6 SPLIT INPUTS */}
                  <div className="flex justify-between items-center gap-2 max-w-[300px] mx-auto py-1">
                    {otpValues.map((value, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        value={value}
                        onChange={(e) => handleOtpChange(e.target, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        onPaste={handleOtpPaste}
                        className="w-10 h-10 text-center bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl text-md font-bold text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        required
                        disabled={submitting}
                        placeholder="•"
                      />
                    ))}
                  </div>

                  <p className="text-[10px] text-[#A3A3A3] text-center max-w-xs mx-auto leading-relaxed">
                    Check your server console logs to find the verification code.
                  </p>

                  <div className="flex items-center justify-between text-[11px] px-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[#737373] hover:text-[#111111] transition duration-150 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Change Email</span>
                    </button>
                    {timer > 0 ? (
                      <span className="text-[#737373] font-light">
                        Resend in {timer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-[#111111] hover:underline font-bold transition duration-150 cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none mb-1 font-heading">
                    New Password
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light">
                    Create a secure password for your account
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-3">
                  {/* New Password */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        required
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 inset-y-0 flex items-center text-[#737373] hover:text-[#111111]"
                      >
                        {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        required
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 inset-y-0 flex items-center text-[#737373] hover:text-[#111111]"
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer pt-3"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-[#111111] mx-auto animate-bounce" />
                <div className="space-y-1.5">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none font-heading">
                    Password Reset!
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light max-w-xs mx-auto leading-relaxed">
                    Your password has been successfully updated. You can now log in.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Link */}
          {step < 4 && (
            <div className="text-center pt-1">
              <Link
                to="/login"
                className="text-xs text-[#737373] font-light hover:text-[#111111] transition duration-150 inline-flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
