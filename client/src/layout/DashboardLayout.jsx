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
          { label: 'Dashboard', path: '/platform/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
          { label: 'Companies', path: '/platform/companies', icon: <Building2 className="h-4 w-4" /> },
          { label: 'Subscriptions', path: '/platform/subscriptions', icon: <CreditCard className="h-4 w-4" /> },
          { label: 'Revenue', path: '/platform/revenue', icon: <FileBarChart2 className="h-4 w-4" /> },
          { label: 'Analytics', path: '/platform/analytics', icon: <Network className="h-4 w-4" /> },
          { label: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" /> },
          { label: 'Settings', path: '/platform/settings', icon: <Settings className="h-4 w-4" /> },
        ];
      case 'company_admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
          { label: 'Company', path: '/company/profile', icon: <Building2 className="h-4 w-4" /> },
          { label: 'Employees', path: '/employees', icon: <Users className="h-4 w-4" /> },
          { label: 'Departments', path: '/departments', icon: <Network className="h-4 w-4" /> },
          { label: 'Projects', path: '/projects', icon: <FolderGit2 className="h-4 w-4" /> },
          { label: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-4 w-4" /> },
          { label: 'Leaves', path: '/leaves', icon: <CalendarRange className="h-4 w-4" /> },
          { label: 'Reports', path: '/reports', icon: <FileBarChart2 className="h-4 w-4" /> },
          { label: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" /> },
          { label: 'Settings', path: '/profile', icon: <Settings className="h-4 w-4" /> },
        ];
      case 'manager':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
          { label: 'Projects', path: '/projects', icon: <FolderGit2 className="h-4 w-4" /> },
          { label: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
          { label: 'Team', path: '/team', icon: <Users className="h-4 w-4" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-4 w-4" /> },
          { label: 'Profile', path: '/profile', icon: <User2 className="h-4 w-4" /> },
        ];
      case 'employee':
        return [
          { label: 'Dashboard', path: '/my-dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
          { label: 'My Tasks', path: '/my-tasks', icon: <CheckSquare className="h-4 w-4" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-4 w-4" /> },
          { label: 'Leaves', path: '/leaves', icon: <CalendarRange className="h-4 w-4" /> },
          { label: 'Profile', path: '/profile', icon: <User2 className="h-4 w-4" /> },
          { label: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" /> },
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
    <div className="app-shell min-h-screen bg-[#0D0D0D] text-[#F3F3F3] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#131313] border-b md:border-b-0 md:border-r border-[#1C1C1C] flex flex-col shrink-0">
        {/* Brand Logo */}
        <div className="h-16 px-6 border-b border-[#1C1C1C] flex items-center">
          <Logo light={true} className="cursor-pointer" onClick={handleLogoRedirect} />
        </div>

        {/* Workspace Display */}
        {user?.company && (
          <div className="px-5 py-3.5 border-b border-[#1C1C1C] bg-[#1C1C1C]/40">
            <span className="text-[9px] font-bold text-[#646464] uppercase tracking-wider block">Workspace</span>
            <div className="flex items-center space-x-1.5 mt-1">
            <Briefcase className="h-4 w-4 text-[#B5B5B5]" />
              <span className="text-xs text-[#B5B5B5] truncate font-medium">{user.company.name}</span>
            </div>
            <span className="text-[10px] text-[#646464] font-mono mt-0.5 block truncate">/{user.company.workspaceUrl}</span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/company/profile' && location.pathname.startsWith('/company'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F3F3F3] text-[#131313] font-semibold'
                    : 'text-[#B5B5B5] hover:bg-[#1C1C1C] hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-8 border-b border-[#1C1C1C] bg-[#131313]/50 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold tracking-tight text-white capitalize">
            {location.pathname.substring(1).replace('-', ' ').replace('/', ' / ') || 'Home'} view
          </h2>
          
          <div className="flex items-center space-x-6">
            {/* Server Status info */}
            <div className="hidden sm:block text-right">
              <span className="text-[9px] text-[#646464] block font-mono">Server Status</span>
              <span className="text-[9px] font-bold text-green-400 flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                ONLINE
              </span>
            </div>

            {/* Profile Dropdown Component */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 bg-transparent border border-white/60 hover:border-white px-3.5 py-1.5 rounded-full hover:bg-white/5 text-xs font-medium transition-all duration-200 cursor-pointer text-[#F3F3F3]"
              >
                <div className="h-5 w-5 rounded-full bg-[#3C3C3C] flex items-center justify-center text-[10px] font-bold uppercase text-white">
                  {user?.name ? user.name.slice(0, 2) : 'US'}
                </div>
                <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className={`h-3 w-3 text-[#B5B5B5] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#131313] border border-[#1C1C1C] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-[#1C1C1C]">
                    <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[9px] font-medium text-[#B5B5B5] truncate mt-0.5">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-[#B5B5B5] hover:text-white hover:bg-[#1C1C1C] transition-colors"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Profile Settings</span>
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-[#B5B5B5] hover:text-white hover:bg-[#1C1C1C] transition-colors"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>Notifications</span>
                  </Link>

                  <div className="border-t border-[#1C1C1C] my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Inner Scroll Container */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#0B0B0B]">
          <div className="max-w-7xl mx-auto">
            <div className="page-transition">
            {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
