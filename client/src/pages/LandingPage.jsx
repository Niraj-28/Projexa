import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomeRoute } from '../utils/roleRoutes';
import Logo from '../components/Logo';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  Users,
  FolderGit2,
  CheckSquare,
  FileBarChart2,
  CalendarDays,
  Activity,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const getWorkspaceRoute = () => (user ? getHomeRoute(user.role) : '/login');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleDemoClick = () => {
    toast.success('Demo booking requested! Our sales team will email you shortly.');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const faqs = [
    {
      q: "What is WorkArea?",
      a: "WorkArea is an enterprise-grade SaaS platform combining project boards, team sprints, employee attendance tracking, and leaves management into one unified, multi-tenant workspace."
    },
    {
      q: "How does pricing work?",
      a: "We offer Starter plans for small teams (up to 10 employees, 5 projects), a Professional tier at Rs. 999/month (100 employees, unlimited projects), and customized Enterprise options with dedicated SLAs."
    },
    {
      q: "Can I invite my team?",
      a: "Yes! Once you register your company workspace, you (the Company Admin) can onboard Managers and Employees from your dashboard. Managers can also invite team members."
    },
    {
      q: "Is data secure?",
      a: "Absolutely. WorkArea isolates data by company tenant ID, encrypts passwords using bcrypt, uses secure JSON Web Tokens for API requests, and maintains regular database backups."
    }
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-[#F3F3F3] font-sans selection:bg-[#F3F3F3] selection:text-[#131313] overflow-x-hidden relative">
      
      {/* Background ambient glows */}
      <div className="linear-glow w-[600px] h-[600px] top-[-100px] left-1/2 -translate-x-1/2 opacity-60 pointer-events-none"></div>
      <div className="linear-glow w-[500px] h-[500px] top-[1400px] left-[-10%] opacity-20 pointer-events-none"></div>
      <div className="linear-glow w-[600px] h-[600px] top-[2600px] right-[-10%] opacity-30 pointer-events-none"></div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 linear-grid-bg pointer-events-none opacity-50"></div>

      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-[#131313]/85 backdrop-blur-md border-b border-[#1C1C1C] h-16 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(getWorkspaceRoute())}>
          <Logo className="text-white" light={true} />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-[#B5B5B5]">
          <a href="#features" className="hover:text-white transition duration-150">Features</a>
          <a href="#modules" className="hover:text-white transition duration-150">Modules</a>
          <a href="#pricing" className="hover:text-white transition duration-150">Pricing</a>
          <a href="#about" className="hover:text-white transition duration-150">About</a>
          <a href="#contact" className="hover:text-white transition duration-150">Contact</a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to={getWorkspaceRoute()}
                className="bg-[#F3F3F3] text-[#131313] hover:bg-[#B5B5B5] px-5 py-2 rounded-lg text-xs font-semibold transition duration-150 shadow"
              >
                Go to Workspace
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B5B5B5] hover:text-white transition duration-150 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-[#B5B5B5] hover:text-white transition duration-150">
                Login
              </Link>
              <Link
                to="/register-company"
                className="bg-[#F3F3F3] text-[#131313] hover:bg-[#B5B5B5] px-5 py-2 rounded-lg text-xs font-semibold transition duration-150 shadow"
              >
                Start Free Trial
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Manage Projects.<br />
            Empower Teams.<br />
            Scale Faster.
          </h1>
          <p className="text-sm sm:text-base text-[#B5B5B5] leading-relaxed font-light max-w-lg">
            Streamline project execution, employee management, attendance tracking, and collaboration in one unified workspace. Built for modern fast-scaling organizations.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {user ? (
              <Link
                to={getWorkspaceRoute()}
                className="w-full sm:w-auto text-center bg-[#F3F3F3] text-[#131313] hover:bg-[#B5B5B5] px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg"
              >
                Go to Workspace
              </Link>
            ) : (
              <Link
                to="/register-company"
                className="w-full sm:w-auto text-center bg-[#F3F3F3] text-[#131313] hover:bg-[#B5B5B5] px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg"
              >
                Start Free Trial
              </Link>
            )}
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto text-center bg-[#1C1C1C] border border-[#3C3C3C] text-white hover:bg-[#3C3C3C]/30 px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Book Demo
            </button>
          </div>
        </div>

        {/* Right Dashboard Mockup (Floating Glassmorphism Cards) */}
        <div className="lg:col-span-6 relative flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 shadow-xl relative z-10 space-y-4">
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between border-b border-[#3C3C3C] pb-3">
              <span className="text-[10px] font-bold text-[#B5B5B5] uppercase tracking-wider font-mono">Workspace Status</span>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>

            {/* Float Cards Simulation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#131313] border border-[#3C3C3C] p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-[#B5B5B5]/60 font-bold uppercase tracking-wider">Employees</span>
                <p className="text-xl font-bold text-white">150</p>
              </div>
              <div className="bg-[#131313] border border-[#3C3C3C] p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-[#B5B5B5]/60 font-bold uppercase tracking-wider">Projects</span>
                <p className="text-xl font-bold text-white">24</p>
              </div>
              <div className="bg-[#131313] border border-[#3C3C3C] p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-[#B5B5B5]/60 font-bold uppercase tracking-wider">Tasks</span>
                <p className="text-xl font-bold text-white">893</p>
              </div>
              <div className="bg-[#131313] border border-[#3C3C3C] p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-[#B5B5B5]/60 font-bold uppercase tracking-wider">Attendance</span>
                <p className="text-xl font-bold text-white">96%</p>
              </div>
            </div>

            {/* Quick Activity Item */}
            <div className="bg-[#131313]/80 backdrop-blur border border-[#3C3C3C] p-3.5 rounded-xl flex items-center justify-between text-[10px] text-[#B5B5B5]">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 rounded-full bg-[#F3F3F3] text-[#131313] flex items-center justify-center font-bold text-[8px]">AD</div>
                <span>Admin added new manager</span>
              </div>
              <span className="font-mono text-[#646464]">Just now</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted Companies */}
      <section id="about" className="border-y border-[#1C1C1C] py-10 bg-[#131313] relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B5B5B5]/60 mb-6">
            Trusted by growing businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 text-sm font-bold text-[#B5B5B5] font-mono tracking-widest opacity-80">
            <span className="hover:text-white transition duration-150">ABC TECH</span>
            <span className="hover:text-white transition duration-150">CODECRAFT</span>
            <span className="hover:text-white transition duration-150">TECHNOVA</span>
            <span className="hover:text-white transition duration-150">FUTURESOFT</span>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest block font-mono">PRODUCT CAPABILITIES</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1.5">
            Everything your team needs
          </h2>
          <p className="text-xs sm:text-sm text-[#B5B5B5] mt-2 font-light leading-relaxed">
            Consolidating project execution and human resources, WorkArea replaces disjointed tools to manage workflows in one centralized tenant database.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <FolderGit2 className="h-5 w-5 text-white" />, title: "Projects", desc: "Monitor multi-stage milestones, sprints, and deliverable lifecycles." },
            { icon: <CheckSquare className="h-5 w-5 text-white" />, title: "Tasks", desc: "Assign details, track prioritize levels, and update statuses." },
            { icon: <Users className="h-5 w-5 text-white" />, title: "Teams", desc: "Manage role clearances from administrators, managers, and employees." },
            { icon: <FileBarChart2 className="h-5 w-5 text-white" />, title: "Reports", desc: "Extract project completion logs and employee attendance exports." },
            { icon: <CalendarDays className="h-5 w-5 text-white" />, title: "Leaves", desc: "Submit leave applications, track pending decisions, and logs details." },
            { icon: <Activity className="h-5 w-5 text-white" />, title: "Analytics", desc: "Obtain clean metrics diagrams on system speeds and team outputs." }
          ].map((feat, idx) => (
            <div key={idx} className="bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 space-y-4 hover:bg-[#1C1C1C]/80 hover:border-[#646464] hover:shadow-md transition duration-200 text-left">
              <div className="h-10 w-10 rounded-lg bg-[#131313] flex items-center justify-center border border-[#3C3C3C]">
                {feat.icon}
              </div>
              <h4 className="text-base font-bold text-white">{feat.title}</h4>
              <p className="text-xs text-[#B5B5B5] leading-relaxed font-light">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-24 border-t border-[#1C1C1C] bg-[#131313] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest block font-mono">ONBOARDING PIPELINE</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1">How It Works</h2>
            <p className="text-xs sm:text-sm text-[#B5B5B5] mt-2 font-light">Get your entire team set up and running on WorkArea in minutes.</p>
          </div>

          {/* Horizontal Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
            {[
              { num: "01", step: "Register Company", desc: "Create your corporate workspace URL and first Admin login details." },
              { num: "02", step: "Create Workspace", desc: "Establish departments, projects, and custom sprint boards." },
              { num: "03", step: "Invite Team", desc: "Add managers and employee profiles with secure temporary credentials." },
              { num: "04", step: "Manage Projects", desc: "Delegate tasks, submit deadlines, and write updates." },
              { num: "05", step: "Track Progress", desc: "Monitor daily attendance shifts, approvals, and report files." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 space-y-3 relative hover:border-[#646464] hover:shadow transition">
                <span className="text-3xl font-extrabold text-[#3C3C3C]/60 font-mono block">{item.num}</span>
                <h4 className="text-sm font-bold text-white">{item.step}</h4>
                <p className="text-[11px] text-[#B5B5B5] leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Modules Showcase */}
      <section id="modules" className="py-24 border-t border-[#1C1C1C] max-w-7xl mx-auto px-6 sm:px-12 space-y-20 relative z-10">
        <div className="max-w-3xl">
          <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest block font-mono">PRODUCT TOUR</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">Module Showcase</h2>
          <p className="text-xs sm:text-sm text-[#B5B5B5] mt-2 font-light">Deep-dive into the four core dashboards structured for corporate workspaces.</p>
        </div>

        {/* Module 1: Employee Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 shadow-md">
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center text-[10px] text-[#B5B5B5]/60 border-b border-[#3C3C3C] pb-2">
                <span>ONBOARDING LIST</span>
                <span>Role: Manager / Staff</span>
              </div>
              <div className="p-3 bg-[#131313] border border-[#3C3C3C] rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">David Miller</p>
                  <p className="text-[10px] text-[#B5B5B5]/60">david@company.com</p>
                </div>
                <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-yellow-500/20">MANAGER</span>
              </div>
              <div className="p-3 bg-[#131313] border border-[#3C3C3C] rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Sarah Connor</p>
                  <p className="text-[10px] text-[#B5B5B5]/60">sarah@company.com</p>
                </div>
                <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-green-500/20">EMPLOYEE</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest font-mono">MODULE 01</span>
            <h3 className="text-xl font-bold text-white">Employee Management</h3>
            <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed font-light">
              Manage employees efficiently with centralized workforce management. Admins and managers can onboard, update profile configurations, designate departments, and track active staff directories under absolute data tenant isolation.
            </p>
          </div>
        </div>

        {/* Module 2: Project Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 shadow-md">
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center text-[10px] text-[#B5B5B5]/60 border-b border-[#3C3C3C] pb-2">
                <span>PROJECT TIMELINE</span>
                <span>Active Milestones</span>
              </div>
              <div className="p-3 bg-[#131313] border border-[#3C3C3C] rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Client Dashboard Sync</span>
                  <span className="text-[#B5B5B5] font-light">75%</span>
                </div>
                <div className="h-2 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#3C3C3C]">
                  <div className="bg-[#F3F3F3] h-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-4 text-left">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest font-mono">MODULE 02</span>
            <h3 className="text-xl font-bold text-white">Project Management</h3>
            <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed font-light">
              Create, assign and track projects in real time. Map corporate requirements into distinct project boards, customize progress trackers, and view gantt timelines that stay updated dynamically as team tasks move towards completion.
            </p>
          </div>
        </div>

        {/* Module 3: Task Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 shadow-md">
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center text-[10px] text-[#B5B5B5]/60 border-b border-[#3C3C3C] pb-2">
                <span>SPRINT BACKLOG</span>
                <span>Checked list</span>
              </div>
              <div className="p-3 bg-[#131313] border border-[#3C3C3C] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 bg-[#F3F3F3] rounded flex items-center justify-center text-[#131313]"><Check className="h-3 w-3" /></span>
                  <span className="line-through text-[#B5B5B5]/60">Update navbar sticky styles</span>
                </div>
              </div>
              <div className="p-3 bg-[#131313] border border-[#3C3C3C] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 border border-[#3C3C3C] rounded block"></span>
                  <span className="text-white">Integrate forgot password API route</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest font-mono">MODULE 03</span>
            <h3 className="text-xl font-bold text-white">Task Management</h3>
            <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed font-light">
              Assign tasks, monitor progress and boost productivity. Allow managers to delegate details, define priority tags (Critical, High, Medium, Low), submit due dates, and track personal work queue lists for each employee.
            </p>
          </div>
        </div>

        {/* Module 4: Attendance Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 shadow-md">
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center text-[10px] text-[#B5B5B5]/60 border-b border-[#3C3C3C] pb-2">
                <span>ATTENDANCE STATUS</span>
                <span>Active Shift Tracker</span>
              </div>
              <div className="p-3 bg-[#131313] border border-[#3C3C3C] rounded-xl flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-white">Clocked In at 09:02 AM</span>
                </div>
                <span className="font-semibold text-green-400">SHIFTACTIVE</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-4 text-left">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest font-mono">MODULE 04</span>
            <h3 className="text-xl font-bold text-white">Attendance Management</h3>
            <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed font-light">
              Track attendance, working hours and leave requests. Employees can log checking in/out status from their personal dashboards, while managers view active team logs, authorize leaves, and evaluate attendance summaries.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-24 border-t border-[#1C1C1C] bg-[#131313] relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest block font-mono">FLEXIBLE BILLING</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1.5 font-heading">Pricing Plans</h2>
            <p className="text-xs sm:text-sm text-[#B5B5B5] mt-2 font-light">Select the plan tier matching your organizational workspace size.</p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-8 space-y-6 flex flex-col justify-between hover:border-[#646464] hover:shadow transition duration-200">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5B5B5]/60">Starter</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-bold text-white">Rs. 0</span>
                  <span className="text-xs text-[#B5B5B5]/60 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 pt-6 mt-6 border-t border-[#3C3C3C] text-xs text-[#B5B5B5]">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#B5B5B5]" /><span>10 Employees</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#B5B5B5]" /><span>5 Projects</span></li>
                </ul>
              </div>
              <Link to="/register-company" className="w-full text-center py-2.5 rounded-lg font-bold uppercase tracking-wider bg-[#131313] border border-[#3C3C3C] text-white hover:bg-white hover:text-black text-xs block transition duration-150 shadow-sm">
                Get Started
              </Link>
            </div>

            {/* Professional Plan (Highlighted) */}
            <div className="bg-[#F3F3F3] text-[#131313] border-2 border-[#F3F3F3] rounded-[20px] p-8 space-y-6 flex flex-col justify-between relative hover:shadow-xl transition duration-200">
              <span className="absolute top-0 right-6 -translate-y-1/2 bg-[#131313] text-white border border-[#3C3C3C] px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider">Most Popular</span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#131313]/60">Professional</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-bold text-[#131313]">Rs. 999</span>
                  <span className="text-xs text-[#131313]/60 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 pt-6 mt-6 border-t border-[#131313]/10 text-xs text-[#131313]">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#131313]" /><span>100 Employees</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#131313]" /><span>Unlimited Projects</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#131313]" /><span>Advanced Reports</span></li>
                </ul>
              </div>
              <Link to="/register-company" className="w-full text-center py-2.5 rounded-lg font-bold uppercase tracking-wider bg-[#131313] text-[#F3F3F3] hover:bg-[#353536] text-xs block transition duration-150">
                Start Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-8 space-y-6 flex flex-col justify-between hover:border-[#646464] hover:shadow transition duration-200">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#B5B5B5]/60">Enterprise</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-2xl font-bold text-white">Custom Pricing</span>
                </div>
                <ul className="space-y-3 pt-6 mt-6 border-t border-[#3C3C3C] text-xs text-[#B5B5B5]">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#B5B5B5]" /><span>Unlimited Everything</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#B5B5B5]" /><span>SSO & Isolated Tenant</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 shrink-0 text-[#B5B5B5]" /><span>Dedicated Support</span></li>
                </ul>
              </div>
              <button onClick={handleDemoClick} className="w-full text-center py-2.5 rounded-lg font-bold uppercase tracking-wider bg-[#131313] border border-[#3C3C3C] text-white hover:bg-white hover:text-black text-xs block transition duration-150 shadow-sm cursor-pointer">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-24 border-t border-[#1C1C1C] bg-[#131313] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest block font-mono">TESTIMONIALS</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1">SaaS Feedback</h2>
            <p className="text-xs sm:text-sm text-[#B5B5B5] mt-2 font-light">What corporate workspace administrators say about WorkArea.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {[
              { quote: "WorkArea transformed our project workflow completely. Managing tasks and tracking attendance is extremely seamless.", reviewer: "CEO, ABC Tech" },
              { quote: "Having projects, sprints, attendance, and leave management inside one tool saves hours of manual sync.", reviewer: "HR Manager, CodeCraft" },
              { quote: "The role isolation and temporary password flow makes onboarding new remote managers secure and simple.", reviewer: "Ops Director, TechNova" }
            ].map((test, idx) => (
              <div key={idx} className="bg-[#1C1C1C] border border-[#3C3C3C] rounded-[20px] p-6 space-y-4 flex flex-col justify-between hover:border-[#646464] hover:shadow transition">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-500 shrink-0" />
                    ))}
                  </div>
                  <p className="text-xs italic text-[#B5B5B5] font-light leading-relaxed">"{test.quote}"</p>
                </div>
                <div className="text-[9px] font-bold text-white uppercase tracking-wider border-t border-[#3C3C3C] pt-3">
                  - {test.reviewer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-24 border-t border-[#1C1C1C] bg-[#131313] relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-[#B5B5B5]/60 uppercase tracking-widest block font-mono">SUPPORT DESK</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1.5 font-heading">Frequently Asked Questions</h2>
          </div>

          {/* Accordion */}
          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-[#1C1C1C] border border-[#3C3C3C] rounded-xl overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between font-semibold text-xs uppercase tracking-wider text-white hover:bg-[#3C3C3C]/20 transition cursor-pointer text-left focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#B5B5B5] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-[#B5B5B5] font-light leading-relaxed border-t border-[#3C3C3C]/45">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Call To Action (CTA) */}
      <section className="py-24 bg-[#080808] text-[#EBEDF1] text-center border-t border-[#1C1C1C] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xs sm:text-sm text-[#ACADB1] leading-relaxed font-light">
            Claim your dedicated corporate workspace slug and onboard your staff today. Try all professional features free for 14 days.
          </p>
          <div className="pt-2">
            {user ? (
              <Link
                to={getWorkspaceRoute()}
                className="inline-block bg-[#EBEDF1] text-[#080808] hover:bg-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 shadow-lg"
              >
                Go to Workspace
              </Link>
            ) : (
              <Link
                to="/register-company"
                className="inline-block bg-[#EBEDF1] text-[#080808] hover:bg-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 shadow-lg"
              >
                Start Free Trial
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 11. Footer Section */}
      <footer className="bg-[#131313] text-[#B5B5B5] py-16 px-6 sm:px-12 border-t border-[#1C1C1C] text-left text-xs font-light relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-[#1C1C1C] pb-12">
          
          {/* Logo block */}
          <div className="col-span-2 space-y-4">
            <Logo light={true} />
            <p className="text-xs text-[#B5B5B5] leading-relaxed max-w-xs font-light">
              Enterprise SaaS multi-tenant workspace platform built for workforce scheduling, tasks backlog, and HRMS log tracking.
            </p>
          </div>

          {/* Col 1 */}
          <div>
            <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Product</h5>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-white transition duration-150">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition duration-150">Pricing</a></li>
              <li><a href="#modules" className="hover:text-white transition duration-150">Modules</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2.5">
              <li><a href="#about" className="hover:text-white transition duration-150">About</a></li>
              <li><a href="#contact" className="hover:text-white transition duration-150">Contact</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Resources</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition duration-150">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition duration-150">Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Socials & Rights row */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 WorkArea. All rights reserved.</span>
          <div className="flex space-x-6 text-[#B5B5B5]">
            <a href="#" className="hover:text-white transition duration-150">LinkedIn</a>
            <a href="#" className="hover:text-white transition duration-150">GitHub</a>
            <a href="#" className="hover:text-white transition duration-150">X</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
