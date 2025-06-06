
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import OTPLogin from "./pages/OTPLogin";
import RoleSelection from "./pages/RoleSelection";
import Onboarding from "./pages/Onboarding";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import CreateService from "./pages/CreateService";
import CreateProject from "./pages/CreateProject";
import PostProject from "./pages/PostProject";
import Messages from "./pages/Messages";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyProposals from "./pages/MyProposals";
import UserProfile from "./components/UserProfile";
import NotFound from "./pages/NotFound";

// New Pages
import MyServices from "./pages/MyServices";
import FreelancerOrders from "./pages/FreelancerOrders";
import ClientOrders from "./pages/ClientOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<OTPLogin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            
            {/* Auth Required Routes */}
            <Route path="/role-selection" element={
              <ProtectedRoute requireRoleSelection={false}>
                <RoleSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />

            {/* Client Routes */}
            <Route path="/dashboard/client" element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/post-project" element={
              <ProtectedRoute requiredRole="client">
                <PostProject />
              </ProtectedRoute>
            } />
            
            <Route path="/create-project" element={
              <ProtectedRoute requiredRole="client">
                <CreateProject />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute requiredRole="client">
                <ClientOrders />
              </ProtectedRoute>
            } />

            {/* Freelancer Routes */}
            <Route path="/dashboard/freelancer" element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/create-service" element={
              <ProtectedRoute requiredRole="freelancer">
                <CreateService />
              </ProtectedRoute>
            } />
            
            <Route path="/my-services" element={
              <ProtectedRoute requiredRole="freelancer">
                <MyServices />
              </ProtectedRoute>
            } />
            
            <Route path="/freelancer-orders" element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerOrders />
              </ProtectedRoute>
            } />
            
            <Route path="/my-proposals" element={
              <ProtectedRoute requiredRole="freelancer">
                <MyProposals />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/categories" element={
              <ProtectedRoute requiredRole="admin">
                <AdminCategories />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
