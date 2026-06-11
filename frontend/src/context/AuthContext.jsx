import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set Authorization header for Axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      loadCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Load profile of logged-in user
  const loadCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to load current user details:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password',
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify email link handler
  const verifyEmailToken = async (emailToken) => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify/${emailToken}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification link is invalid or expired',
      };
    }
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Forgot password request failed',
      };
    }
  };

  // Reset password handler
  const resetPassword = async (resetToken, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${resetToken}`, { password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Reset password link is invalid or expired',
      };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        verifyEmailToken,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
