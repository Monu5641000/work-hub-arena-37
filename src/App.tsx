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
import Onboarding from '@/pages/Onboarding';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import FindFreelancers from '@/pages/FindFreelancers';
import CreateService from '@/pages/CreateService';
import MyServices from '@/pages/MyServices';
import CreateProject from '@/pages/CreateProject';
import PostProject from '@/pages/PostProject';
import MyProposals from '@/pages/MyProposals';
import Messages from '@/pages/Messages';
import ClientDashboard from '@/pages/ClientDashboard';
import FreelancerDashboard from '@/pages/FreelancerDashboard';
import ClientOrders from '@/pages/ClientOrders';
import ClientOrderHistory from '@/pages/ClientOrderHistory';
import FreelancerOrders from '@/pages/FreelancerOrders';
import FreelancerOrderDashboard from '@/pages/FreelancerOrderDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminCategories from '@/pages/admin/AdminCategories';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/otp-login" element={<OTPLogin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/find-freelancers" element={<FindFreelancers />} />
            
            {/* Protected Routes */}
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
            <Route path="/post-project" element={
              <ProtectedRoute allowedRoles={['client']}>
                <PostProject />
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
            <Route path="/my-proposals" element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <MyProposals />
              </ProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCategories />
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
