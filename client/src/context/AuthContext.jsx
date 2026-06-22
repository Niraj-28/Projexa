import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api, { setAccessToken } from '../services/api';
import { normalizeAuthUser } from '../utils/roleRoutes';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  // Initialize authentication state on page load
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeAuth = async () => {
      try {
        // Try to obtain a new access token first using the HttpOnly refresh token cookie
        const response = await api.post('/auth/refresh');
        if (response.data && response.data.success) {
          setAccessToken(response.data.token);

          // If successful, retrieve user profile using the new access token
          const userResponse = await api.get('/auth/me');
          if (userResponse.data && userResponse.data.success) {
            setUser(normalizeAuthUser(userResponse.data.user));
          }
        }
      } catch (error) {
        // Expected if no refresh token cookie exists (user is not logged in)
        console.log('No active session found.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Event listener for invalid refresh token (force logout)
    const handleSessionExpired = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth-session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth-session-expired', handleSessionExpired);
    };
  }, []);

  // Login method
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        setAccessToken(response.data.token);
        setUser(normalizeAuthUser(response.data.user));
        return response.data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  };

  // Login with Google method
  const loginWithGoogle = async (googleAccessToken) => {
    try {
      const response = await api.post('/auth/google', { token: googleAccessToken });
      if (response.data && response.data.success) {
        setAccessToken(response.data.token);
        setUser(normalizeAuthUser(response.data.user));
        return response.data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Google authentication failed.';
    }
  };

  // Register Company and Admin method
  const registerCompany = async (registrationData) => {
    try {
      const response = await api.post('/auth/register-company', registrationData);
      if (response.data && response.data.success) {
        setAccessToken(response.data.token);
        setUser(normalizeAuthUser(response.data.user));
        return response.data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed. Please check your inputs.';
    }
  };

  // Change password method
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      if (response.data && response.data.success) {
        // Update user state locally
        setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
        return response.data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Failed to change password. Please check your inputs.';
    }
  };

  // Update profile method
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/me', profileData);
      if (response.data && response.data.success) {
        const updatedUser = normalizeAuthUser(response.data.user);
        setUser(updatedUser);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile.';
    }
  };

  // Update company settings method locally
  const updateCompany = (companyData) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        company: prev.company ? { ...prev.company, ...companyData } : companyData,
      };
    });
  };

  // Simulated Forgot password method
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to trigger password recovery.';
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('API logout failed', error);
    } finally {
      // Always reset local auth state
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        registerCompany,
        changePassword,
        updateProfile,
        updateCompany,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
