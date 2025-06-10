
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Index from '@/pages/Index';
import OTPLogin from '@/pages/OTPLogin';
import RoleSelection from '@/pages/RoleSelection';
import FreelancerDashboard from '@/pages/FreelancerDashboard';
import ClientDashboard from '@/pages/ClientDashboard';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLayout from '@/pages/admin/AdminLayout';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import CreateService from '@/pages/CreateService';
import MyServices from '@/pages/MyServices';
import FreelancerOrderDashboard from '@/pages/FreelancerOrderDashboard';
import PostProject from '@/pages/PostProject';
import FreelancerProjects from '@/pages/FreelancerProjects';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/otp-login" element={<OTPLogin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Protected Routes */}
            <Route
              path="/role-selection"
              element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              }
            />

            {/* Freelancer Routes */}
            <Route
              path="/freelancer/dashboard"
              element={
                <ProtectedRoute requiredRole="freelancer">
                  <FreelancerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/freelancer/orders"
              element={
                <ProtectedRoute requiredRole="freelancer">
                  <FreelancerOrderDashboard />
                </ProtectedRoute>
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
              path="/post-project"
              element={
                <ProtectedRoute requiredRole="freelancer">
                  <PostProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/freelancer-projects"
              element={
                <ProtectedRoute requiredRole="freelancer">
                  <FreelancerProjects />
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect based on role */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
