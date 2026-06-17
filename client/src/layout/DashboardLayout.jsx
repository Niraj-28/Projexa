import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Briefcase
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define sidebar items based on role
  const getSidebarItems = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { label: 'Platform Hub', path: '/platform', icon: <Globe className="h-4 w-4" /> },
          { label: 'Companies', path: '/companies', icon: <Building2 className="h-4 w-4" /> },
          { label: 'Subscriptions', path: '/subscriptions', icon: <CreditCard className="h-4 w-4" /> },
        ];
      case 'company_admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
          { label: 'Employees', path: '/employees', icon: <Users className="h-4 w-4" /> },
          { label: 'Departments', path: '/departments', icon: <Network className="h-4 w-4" /> },
          { label: 'Projects', path: '/projects', icon: <FolderGit2 className="h-4 w-4" /> },
          { label: 'Reports', path: '/reports', icon: <FileBarChart2 className="h-4 w-4" /> },
        ];
      case 'manager':
        return [
          { label: 'Team Projects', path: '/projects', icon: <FolderGit2 className="h-4 w-4" /> },
          { label: 'Tasks Desk', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
          { label: 'Team Members', path: '/team', icon: <Users className="h-4 w-4" /> },
        ];
      case 'employee':
        return [
          { label: 'My Tasks', path: '/my-tasks', icon: <CheckSquare className="h-4 w-4" /> },
          { label: 'Attendance', path: '/attendance', icon: <Clock3 className="h-4 w-4" /> },
          { label: 'Leave Requests', path: '/leave', icon: <CalendarRange className="h-4 w-4" /> },
          { label: 'My Profile', path: '/profile', icon: <User2 className="h-4 w-4" /> },
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F3F3F3] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#131313] border-b md:border-b-0 md:border-r border-[#1C1C1C] flex flex-col shrink-0">
        {/* Brand Logo */}
        <div className="h-16 px-6 border-b border-[#1C1C1C] flex items-center">
          <Logo light={true} className="cursor-pointer" onClick={() => navigate('/')} />
        </div>

        {/* Workspace Display */}
        {user?.company && (
          <div className="px-5 py-3.5 border-b border-[#1C1C1C] bg-[#1C1C1C]/40">
            <span className="text-[9px] font-bold text-[#646464] uppercase tracking-wider block">Workspace</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <Briefcase className="h-3.5 w-3.5 text-[#B5B5B5]" />
              <span className="text-xs text-[#B5B5B5] truncate font-medium">{user.company.name}</span>
            </div>
            <span className="text-[10px] text-[#646464] font-mono mt-0.5 block truncate">/{user.company.workspaceUrl}</span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
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

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#1C1C1C] bg-[#161616]">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#3C3C3C] border border-[#646464] flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.name ? user.name.slice(0, 2) : 'US'}
            </div>
            <div className="truncate flex-grow">
              <p className="text-xs font-medium text-white truncate leading-none mb-0.5">{user?.name}</p>
              <p className="text-[9px] font-semibold text-[#B5B5B5] uppercase tracking-wider truncate">
                {user?.role ? user.role.replace('_', ' ') : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-8 border-b border-[#1C1C1C] bg-[#131313]/50 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold tracking-tight text-white capitalize">
            {location.pathname.substring(1).replace('-', ' ')} view
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] text-[#646464] block font-mono">Server Status</span>
              <span className="text-[10px] font-bold text-green-400 flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                ONLINE
              </span>
            </div>
          </div>
        </header>

        {/* Inner Scroll Container */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#0B0B0B]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
