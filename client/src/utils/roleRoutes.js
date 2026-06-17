export const normalizeRole = (role) => {
  const key = String(role || '')
    .trim()
    .replace(/[_\s-]+/g, '')
    .toLowerCase();

  switch (key) {
    case 'superadmin':
      return 'super_admin';
    case 'admin':
    case 'companyadmin':
      return 'company_admin';
    case 'manager':
      return 'manager';
    case 'employee':
      return 'employee';
    default:
      return key;
  }
};

export const normalizeAuthUser = (user) => {
  if (!user) return user;
  return {
    ...user,
    role: normalizeRole(user.role),
  };
};

export const getHomeRoute = (role) => {
  switch (normalizeRole(role)) {
    case 'super_admin':
      return '/platform/dashboard';
    case 'company_admin':
    case 'manager':
      return '/dashboard';
    case 'employee':
      return '/my-dashboard';
    default:
      return '/login';
  }
};
