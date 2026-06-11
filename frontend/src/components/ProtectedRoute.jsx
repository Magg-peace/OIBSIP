import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Double Ring Spinner */}
          <div className="w-16 h-16 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin"></div>
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin absolute top-3"></div>
          <p className="mt-6 font-bold text-orange-500 tracking-wider animate-pulse uppercase">Prepping Kitchen...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Redirect non-admin to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
