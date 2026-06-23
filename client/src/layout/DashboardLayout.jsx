import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomeRoute, normalizeRole } from '../utils/roleRoutes';
import Logo from '../components/Logo';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Network,
  FileBarChart2,
  CheckSquare,
  CalendarRange,
  Clock3,
  LogOut,
  Building2,
  CreditCard,
  Globe,
  User2,
  Briefcase,
  Bell,
  Settings,
  User,
  ChevronDown
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = normalizeRole(user?.role);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define sidebar items based on role according to user spec
  const getSidebarItems = () => {
    switch (userRole) {
      case 'super_admin':
        return [
          { label: 'Dashboard', path: '/platform/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
          { label: 'Companies', path: '/platform/companies', icon: <Building2 className="h-[18px] w-[18px]" /> },
          { label: 'Subscriptions', path: '/platform/subscriptions', icon: <CreditCard className="h-[18px] w-[18px]" /> },
          { label: 'Revenue', path: '/platform/revenue', icon: <FileBarChart2 className="h-[18px] w-[18px]" /> },
          { label: 'Analytics', path: '/platform/analytics', icon: <Network className="h-[18px] w-[18px]" /> },
          { label: 'Notifications', path: '/notifications', icon: <Bell className="h-[18px] w-[18px]" /> },
          { label: 'Settings', path: '/platform/settings', icon: <Settings className="h-[18px] w-[18px]" /> },
        ];
      case 'company_admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
          { label: 'Company', path: '/company/profile', icon: <Building2 className="h-[18px] w-[18px]" /> },
          { label: 'Employees', path: '/employees', icon: <Users className="h-[18px] w-[18px]" /> },
          { label: 'Departments', path: '/departments', icon: <Network className="h-[18px] w-[18px]" /> },
          { label: 'Projects', path: '/projects', icon: <FolderGit2 className="h-[18px] w-[18px]" /> },
          { label: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-[18px] w-[18px]" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-[18px] w-[18px]" /> },
          { label: 'Leaves', path: '/leaves', icon: <CalendarRange className="h-[18px] w-[18px]" /> },
          { label: 'Reports', path: '/reports', icon: <FileBarChart2 className="h-[18px] w-[18px]" /> },
          { label: 'Notifications', path: '/notifications', icon: <Bell className="h-[18px] w-[18px]" /> },
          { label: 'Settings', path: '/profile', icon: <Settings className="h-[18px] w-[18px]" /> },
        ];
      case 'manager':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
          { label: 'Projects', path: '/projects', icon: <FolderGit2 className="h-[18px] w-[18px]" /> },
          { label: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-[18px] w-[18px]" /> },
          { label: 'Team', path: '/team', icon: <Users className="h-[18px] w-[18px]" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-[18px] w-[18px]" /> },
          { label: 'Profile', path: '/profile', icon: <User2 className="h-[18px] w-[18px]" /> },
        ];
      case 'employee':
        return [
          { label: 'Dashboard', path: '/my-dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
          { label: 'My Tasks', path: '/my-tasks', icon: <CheckSquare className="h-[18px] w-[18px]" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-[18px] w-[18px]" /> },
          { label: 'Leaves', path: '/leaves', icon: <CalendarRange className="h-[18px] w-[18px]" /> },
          { label: 'Profile', path: '/profile', icon: <User2 className="h-[18px] w-[18px]" /> },
          { label: 'Notifications', path: '/notifications', icon: <Bell className="h-[18px] w-[18px]" /> },
        ];
      default:
        return [];
    }
  };

  const menuItems = getSidebarItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Dynamic logo redirect logic
  const handleLogoRedirect = () => {
    if (!user) {
      navigate('/');
      return;
    }
    navigate(getHomeRoute(user.role));
  };

  return (
    <div className="app-shell min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden bg-[#F8FAFC] text-[#01161E] font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-[272px] md:min-w-[272px] md:max-w-[272px] bg-white border-b md:border-b-0 md:border-r border-[#E2E8F0]/80 flex flex-col shrink-0 shadow-[1px_0_10px_rgba(18,69,89,0.02)] z-20">
        {/* Brand Logo */}
        <div className="h-[72px] px-6 border-b border-[#E2E8F0]/80 flex items-center bg-white">
          <Logo light={false} className="cursor-pointer hover:opacity-90 transition-opacity" onClick={handleLogoRedirect} />
        </div>

        {/* Workspace Display floating card */}
        {user?.company && (
          <div className="mx-4 mt-5 p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-white border border-[#E2E8F0]/80 shadow-[0_4px_20px_-4px_rgba(18,69,89,0.05)]">
            <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] block">Active Workspace</span>
            <div className="flex items-center space-x-2.5 mt-2">
              <div className="h-8 w-8 rounded-xl bg-[#124559]/10 flex items-center justify-center border border-[#124559]/20 text-[#124559]">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-[#01161E] truncate font-bold block leading-tight">{user.company.name}</span>
                <span className="text-[10px] text-[#94A3B8] font-mono block truncate mt-0.5">/{user.company.workspaceUrl}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-grow px-4 py-5 space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === '/company/profile' && location.pathname.startsWith('/company'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${isActive
                  ? 'bg-gradient-to-r from-[#124559] to-[#01161E] text-white font-semibold shadow-md shadow-[#124559]/25 scale-[1.02]'
                  : 'text-[#598392] hover:bg-[#124559]/5 hover:text-[#01161E]'
                  }`}
              >
                <span className={`transition-colors duration-200 ${isActive ? 'text-white/90' : 'text-[#94A3B8] group-hover:text-[#598392]'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header (Glassmorphic) */}
        <header className="h-[72px] min-h-[72px] max-h-[72px] px-8 border-b border-[#E2E8F0]/80 bg-white/70 backdrop-blur-md flex items-center justify-between relative z-30 shrink-0 shadow-[0_1px_3px_rgba(18,69,89,0.01)]">
          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-[#01161E] capitalize leading-tight">
              {location.pathname.substring(1).replace('-', ' ').replace('/', ' / ') || 'Home'}
            </h2>
            <p className="text-[10px] text-[#94A3B8] font-semibold mt-0.5 tracking-wide">Workspace overview</p>
          </div>

          <div className="flex items-center space-x-5">


            {/* Profile Dropdown Component */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer text-sm font-semibold text-[#01161E] focus:outline-none"
              >
                <div className="h-10 w-10 rounded-4xl bg-gradient-to-br from-[#124559] to-[#01161E] flex items-center justify-center text-[15 px] font-bold uppercase text-white shadow-sm shadow-[#124559]/20">
                  {user?.name ? user.name.slice(0, 2) : 'US'}
                </div>
                <span className="max-w-[140px] truncate hidden sm:block text-[16px] font-bold text-[#01161E]">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className={`h-4 w-4 text-[#94A3B8] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl shadow-black/5 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <p className="text-xs font-bold text-[#01161E] truncate">{user?.name}</p>
                    <p className="text-[10px] font-semibold text-[#94A3B8] truncate mt-0.5">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-[#598392] hover:text-[#01161E] hover:bg-[#F8FAFC] transition-colors font-medium"
                    >
                      <User className="h-4 w-4 text-[#94A3B8]" />
                      <span>Profile Settings</span>
                    </Link>

                    <Link
                      to="/notifications"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-[#598392] hover:text-[#01161E] hover:bg-[#F8FAFC] transition-colors font-medium"
                    >
                      <Bell className="h-4 w-4 text-[#94A3B8]" />
                      <span>Notifications</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#E2E8F0] my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Inner Scroll Container with Ambient Backdrop Glows */}
        <div className="flex-grow overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC] relative">
          {/* Depth Glow Elements */}
          <div className="absolute top-[10%] right-[10%] w-[380px] h-[380px] bg-[#124559]/5 rounded-full blur-[110px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[380px] h-[380px] bg-[#AEC3B0]/10 rounded-full blur-[110px] pointer-events-none z-0"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="page-transition">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
