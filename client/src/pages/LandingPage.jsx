import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomeRoute } from '../utils/roleRoutes';
import Logo from '../components/Logo';
import {
  ArrowRight,
  Check,
  Users,
  FolderGit2,
  CheckSquare,
  Clock,
  LogOut,
  Menu,
  X,
  Shield,
  Lock,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Star,
  CheckCircle2,
  Building2,
  CalendarDays,
  Activity,
  FileText,
  CheckCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  const getWorkspaceRoute = () => (user ? getHomeRoute(user.role) : '/login');

  const handleDemoClick = () => {
    toast.success('Demo booking requested! Our sales team will email you shortly.');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const MockTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E2E8F0] px-2 py-1 rounded shadow-md text-[9px] font-medium font-sans">
          <p className="text-[#0F172A]">{payload[0].name || 'Value'}: <span className="font-bold text-[#5A42EC]">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-[#CBD5E1] selection:text-[#0F172A] overflow-x-hidden relative">

      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] h-20 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(getWorkspaceRoute())}>
          <Logo className="text-[#0F172A]" light={true} />
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-[#64748B]">
          <a href="#features" className="hover:text-[#0F172A] transition duration-150">Features</a>
          <a href="#pricing" className="hover:text-[#0F172A] transition duration-150">Pricing</a>
          <a href="#faq" className="hover:text-[#0F172A] transition duration-150">FAQs</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to={getWorkspaceRoute()}
                className="bg-[#0F172A] text-white hover:bg-[#5A42EC] px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition duration-150 shadow"
              >
                Go to Workspace
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A] transition duration-150 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A] transition duration-150">
                Login
              </Link>
              <Link
                to="/register-company"
                className="bg-[#5A42EC] hover:bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition duration-150 shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button className="md:hidden p-2 text-[#0F172A] cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-white border-b border-[#E2E8F0] p-6 shadow-xl flex flex-col space-y-4 md:hidden z-50 animate-in fade-in duration-200">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0F172A]">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0F172A]">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#0F172A]">FAQs</a>
            <div className="border-t border-[#E2E8F0] pt-4 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link
                    to={getWorkspaceRoute()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-[#0F172A] text-white py-2.5 rounded-lg text-xs font-semibold"
                  >
                    Go to Workspace
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#64748B] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-[#64748B]">
                    Login
                  </Link>
                  <Link
                    to="/register-company"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-[#5A42EC] text-white py-2.5 rounded-lg text-xs font-semibold"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center bg-gradient-to-b from-[#EFF6E0]/40 to-white overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">

          {/* Left Column (45%) */}
          <div className="lg:col-span-5 space-y-6 text-left">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.08] font-heading">
              Organize Work.<br />
              Empower Teams.<br />
              Scale Organizations.
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-md font-medium">
              Manage projects, tasks, teams, and workspaces from one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to="/register-company"
                className="w-full sm:w-auto text-center bg-[#5A42EC] hover:bg-[#0F172A] text-white px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px]"
              >
                Start Free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto text-center bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#ECE9FF]/40 px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Book Demo
              </button>
            </div>

            {/* Stats list */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4">
              <div>
                <p className="text-lg font-bold text-[#0F172A] font-heading">10K+</p>
                <p className="text-[10px] text-[#64748B] font-semibold uppercase font-mono">Users</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#0F172A] font-heading">500+</p>
                <p className="text-[10px] text-[#64748B] font-semibold uppercase font-mono">Organizations</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#0F172A] font-heading">99.9%</p>
                <p className="text-[10px] text-[#64748B] font-semibold uppercase font-mono">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Column - Large Dashboard Mockup (55%) */}
          <div className="lg:col-span-7 relative w-full flex flex-col items-center">
            <div className="absolute inset-0 bg-[#CBD5E1]/15 blur-3xl rounded-full pointer-events-none transform scale-95"></div>

            {/* High-Fidelity Mockup */}
            <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden text-xs select-none relative z-10 text-left">
              {/* Header */}
              <div className="h-12 px-5 bg-[#F4F5F9] border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="font-bold text-[11px] text-[#0F172A] tracking-tight uppercase">Workspace Dashboard</span>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              {/* Stats overview grids */}
              <div className="p-4 grid grid-cols-4 gap-3 bg-[#F4F5F9] border-b border-[#E2E8F0]">
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-wider block">Projects</span>
                  <span className="text-sm font-bold text-[#0F172A]">24</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-wider block">Tasks</span>
                  <span className="text-sm font-bold text-[#0F172A]">148</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-wider block">Team Members</span>
                  <span className="text-sm font-bold text-[#0F172A]">16</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-wider block">Completion</span>
                  <span className="text-sm font-bold text-green-500">78%</span>
                </div>
              </div>

              {/* Charts & Tasks */}
              <div className="p-4 space-y-4 bg-white">
                {/* Activity Graph */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-[#94A3B8] font-bold uppercase tracking-wider block">Activity Graph</span>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Mon', count: 12 },
                        { name: 'Tue', count: 24 },
                        { name: 'Wed', count: 18 },
                        { name: 'Thu', count: 32 },
                        { name: 'Fri', count: 22 },
                        { name: 'Sat', count: 15 },
                        { name: 'Sun', count: 28 }
                      ]} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5A42EC" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#5A42EC" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={7} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={7} tickLine={false} />
                        <Tooltip content={<MockTooltip />} />
                        <Area type="monotone" dataKey="count" stroke="#5A42EC" strokeWidth={1.2} fillOpacity={1} fill="url(#heroGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
                  <span className="text-[8.5px] text-[#94A3B8] font-bold uppercase tracking-wider block">Recent Tasks</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-[#F4F5F9] border border-[#E2E8F0] text-[10px]">
                      <span className="font-semibold text-[#0F172A]">Integrate tenant user invite models</span>
                      <span className="bg-red-100 text-red-500 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">High</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-[#F4F5F9] border border-[#E2E8F0] text-[10px]">
                      <span className="font-semibold text-[#0F172A]">Re-check platform subscriptions & roles</span>
                      <span className="bg-yellow-100 text-yellow-500 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TRUSTED BY SECTION */}
      <section className="py-8 bg-white border-y border-[#E2E8F0] relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[15px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            Trusted By:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 text-sm font-extrabold text-[#64748B]/60 uppercase tracking-widest font-heading">
            <span className="hover:text-[#0F172A] transition duration-150">Google</span>
            <span className="hover:text-[#0F172A] transition duration-150">Microsoft</span>
            <span className="hover:text-[#0F172A] transition duration-150">Spotify</span>
            <span className="hover:text-[#0F172A] transition duration-150">Netflix</span>
            <span className="hover:text-[#0F172A] transition duration-150">Adobe</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#F4F5F9] border-b border-[#E2E8F0] relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Everything Your Team Needs
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">Deploy robust workspace tools designed for organizational velocity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {/* Card 1 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-3 hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 relative group cursor-default">
              <div className="h-9 w-9 rounded-lg bg-[#ECE9FF] flex items-center justify-center border border-[#CBD5E1]/30 text-[#5A42EC] group-hover:scale-105 transition-transform">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Project Management</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-light">
                Plan, track, and collaborate on any project with ease. Manage milestones and burndown metrics.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-3 hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 relative group cursor-default">
              <div className="h-9 w-9 rounded-lg bg-[#ECE9FF] flex items-center justify-center border border-[#CBD5E1]/30 text-[#5A42EC] group-hover:scale-105 transition-transform">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Task Tracking</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-light">
                Organize sprint backlogs, task assignments, and checkboxes to stay aligned on product priorities.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-3 hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 relative group cursor-default">
              <div className="h-9 w-9 rounded-lg bg-[#ECE9FF] flex items-center justify-center border border-[#CBD5E1]/30 text-[#5A42EC] group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Team Collaboration</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-light">
                Communicate, share updates, assign roles, and log shifts within secure organizational channels.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-3 hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 relative group cursor-default">
              <div className="h-9 w-9 rounded-lg bg-[#ECE9FF] flex items-center justify-center border border-[#CBD5E1]/30 text-[#5A42EC] group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Real-Time Reports</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-light">
                View metrics, member attendance rates, and progress reports instantly. Export secure documents.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-3 hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 relative group cursor-default">
              <div className="h-9 w-9 rounded-lg bg-[#ECE9FF] flex items-center justify-center border border-[#CBD5E1]/30 text-[#5A42EC] group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Shared Calendar</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-light">
                Coordinate team shifts, holidays, and release deadlines with interactive calendars.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-3 hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 relative group cursor-default">
              <div className="h-9 w-9 rounded-lg bg-[#ECE9FF] flex items-center justify-center border border-[#CBD5E1]/30 text-[#5A42EC] group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Advanced Security</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-light">
                Ironclad database-level tenant isolation, encrypted logs, and enterprise-grade compliance models.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 6. HOW IT WORKS (Connected Horizontal Flowchart) */}
      <section className="py-20 bg-[#F4F5F9] border-b border-[#E2E8F0] relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">Get your organization up and running on WorkArena in five simple stages.</p>
          </div>

          {/* Connected horizontal items */}
          <div className="flex flex-col lg:flex-row items-center justify-center max-w-5xl mx-auto gap-8 lg:gap-0 pt-6">
            {[
              { num: '1', title: 'Create Workspace', desc: 'Spin up isolated tenant URLs' },
              { num: '2', title: 'Invite Team', desc: 'Add managers & staff accounts' },
              { num: '3', title: 'Create Projects', desc: 'Draft sprint deliverables' },
              { num: '4', title: 'Assign Tasks', desc: 'Set backlogs and priorities' },
              { num: '5', title: 'Track Progress', desc: 'Monitor charts in real time' }
            ].map((step, sIdx) => (
              <React.Fragment key={sIdx}>
                {/* Step circle */}
                <div className="flex flex-col items-center text-center space-y-3 max-w-[160px] relative z-10">
                  <div className="h-10 w-10 rounded-full bg-[#5A42EC] text-white flex items-center justify-center font-bold font-heading text-sm shadow-md border-4 border-white group-hover:scale-105 transition-transform duration-200">
                    {step.num}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#0F172A] font-heading">{step.title}</h5>
                    <p className="text-[10px] text-[#64748B] font-light leading-normal mt-0.5">{step.desc}</p>
                  </div>
                </div>

                {/* Connecting Line (hidden on last step) */}
                {sIdx < 4 && (
                  <div className="hidden lg:block flex-grow h-0.5 bg-[#E2E8F0] relative min-w-[40px] translate-y-[-24px] z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#5A42EC]"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* 7. PRODUCT SCREENSHOTS (4 Screens Grid) */}
      <section className="py-20 bg-white border-b border-[#E2E8F0] relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Sleek Modules. Unified Design.
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">Inspect the visual interfaces of the primary workspace modules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {/* Screen 1: Dashboard */}
            <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#CBD5E1] transition duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block font-mono">MODULE A</span>
                <h4 className="font-bold text-xs text-[#0F172A] mt-0.5 mb-2 font-heading">Workspace Dashboard</h4>
                <p className="text-[11px] text-[#64748B] font-light leading-relaxed mb-4">
                  A high-fidelity landing board showing daily attendance ratios, task metrics, and banner greetings.
                </p>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl space-y-2 shadow-3xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-bold text-[9px] text-[#0F172A]">Daily Attendance Rate</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#5A42EC] h-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* Screen 2: Projects */}
            <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#CBD5E1] transition duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block font-mono">MODULE B</span>
                <h4 className="font-bold text-xs text-[#0F172A] mt-0.5 mb-2 font-heading">Projects Directory</h4>
                <p className="text-[11px] text-[#64748B] font-light leading-relaxed mb-4">
                  Directory of sprint releases, manager assignments, and dynamic milestones progress indicators.
                </p>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl space-y-2 shadow-3xs">
                <div className="flex justify-between text-[9px] font-bold text-[#0F172A]">
                  <span>Vite Frontend Redesign</span>
                  <span>75%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#5A42EC] h-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            {/* Screen 3: Team */}
            <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#CBD5E1] transition duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block font-mono">MODULE C</span>
                <h4 className="font-bold text-xs text-[#0F172A] mt-0.5 mb-2 font-heading">Team Directories</h4>
                <p className="text-[11px] text-[#64748B] font-light leading-relaxed mb-4">
                  Detailed profile directories linking employees, scoped roles, and active check-in timestamps.
                </p>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between shadow-3xs text-[9px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 bg-gradient-to-tr from-[#5A42EC] to-[#64748B] rounded-full text-white text-[8px] font-bold flex items-center justify-center">N</div>
                  <span className="font-bold text-[#0F172A]">Niraj Kotadiya</span>
                </div>
                <span className="bg-[#ECE9FF] text-[#5A42EC] px-2 py-0.5 rounded-full font-bold border border-[#CBD5E1]/30">Owner</span>
              </div>
            </div>

            {/* Screen 4: Analytics */}
            <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#CBD5E1] transition duration-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block font-mono">MODULE D</span>
                <h4 className="font-bold text-xs text-[#0F172A] mt-0.5 mb-2 font-heading">Analytics Reports</h4>
                <p className="text-[11px] text-[#64748B] font-light leading-relaxed mb-4">
                  Visual reporting graphs compiling overall task ratios, staff presence trends, and sprint activity.
                </p>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-xl flex items-center justify-center shadow-3xs">
                <span className="text-[9px] font-mono text-[#64748B] flex items-center gap-1"><Activity className="h-3 w-3 text-[#5A42EC]" /> Visual Graphs Connected</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. ANALYTICS SECTION */}
      <section className="py-20 bg-[#F4F5F9] border-b border-[#E2E8F0] relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Insights That Drive Productivity
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">View real-time workspace metrics synthesized directly in beautiful graphical charts.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">

            {/* Donut Chart: Task Completion */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition duration-200 flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="border-b border-[#E2E8F0] pb-2 flex justify-between items-center mb-4">
                  <span className="text-[9px] font-bold text-[#94A3B8] uppercase block">Task Completion</span>
                  <span className="text-[9px] font-mono text-[#5A42EC]">Donut Chart</span>
                </div>
                <div className="h-28 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: 148, color: '#5A42EC' },
                          { name: 'Remaining', value: 42, color: '#ECE9FF' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={40}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        <Cell fill="#5A42EC" />
                        <Cell fill="#ECE9FF" />
                      </Pie>
                      <Tooltip content={<MockTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex justify-between items-center text-[9px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                <span>Completed: 148 (78%)</span>
                <span>Total: 190</span>
              </div>
            </div>

            {/* BarChart: Team Performance */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition duration-200 flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="border-b border-[#E2E8F0] pb-2 flex justify-between items-center mb-4">
                  <span className="text-[9px] font-bold text-[#94A3B8] uppercase block">Team Performance</span>
                  <span className="text-[9px] font-mono text-[#5A42EC]">Bar Chart</span>
                </div>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Team A', tasks: 32 },
                      { name: 'Team B', tasks: 45 },
                      { name: 'Team C', tasks: 28 },
                      { name: 'Team D', tasks: 18 }
                    ]} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={7} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={7} tickLine={false} />
                      <Tooltip content={<MockTooltip />} />
                      <Bar dataKey="tasks" fill="#64748B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] text-[9px] text-[#64748B] text-center">
                <span>Task output counts per sprint division</span>
              </div>
            </div>

            {/* AreaChart: Workspace Activity */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition duration-200 flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="border-b border-[#E2E8F0] pb-2 flex justify-between items-center mb-4">
                  <span className="text-[9px] font-bold text-[#94A3B8] uppercase block">Workspace Activity</span>
                  <span className="text-[9px] font-mono text-[#5A42EC]">Area Chart</span>
                </div>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Wk 1', activity: 220 },
                      { name: 'Wk 2', activity: 380 },
                      { name: 'Wk 3', activity: 310 },
                      { name: 'Wk 4', activity: 480 }
                    ]} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                      <defs>
                        <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5A42EC" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#5A42EC" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={7} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={7} tickLine={false} />
                      <Tooltip content={<MockTooltip />} />
                      <Area type="monotone" dataKey="activity" stroke="#5A42EC" strokeWidth={1.5} fillOpacity={1} fill="url(#analyticsGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] text-[9px] text-[#64748B] text-center">
                <span>Average monthly query logs per workspace node</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-20 bg-white border-b border-[#E2E8F0] relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Flexible Workspace Plans
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">Select a layout matching your active organizations and scales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto items-stretch">
            {/* Starter Plan */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition duration-200 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Starter</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-[#0F172A]">Free</span>
                </div>
                <p className="text-[11px] text-[#64748B] font-light leading-relaxed">
                  Perfect for small teams launching their first digital workspace directories.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B] font-medium">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-green-500" /><span>Up to 3 workspaces</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-green-500" /><span>5 Users maximum</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-green-500" /><span>Basic Kanban Boards</span></li>
                </ul>
              </div>
              <Link to="/register-company" className="w-full text-center py-2.5 mt-6 rounded-lg font-bold uppercase tracking-wider bg-[#F4F5F9] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#ECE9FF]/40 text-xs block transition duration-150">
                Get Started
              </Link>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-[#5A42EC] text-white border-2 border-[#5A42EC] rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition duration-200 shadow-md relative">
              <span className="absolute top-0 right-6 -translate-y-1/2 bg-[#ECE9FF] text-[#0F172A] border border-[#5A42EC] px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider">Most Popular</span>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]/80">Pro</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">₹499</span>
                  <span className="text-xs text-[#E2E8F0]/80 ml-1">/ month</span>
                </div>
                <p className="text-[11px] text-[#E2E8F0]/70 font-light leading-relaxed">
                  Ideal for growing entities scaling multi-tenant workspace separation.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-white/20 text-xs text-white">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-[#AEC3B0]" /><span>Unlimited workspaces</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-[#AEC3B0]" /><span>50 Users maximum</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-[#AEC3B0]" /><span>Advanced tenant white-labeling</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-[#AEC3B0]" /><span>Priority Support</span></li>
                </ul>
              </div>
              <Link to="/register-company" className="w-full text-center py-2.5 mt-6 rounded-lg font-bold uppercase tracking-wider bg-white text-[#5A42EC] hover:bg-slate-50 text-xs block transition duration-150">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition duration-200 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Enterprise</h3>
                <div className="flex items-baseline">
                  <span className="text-xl font-extrabold text-[#0F172A]">Custom</span>
                </div>
                <p className="text-[11px] text-[#64748B] font-light leading-relaxed">
                  Custom parameters for conglomerates requiring high-isolation databases.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B] font-medium">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-green-500" /><span>SSO & Dedicated DB options</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-green-500" /><span>Unlimited everything</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-green-500" /><span>Isolated server instances</span></li>
                </ul>
              </div>
              <button onClick={handleDemoClick} className="w-full text-center py-2.5 mt-6 rounded-lg font-bold uppercase tracking-wider bg-[#F4F5F9] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#ECE9FF]/40 text-xs block transition duration-150 cursor-pointer">
                Contact Sales
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="py-20 bg-[#F4F5F9] border-b border-[#E2E8F0] relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Trusted by Product Leaders
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">Read testimonials from managers running isolated sub-workspaces.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {/* Card 1 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-4 hover:shadow-md transition duration-200">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-[#0F172A] font-medium leading-relaxed italic">
                "WorkArena transformed our workflow."
              </p>
              <div className="border-t border-[#E2E8F0] pt-3 text-[10px]">
                <p className="font-bold text-[#0F172A]">Aarav Mehta</p>
                <p className="text-[#64748B] font-mono mt-0.5">CEO at Tata Consultancy Services</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-4 hover:shadow-md transition duration-200">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-[#0F172A] font-medium leading-relaxed italic">
                "Perfect for growing organizations."
              </p>
              <div className="border-t border-[#E2E8F0] pt-3 text-[10px]">
                <p className="font-bold text-[#0F172A]">Priya Sharma</p>
                <p className="text-[#64748B] font-mono mt-0.5">Director of Ops at Infosys</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl bg-white space-y-4 hover:shadow-md transition duration-200">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-[#0F172A] font-medium leading-relaxed italic">
                "Simple, powerful, and scalable."
              </p>
              <div className="border-t border-[#E2E8F0] pt-3 text-[10px]">
                <p className="font-bold text-[#0F172A]">Karthik Iyer</p>
                <p className="text-[#64748B] font-mono mt-0.5">Product Lead at Wipro</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-24 bg-gradient-to-r from-[#F5F5F5] to-[#111111] text-white relative overflow-hidden z-10 text-center border-t border-[#F5F5F5]">
        <div className="absolute inset-0 bg-[#F5F5F5]/5 blur-3xl rounded-full pointer-events-none transform scale-90"></div>

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto px-6">
          <span className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-widest block font-mono">GET STARTED IMMEDIATELY</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight leading-tight font-heading">
            Ready to Build Your Workspace?
          </h2>
          <p className="text-xs sm:text-sm text-[#E2E8F0]/80 leading-relaxed font-light">
            Start Managing Projects Smarter Today.
          </p>
          <div className="pt-2">
            <Link
              to="/register-company"
              className="inline-block bg-[#ECE9FF] hover:bg-[#CBD5E1] text-[#0F172A] px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer hover:translate-y-[-1px]"
            >
              Start Free
            </Link>
          </div>
          <p className="text-[9px] text-[#E2E8F0]/40 font-mono">
            Setup takes less than 2 minutes.
          </p>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-white text-[#64748B] py-16 px-6 sm:px-12 border-t border-[#E2E8F0] text-left text-xs font-medium relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-[#E2E8F0] pb-12">

          <div className="space-y-4">
            <Logo light={false} />
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xs font-medium">
              Enterprise SaaS multi-tenant workspace platform built for secure department separation and compliance tracking.
            </p>
          </div>

          <div>
            <h5 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-4 font-heading">Product</h5>
            <ul className="space-y-2.5 text-[11px]">
              <li><a href="#features" className="hover:text-[#0F172A] transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#0F172A] transition">Pricing</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-4 font-heading">Resources</h5>
            <ul className="space-y-2.5 text-[11px]">
              <li><a href="#" className="hover:text-[#0F172A] transition">Blog</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition">Documentation</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition">Support</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider mb-4 font-heading">Company</h5>
            <ul className="space-y-2.5 text-[11px]">
              <li><a href="#" className="hover:text-[#0F172A] transition">About</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition">Contact</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition">Careers</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Copyright © WorkArena</span>
          <div className="flex space-x-6 text-[#64748B] font-semibold">
            <a href="#" className="hover:text-[#0F172A] transition font-heading">LinkedIn</a>
            <a href="#" className="hover:text-[#0F172A] transition font-heading">GitHub</a>
            <a href="#" className="hover:text-[#0F172A] transition font-heading">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
