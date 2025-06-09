
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import OTPLogin from '@/pages/OTPLogin';
import RoleSelection from '@/pages/RoleSelection';
import ProfileCompletion from '@/pages/ProfileCompletion';
import Onboarding from '@/pages/Onboarding';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import FindFreelancers from '@/pages/FindFreelancers';
import CreateService from '@/pages/CreateService';
import MyServices from '@/pages/MyServices';
import CreateProject from '@/pages/CreateProject';
import PostProject from '@/pages/PostProject';
import FreelancerProjects from '@/pages/FreelancerProjects';
import MyProposals from '@/pages/MyProposals';
import Messages from '@/pages/Messages';
import ClientDashboard from '@/pages/ClientDashboard';
import FreelancerDashboard from '@/pages/FreelancerDashboard';
import ClientOrders from '@/pages/ClientOrders';
import ClientOrderHistory from '@/pages/ClientOrderHistory';
import FreelancerOrders from '@/pages/FreelancerOrders';
import FreelancerOrderDashboard from '@/pages/FreelancerOrderDashboard';
import FreelancerProfile from '@/pages/FreelancerProfile';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Navigate to="/otp-login" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/otp-login" element={<OTPLogin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/find-freelancers" element={<FindFreelancers />} />
            <Route path="/@:username" element={<FreelancerProfile />} />
            
            {/* Protected Routes - General */}
            <Route path="/profile-completion" element={
              <ProtectedRoute>
                <ProfileCompletion />
              </ProtectedRoute>
            } />
            <Route path="/role-selection" element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            {/* Client Routes */}
            <Route path="/client/dashboard" element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/client" element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/client/orders" element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientOrders />
              </ProtectedRoute>
            } />
            <Route path="/client/order-history" element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientOrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/create-project" element={
              <ProtectedRoute allowedRoles={['client']}>
                <CreateProject />
              </ProtectedRoute>
            } />
            
            {/* Freelancer Routes */}
            <Route path="/freelancer/dashboard" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <FreelancerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/freelancer" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <FreelancerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/freelancer/orders" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <FreelancerOrders />
              </ProtectedRoute>
            } />
            <Route path="/freelancer/order-dashboard" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <FreelancerOrderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-services" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <MyServices />
              </ProtectedRoute>
            } />
            <Route path="/create-service" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <CreateService />
              </ProtectedRoute>
            } />
            <Route path="/freelancer-projects" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <FreelancerProjects />
              </ProtectedRoute>
            } />
            <Route path="/my-proposals" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <MyProposals />
              </ProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route path="/post-project" element={
              <ProtectedRoute allowedRoles={['client', 'freelancer']}>
                <PostProject />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
