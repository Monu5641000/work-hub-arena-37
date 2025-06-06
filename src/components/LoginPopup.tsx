
import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup = ({ isOpen, onClose }: LoginPopupProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleGetStarted = () => {
    navigate('/login');
    onClose();
  };

  return (
    <Dialog open={isOpen && !user} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="relative">
          {/* 3D Card Container */}
          <div className="login-popup-card perspective-1000 transform-3d">
            <div className="glass-card-dark rounded-3xl p-8 border border-white/20 shadow-3d-purple transform-gpu hover:shadow-glow-purple transition-all duration-700 animate-scale-in">
              {/* Background Glow Effects */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:rotate-90 z-10"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-glow-purple animate-pulse-glow">
                    <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
                  </div>
                </div>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-white text-glow mb-2">
                    Welcome to Servpe
                  </DialogTitle>
                  <p className="text-white/70 text-lg">
                    Join thousands of freelancers and clients
                  </p>
                </DialogHeader>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-3 rounded-xl glass hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Connect with Top Talent</p>
                    <p className="text-white/60 text-sm">Find verified professionals instantly</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-xl glass hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Secure & Trusted</p>
                    <p className="text-white/60 text-sm">Your projects are safe with us</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGetStarted}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group text-lg font-semibold"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 arrow-hover" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleLogin}
                  className="w-full h-12 border-white/30 text-white hover:bg-white/10 btn-3d text-lg"
                >
                  Already have an account? Sign In
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 pt-6 border-t border-white/10">
                <p className="text-white/50 text-sm">
                  Join our community of 10,000+ users
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPopup;
