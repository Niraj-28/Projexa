import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomeRoute, normalizeRole } from '../utils/roleRoutes';

// Auth Pages (Public)
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import TemporaryPasswordChange from '../pages/auth/TemporaryPasswordChange';

// Layout
import DashboardLayout from '../layout/DashboardLayout';

// Super Admin Views
import Platform from '../pages/company/Platform';
import Companies from '../pages/company/Companies';
import CompanyDetails from '../pages/company/CompanyDetails';
import Subscriptions from '../pages/company/Subscriptions';
import RevenueView from '../pages/company/RevenueView';
import AnalyticsView from '../pages/company/AnalyticsView';
import PlatformSettings from '../pages/company/PlatformSettings';

// Company Admin / Shared Dashboards
import Dashboard from '../pages/dashboard/Dashboard';
import MyDashboard from '../pages/dashboard/MyDashboard';
import NotificationsView from '../pages/dashboard/NotificationsView';

// Company Module
import CompanyProfile from '../pages/company/CompanyProfile';
import CompanySettings from '../pages/company/CompanySettings';
import CompanySubscription from '../pages/company/CompanySubscription';

// Employee Module
import EmployeeList from '../pages/employee/EmployeeList';
import AddEmployee from '../pages/employee/AddEmployee';
import EmployeeDetails from '../pages/employee/EmployeeDetails';
import EditEmployee from '../pages/employee/EditEmployee';
import EmployeeAttendance from '../pages/employee/EmployeeAttendance';
import TeamList from '../pages/employee/TeamList';

// Department Module
import DepartmentList from '../pages/department/DepartmentList';
import AddDepartment from '../pages/department/AddDepartment';
import DepartmentDetails from '../pages/department/DepartmentDetails';
import EditDepartment from '../pages/department/EditDepartment';

// Project Module
import ProjectList from '../pages/project/ProjectList';
import CreateProject from '../pages/project/CreateProject';
import ProjectDetails from '../pages/project/ProjectDetails';
import EditProject from '../pages/project/EditProject';

// Task Module
import TaskList from '../pages/task/TaskList';
import MyTaskList from '../pages/task/MyTaskList';
import CreateTask from '../pages/task/CreateTask';
import TaskDetails from '../pages/task/TaskDetails';
import EditTask from '../pages/task/EditTask';

// Attendance Module
import AttendanceTracker from '../pages/attendance/AttendanceTracker';
import AttendanceHistory from '../pages/attendance/AttendanceHistory';
import AttendanceReports from '../pages/attendance/AttendanceReports';

// Leave Module
import LeaveRequests from '../pages/leave/LeaveRequests';
import ApplyLeave from '../pages/leave/ApplyLeave';
import LeaveHistory from '../pages/leave/LeaveHistory';
import PendingLeaves from '../pages/leave/PendingLeaves';

// Reports Module
import ReportsView from '../pages/reports/ReportsView';
import EmployeesReport from '../pages/reports/EmployeesReport';
import AttendanceReport from '../pages/reports/AttendanceReport';
import ProjectsReport from '../pages/reports/ProjectsReport';
import TasksReport from '../pages/reports/TasksReport';

// Settings Module
import Profile from '../pages/settings/Profile';
import ProfileSettings from '../pages/settings/ProfileSettings';
import SecuritySettings from '../pages/settings/SecuritySettings';
import PasswordSettings from '../pages/settings/PasswordSettings';

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

  const userRole = normalizeRole(user.role);

  if (!allowedRoles.includes(userRole)) {
    // Redirect unauthorized users to their default homepage
    return <Navigate to={getHomeRoute(userRole)} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Public Route Guard (redirects authenticated users away from login/register/forgot/reset)
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
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Redirect /register to /register-company */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Navigate to="/register-company" replace />
          </PublicRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/platform"
        element={<Navigate to="/platform/dashboard" replace />}
      />
      <Route
        path="/platform/dashboard"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <Platform />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/platform/companies"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <Companies />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/platform/company/:id"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <CompanyDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/platform/subscriptions"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <Subscriptions />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/platform/revenue"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <RevenueView />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/platform/analytics"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <AnalyticsView />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/platform/settings"
        element={
          <RoleGuardRoute allowedRoles={['super_admin']}>
            <PlatformSettings />
          </RoleGuardRoute>
        }
      />

      {/* Company Admin & Manager Dashboard */}
      <Route
        path="/dashboard"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <Dashboard />
          </RoleGuardRoute>
        }
      />

      {/* Employee Dashboard */}
      <Route
        path="/my-dashboard"
        element={
          <RoleGuardRoute allowedRoles={['employee']}>
            <MyDashboard />
          </RoleGuardRoute>
        }
      />

      {/* Company Module (Company Admin Only) */}
      <Route
        path="/company"
        element={<Navigate to="/company/profile" replace />}
      />
      <Route
        path="/company/profile"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <CompanyProfile />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/company/settings"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <CompanySettings />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/company/subscription"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <CompanySubscription />
          </RoleGuardRoute>
        }
      />

      {/* Employee Module (Company Admin Only) */}
      <Route
        path="/employees"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <EmployeeList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/employees/add"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <AddEmployee />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <EmployeeDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/employees/edit/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <EditEmployee />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/employees/:id/attendance"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <EmployeeAttendance />
          </RoleGuardRoute>
        }
      />

      {/* Department Module (Company Admin Only) */}
      <Route
        path="/departments"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <DepartmentList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/departments/add"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <AddDepartment />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/departments/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <DepartmentDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/departments/edit/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <EditDepartment />
          </RoleGuardRoute>
        }
      />

      {/* Project Module (Company Admin & Manager) */}
      <Route
        path="/projects"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <ProjectList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <CreateProject />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <ProjectDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/projects/edit/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <EditProject />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/projects/:id/team"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <ProjectDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/projects/:id/files"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <ProjectDetails />
          </RoleGuardRoute>
        }
      />

      {/* Task Module */}
      <Route
        path="/tasks"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <TaskList />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <CreateTask />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <TaskDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/tasks/edit/:id"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <EditTask />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/tasks/:id/comments"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <TaskDetails />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <RoleGuardRoute allowedRoles={['employee']}>
            <MyTaskList />
          </RoleGuardRoute>
        }
      />

      {/* Manager Specific: Team List */}
      <Route
        path="/team"
        element={
          <RoleGuardRoute allowedRoles={['manager']}>
            <TeamList />
          </RoleGuardRoute>
        }
      />

      {/* Attendance Module */}
      <Route
        path="/attendance"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <AttendanceTracker />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/attendance/history"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <AttendanceHistory />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/attendance/reports"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <AttendanceReports />
          </RoleGuardRoute>
        }
      />

      {/* Leave Module */}
      <Route
        path="/leaves"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <LeaveRequests />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/leaves/apply"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <ApplyLeave />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/leaves/history"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <LeaveHistory />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/leaves/pending"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager']}>
            <PendingLeaves />
          </RoleGuardRoute>
        }
      />

      {/* Reports Module (Company Admin Only) */}
      <Route
        path="/reports"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <ReportsView />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/reports/employees"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <EmployeesReport />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/reports/attendance"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <AttendanceReport />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/reports/projects"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <ProjectsReport />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/reports/tasks"
        element={
          <RoleGuardRoute allowedRoles={['company_admin']}>
            <TasksReport />
          </RoleGuardRoute>
        }
      />

      {/* Notifications Module */}
      <Route
        path="/notifications"
        element={
          <RoleGuardRoute allowedRoles={['super_admin', 'company_admin', 'manager', 'employee']}>
            <NotificationsView />
          </RoleGuardRoute>
        }
      />

      {/* Settings Module */}
      <Route
        path="/settings"
        element={<Navigate to="/settings/profile" replace />}
      />
      <Route
        path="/settings/profile"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <ProfileSettings />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/settings/security"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <SecuritySettings />
          </RoleGuardRoute>
        }
      />
      <Route
        path="/settings/password"
        element={
          <RoleGuardRoute allowedRoles={['company_admin', 'manager', 'employee']}>
            <PasswordSettings />
          </RoleGuardRoute>
        }
      />

      {/* Profile Detail Card View (General Profile Route) */}
      <Route
        path="/profile"
        element={
          <RoleGuardRoute allowedRoles={['super_admin', 'company_admin', 'manager', 'employee']}>
            <Profile />
          </RoleGuardRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
