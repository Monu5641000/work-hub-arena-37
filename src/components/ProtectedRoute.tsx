
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'freelancer' | 'admin';
  allowedRoles?: ('client' | 'freelancer' | 'admin')[];
  requireRoleSelection?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowedRoles,
  requireRoleSelection = true 
}) => {
  const { user, token } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/otp-login" state={{ from: location }} replace />;
  }

  if (requireRoleSelection && (!user.role || !user.roleSelected)) {
    return <Navigate to="/role-selection" replace />;
  }

  // Check if user has required role (single role check)
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'freelancer' ? '/freelancer/dashboard' : 
                        '/client/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user has one of the allowed roles (multiple roles check)
  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'freelancer' ? '/freelancer/dashboard' : 
                        '/client/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
