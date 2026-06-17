import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import TemporaryPasswordChange from '../pages/auth/TemporaryPasswordChange';

// Layout
import DashboardLayout from '../layout/DashboardLayout';

// Subviews
import Platform from '../pages/company/Platform';
import Companies from '../pages/company/Companies';
import Subscriptions from '../pages/company/Subscriptions';

import Dashboard from '../pages/dashboard/Dashboard';
import EmployeeList from '../pages/employee/EmployeeList';
import DepartmentList from '../pages/department/DepartmentList';
import ProjectList from '../pages/project/ProjectList';
import ReportsView from '../pages/reports/ReportsView';

import TaskList from '../pages/task/TaskList';
import TeamList from '../pages/employee/TeamList';

import MyTaskList from '../pages/task/MyTaskList';
import AttendanceTracker from '../pages/attendance/AttendanceTracker';
import LeaveRequests from '../pages/leave/LeaveRequests';
import Profile from '../pages/settings/Profile';

// Helper to resolve the main home route for each role
const getHomeRoute = (role) => {
  switch (role) {
    case 'super_admin':
      return '/platform';
    case 'company_admin':
      return '/dashboard';
    case 'manager':
      return '/projects';
    case 'employee':
      return '/my-tasks';
    default:
      return '/';
  }
};

// Protected Route Guard with Role Validation and Layout Wrapping
const RoleGuardRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B5B5B5]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.mustChangePassword) {
    return <TemporaryPasswordChange />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their default homepage
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Public Route Guard (redirects authenticated users away from login/register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B5B5B5]"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register-company"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/platform"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <Platform />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <Companies />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <Subscriptions />
          </RoleGuardRoute>
        }
      />

      {/* Company Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <Dashboard />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <EmployeeList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <DepartmentList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <ReportsView />
          </RoleGuardRoute>
        }
      />

      {/* Shared routes: projects is accessed by company_admin and manager */}
      <Route
        path="/projects"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <ProjectList />
          </RoleGuardRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/tasks"
        element={
          <RoleGuardRoute allowedRoles={['manager']}>
            <TaskList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/team"
        element={
          <RoleGuardRoute allowedRoles={['manager']}>
            <TeamList />
          </RoleGuardRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/my-tasks"
        element={
          <RoleGuardRoute allowedRoles={['employee']}>
            <MyTaskList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <RoleGuardRoute allowedRoles={['employee']}>
            <AttendanceTracker />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <RoleGuardRoute allowedRoles={['employee']}>
            <LeaveRequests />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <RoleGuardRoute allowedRoles={['employee']}>
            <Profile />
          </RoleGuardRoute>
        }
      />

      {/* Redirect old register route to register-company */}
      <Route path="/register" element={<Navigate to="/register-company" replace />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
