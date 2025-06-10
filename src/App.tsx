
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Home from '@/pages/Home';
import OTPLogin from '@/pages/OTPLogin';
import RoleSelection from '@/pages/RoleSelection';
import RequirementsForm from '@/pages/RequirementsForm';
import FreelancerDashboard from '@/pages/FreelancerDashboard';
import ClientDashboard from '@/pages/ClientDashboard';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLayout from '@/pages/admin/AdminLayout';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import CreateService from '@/pages/CreateService';
import MyServices from '@/pages/MyServices';
import ClientOrderDashboard from '@/pages/ClientOrderDashboard';
import FreelancerOrderDashboard from '@/pages/FreelancerOrderDashboard';
import PostProject from '@/pages/PostProject';
import FreelancerProjects from '@/pages/FreelancerProjects';
import BrowseProjects from '@/pages/BrowseProjects';
import ProjectDetail from '@/pages/ProjectDetail';
import Profile from '@/pages/Profile';
import Messaging from '@/pages/Messaging';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/otp-login" element={<OTPLogin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/projects" element={<BrowseProjects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            
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
            <Route
              path="/requirements"
              element={
                <ProtectedRoute requireRole={false}>
                  <RequirementsForm />
                </ProtectedRoute>
              }
            />

            {/* Freelancer Routes */}
            <Route
              path="/freelancer/dashboard"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <FreelancerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/freelancer/orders"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <FreelancerOrderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-service"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <CreateService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-services"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <MyServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-project"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <PostProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/freelancer-projects"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <FreelancerProjects />
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute requireRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/orders"
              element={
                <ProtectedRoute requireRole="client">
                  <ClientOrderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Common Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messaging"
              element={
                <ProtectedRoute>
                  <Messaging />
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
