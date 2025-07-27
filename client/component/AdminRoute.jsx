// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';


const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth(); // Get user object which includes role

  if (loading) {
    return <div className="text-center py-8">Checking admin access...</div>;
  }

  // Check if user is authenticated AND has the 'admin' role
  if (isAuthenticated && user?.role === 'admin') {
    return children;
  }

  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated but not admin, redirect to user dashboard or show error
  // You might want a specific "unauthorized" page instead
  return <Navigate to="/dashboard" replace />; // Or <div className="text-center py-8 text-red-500">Access Denied</div>
};

export default AdminRoute;