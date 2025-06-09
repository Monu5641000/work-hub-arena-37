
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/otp-login" state={{ from: location }} replace />;
  }

  // Check if user needs to select a role
  if (!user.role || !user.roleSelected) {
    if (location.pathname !== '/role-selection') {
      return <Navigate to="/role-selection" replace />;
    }
  }

  // Check if user needs to complete profile
  if (!user.username && location.pathname !== '/profile-completion' && location.pathname !== '/role-selection') {
    return <Navigate to="/profile-completion" replace />;
  }

  // Check role permissions
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
