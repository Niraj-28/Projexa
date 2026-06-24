import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRoute } from '../../utils/roleRoutes';
import Logo from '../../components/Logo';
import AuthShowcase from '../../components/AuthShowcase';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Please enter both email and password.');
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      toast.success('Welcome back to WorkArena!');
      const loggedUser = res.user;
      navigate(getHomeRoute(loggedUser.role));
    } catch (err) {
      toast.error(err || 'Failed to login. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
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
          toast.success('Welcome back to WorkArena!');
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
    <div className="h-screen w-screen bg-[#F4F5F9] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative font-sans">
      {/* Background spillover glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#5A52EC]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-[#C0B6FC]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Floating Card Container (Fixed height to prevent scrolling) */}
      <div className="w-full max-w-[1000px] h-[580px] bg-white rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl relative z-10 p-2.5 gap-4">

        {/* Left Side: Auth Showcase Card */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <AuthShowcase
            heading="Get Everything Done"
            description="Manage sprints, track real-time attendance, and complete tasks successfully under a secure workspace."
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
              Welcome Back
            </h2>
            <p className="text-[12px] text-[#64748B] font-light">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 my-auto">

            {/* Email Field */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-medium text-[#0F172A]">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F4F5F9]/60 border border-transparent rounded-xl px-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#5A42EC] transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-medium text-[#0F172A]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F4F5F9]/60 border border-transparent rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#5A42EC] transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 inset-y-0 flex items-center text-[#64748B] hover:text-[#0F172A] transition duration-150"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <label className="flex items-center space-x-2 text-[#64748B] cursor-pointer hover:text-[#0F172A] transition duration-150">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E2E8F0] bg-white text-[#5A42EC] focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
                />
                <span className="font-light">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[#0F172A] hover:underline transition duration-150 font-medium"
              >
                Forgot Password
              </Link>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0c0c0fff] hover:bg-[#1a1a24ff] text-white rounded-xl py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-[#F4F5F9] border border-[#E2E8F0] text-[#0F172A] rounded-xl py-2.5 font-medium text-xs transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Sign In with Google</span>
              </button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="text-center pt-1">
            <p className="text-xs text-[#64748B] font-light">
              Don't have an account?{' '}
              <Link to="/register-company" className="text-[#0F172A] hover:underline font-bold transition duration-150 ml-1">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
