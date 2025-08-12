// src/components/PublicOnlyRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, redirect them to the dashboard.
  // Otherwise, show the public page (Login, Register, etc.).
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicOnlyRoute;