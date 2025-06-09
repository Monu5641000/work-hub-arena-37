
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Pages
import Home from '@/pages/Home';
import RoleSelection from '@/pages/RoleSelection';
import CreateService from '@/pages/CreateService';
import MyServices from '@/pages/MyServices';
import ClientOrders from '@/pages/ClientOrders';
import UserProfile from '@/components/UserProfile';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (user.needsRoleSelection) {
    return <Navigate to="/role-selection" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Role Selection Guard
const RoleSelectionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!user.needsRoleSelection) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route 
        path="/role-selection" 
        element={
          <RoleSelectionGuard>
            <RoleSelection />
          </RoleSelectionGuard>
        } 
      />
      
      <Route 
        path="/create-service" 
        element={
          <ProtectedRoute requiredRole="freelancer">
            <CreateService />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-services" 
        element={
          <ProtectedRoute requiredRole="freelancer">
            <MyServices />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/client/orders" 
        element={
          <ProtectedRoute requiredRole="client">
            <ClientOrders />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
