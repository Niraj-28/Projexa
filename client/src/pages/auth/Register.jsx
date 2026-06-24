import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRoute } from '../../utils/roleRoutes';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Building2, Mail, User, Lock, Loader2, Briefcase, Users, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    industry: '',
    subscriptionPlan: 'Free',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { registerCompany, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const { companyName, companyEmail } = formData;

    if (!companyName || !companyEmail) {
      return toast.error('Please enter both workspace name and email.');
    }

    // Auto-fill adminEmail with companyEmail if not set yet
    if (!formData.adminEmail) {
      setFormData(prev => ({ ...prev, adminEmail: companyEmail }));
    }

    setStep(2);
  };

  const handlePrevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyName, companyEmail, industry, adminName, adminEmail, password, confirmPassword, agreeToTerms } = formData;

    if (!adminName || !adminEmail || !password || !confirmPassword) {
      return toast.error('Please fill in all personal details.');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }
    if (!agreeToTerms) {
      return toast.error('You must agree to the Terms of Service.');
    }

    try {
      setSubmitting(true);
      await registerCompany({ companyName, companyEmail, industry, adminName, adminEmail, password });
      toast.success('Workspace Created Successfully!');
      setStep(3);
    } catch (err) {
      toast.error(err || 'Failed to register company workspace. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (!window.google) {
      return toast.error('Google Sign-In SDK is loading. Please try again in a moment.');
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes('your-google-client-id-here')) {
      return toast.error('Google Client ID is not configured.');
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          return toast.error('Google Sign-In was cancelled or failed.');
        }

        const accessToken = tokenResponse.access_token;
        try {
          setSubmitting(true);
          const res = await loginWithGoogle(accessToken);
          toast.success('Workspace Registered Successfully!');
          navigate(getHomeRoute(res.user.role));
        } catch (err) {
          toast.error(err || 'Failed to authenticate with Google.');
        } finally {
          setSubmitting(false);
        }
      },
    });

    tokenClient.requestAccessToken();
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
            heading="Create Your Workspace"
            description="Manage sprints, track real-time attendance, and complete tasks successfully under a secure workspace."
          />
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-6 flex flex-col justify-between px-6 sm:px-10 py-6 h-full relative z-10 overflow-hidden">

          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center">
            <div className="cursor-pointer mb-3" onClick={() => navigate('/')}>
              <Logo className="h-6 w-auto" />
            </div>
            {step < 3 && (
              <div className="w-full flex items-center justify-between mb-2 text-[9px] max-w-[240px] mx-auto">
                <span className={`font-semibold uppercase tracking-wider ${step === 1 ? 'text-[#111111]' : 'text-[#A3A3A3]'}`}>1. Workspace</span>
                <div className="h-px bg-[#E5E5E5] flex-grow mx-2"></div>
                <span className={`font-semibold uppercase tracking-wider ${step === 2 ? 'text-[#111111]' : 'text-[#A3A3A3]'}`}>2. Details</span>
              </div>
            )}
          </div>

          <div className="my-auto py-2">
            {step === 1 && (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none mb-1 font-heading">
                    Workspace Setup
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light">
                    Configure your team's workspace
                  </p>
                </div>

                <form onSubmit={handleNextStep} className="space-y-3.5">
                  {/* Workspace Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">Workspace Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Company Email */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">Company Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="companyEmail"
                        placeholder="EMAIL ADDRESS"
                        value={formData.companyEmail}
                        onChange={handleChange}
                        className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Industry & Team Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-medium text-[#111111]">Industry</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="industry"
                          placeholder="INDUSTRY"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-medium text-[#111111]">Subscription Plan</label>
                      <div className="relative">
                        <select
                          name="subscriptionPlan"
                          value={formData.subscriptionPlan}
                          onChange={handleChange}
                          className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200 font-normal"
                        >
                          <option value="Free">Free Plan (10 seats — ₹0/mo)</option>
                          <option value="Professional">Professional Plan (100 seats — ₹999/mo)</option>
                          <option value="Enterprise">Enterprise Plan (1,000 seats — ₹4,999/mo)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-grow border-t border-[#E5E5E5]"></div>
                  <span className="text-[8px] text-[#A3A3A3] mx-2.5 uppercase tracking-wider font-semibold">OR</span>
                  <div className="flex-grow border-t border-[#E5E5E5]"></div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] rounded-xl py-2.5 font-medium text-xs transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Sign Up with Google</span>
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none mb-1 font-heading">
                    Create Account
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light">
                    Start your free journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Full Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">Full Name</label>
                    <input
                      type="text"
                      name="adminName"
                      placeholder="Enter your name"
                      value={formData.adminName}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-medium text-[#111111]">Email</label>
                    <input
                      type="email"
                      name="adminEmail"
                      placeholder="Enter your email"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-medium text-[#111111]">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 inset-y-0 flex items-center text-[#737373] hover:text-[#111111]"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-medium text-[#111111]">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
                          required
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
                  </div>

                  {/* Terms */}
                  <div className="flex items-center text-[10px] pt-0.5">
                    <label className="flex items-center space-x-2 text-[#737373] cursor-pointer hover:text-[#111111] transition duration-150">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="rounded border-[#E5E5E5] bg-white text-[#111111] focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
                        required
                      />
                      <span className="font-light">I agree to Terms & Conditions</span>
                    </label>
                  </div>

                  {/* Nav buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto animate-bounce" />
                <div className="space-y-1.5">
                  <h2 className="text-[25px] font-bold text-[#111111] tracking-tight leading-none font-heading">
                    Welcome to WorkArena
                  </h2>
                  <p className="text-[12px] text-[#737373] font-light max-w-xs mx-auto leading-relaxed">
                    Your workspace is ready. Start collaborating now.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (formData.subscriptionPlan !== 'Free') {
                      navigate(`/company/subscription?checkout=${formData.subscriptionPlan}`);
                    } else {
                      navigate('/dashboard');
                    }
                  }} 
                  className="w-full bg-[#111111] hover:bg-[#000000] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Link */}
          {step < 3 && (
            <div className="text-center pt-1">
              <p className="text-xs text-[#737373] font-light">
                Already have an account?{' '}
                <Link to="/login" className="text-[#111111] hover:underline font-bold transition duration-150 ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;
