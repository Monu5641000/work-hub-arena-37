
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'freelancer' | 'admin';
  requireRoleSelection?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requireRoleSelection = true 
}) => {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRoleSelection && (!user.role || !user.roleSelected)) {
    return <Navigate to="/role-selection" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    const redirectPath = user.role === 'admin' ? '/admin' : 
                        user.role === 'freelancer' ? '/dashboard/freelancer' : 
                        '/dashboard/client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
