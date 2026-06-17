import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Building2, Mail, User, Lock, Loader2, Briefcase, Users, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    industry: '',
    teamSize: '1-5',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const { registerCompany } = useAuth();
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
    const { adminName, adminEmail, password, confirmPassword, agreeToTerms } = formData;

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
    if (!formData.companyEmail) {
      setFormData(prev => ({ ...prev, companyEmail: adminEmail }));
    }
    setStep(2);
  };

  const handlePrevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyName, companyEmail, industry, adminName, adminEmail, password } = formData;

    if (!companyName || !companyEmail) {
      return toast.error('Please enter both workspace name and email.');
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
    toast.success('Google authentication simulation active!');
  };

  return (
    <div className="min-h-screen bg-[#131313] grid grid-cols-1 lg:grid-cols-12 font-sans overflow-x-hidden">

      {/* Left Branding Showcase */}
      <AuthShowcase
        heading="Create Your Workspace Today"
        description="Join thousands of teams managing projects efficiently with Projexa."
      />

      {/* Right Form — no card, directly on surface */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-8 relative z-10 border-l border-[#1C1C1C]">

        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <Logo />
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="w-full max-w-sm flex items-center justify-between mb-5 text-[11px]">
            <span className={`font-semibold uppercase tracking-wider ${step === 1 ? 'text-white' : 'text-[#646464]'}`}>1. Personal Details</span>
            <div className="h-px bg-[#3C3C3C] flex-grow mx-3"></div>
            <span className={`font-semibold uppercase tracking-wider ${step === 2 ? 'text-white' : 'text-[#646464]'}`}>2. Workspace</span>
          </div>
        )}

        {/* Form area */}
        <div className="w-full max-w-sm space-y-5">

          {step === 1 && (
            <>
              {/* Header */}
              <div>
                <h2 className="text-[25px] font-medium text-white tracking-tight font-heading">
                  Create Account
                </h2>
                <p className="text-[15px] text-[#B5B5B5] mt-1 font-light">
                  Start your free journey
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleNextStep} className="space-y-3.5">

                {/* Full Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[#646464]" />
                    </div>
                    <input type="text" name="adminName" placeholder="Full Name" value={formData.adminName} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" required />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[#646464]" />
                    </div>
                    <input type="email" name="adminEmail" placeholder="EMAIL ADDRESS" value={formData.adminEmail} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" required />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-[#646464]" />
                      </div>
                      <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" required />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Confirm</label>
                    <div className="relative">
                      <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-[#646464]" />
                      </div>
                      <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" required />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center text-[13px]">
                  <label className="flex items-center space-x-2 text-[#B5B5B5] cursor-pointer hover:text-white transition duration-150">
                    <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="rounded border-[#3C3C3C] bg-[#131313] text-brand-primary focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5" />
                    <span className="font-light">I agree to Terms & Conditions</span>
                  </label>
                </div>

                {/* Continue */}
                <button type="submit" className="w-full auth-btn-primary">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-[#3C3C3C]"></div>
                <span className="text-[9px] text-[#646464] mx-3 uppercase tracking-wider font-semibold">OR</span>
                <div className="flex-grow border-t border-[#3C3C3C]"></div>
              </div>

              {/* Google */}
              <button onClick={handleGoogleSignUp} className="w-full auth-btn-google">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Sign In link */}
              <div className="text-center">
                <p className="text-[13px] text-[#B5B5B5] font-light">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#F3F3F3] hover:text-white font-semibold transition duration-150 ml-1">Sign In</Link>
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Header */}
              <div>
                <h2 className="text-[25px] font-medium text-white tracking-tight font-heading">
                  Workspace Setup
                </h2>
                <p className="text-[15px] text-[#B5B5B5] mt-1 font-light">
                  Configure your team's workspace
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">

                {/* Workspace Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Workspace Name</label>
                  <div className="relative">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-[#646464]" />
                    </div>
                    <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" required />
                  </div>
                </div>

                {/* Company Email */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Company Email</label>
                  <div className="relative">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[#646464]" />
                    </div>
                    <input type="email" name="companyEmail" placeholder="EMAIL ADDRESS" value={formData.companyEmail} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" required />
                  </div>
                </div>

                {/* Industry & Team Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Industry</label>
                    <div className="relative">
                      <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-[#646464]" />
                      </div>
                      <input type="text" name="industry" placeholder="INDUSTRY" value={formData.industry} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#B5B5B5] uppercase tracking-wider">Team Size</label>
                    <div className="relative">
                      <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-[#646464]" />
                      </div>
                      <select name="teamSize" value={formData.teamSize} onChange={handleChange} className="w-full auth-input text-sm text-white focus:outline-none pl-10 bg-[#131313]">
                        <option value="1-5">1-5</option>
                        <option value="6-20">6-20</option>
                        <option value="21-100">21-100</option>
                        <option value="100+">100+</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button type="button" onClick={handlePrevStep} className="flex-1 auth-btn-google flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 auth-btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Workspace</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center py-8">
              <CheckCircle2 className="h-14 w-14 text-[#F3F3F3] mx-auto animate-bounce" />
              <div className="space-y-1.5">
                <h2 className="text-2xl font-medium text-white tracking-tight font-heading">
                  Welcome to Projexa
                </h2>
                <p className="text-xs text-[#B5B5B5] font-light max-w-xs mx-auto leading-relaxed">
                  Your workspace is ready. Start collaborating now.
                </p>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full auth-btn-primary">
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;
