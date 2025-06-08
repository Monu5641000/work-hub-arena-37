
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';
import { Sparkles, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const getNavItems = () => {
    if (!user || !token) {
      return [
        { label: 'Services', href: '/services' },
        { label: 'Find Freelancers', href: '/find-freelancers' },
      ];
    }

    const baseItems = [
      { label: 'Services', href: '/services' },
      { label: 'Find Freelancers', href: '/find-freelancers' },
    ];

    if (user.role === 'client') {
      return [
        ...baseItems,
        { label: 'Dashboard', href: '/client/dashboard' },
        { label: 'My Orders', href: '/client/orders' },
        { label: 'Post Project', href: '/post-project' },
        { label: 'Messages', href: '/messages' },
      ];
    }

    if (user.role === 'freelancer') {
      return [
        ...baseItems,
        { label: 'Dashboard', href: '/freelancer/dashboard' },
        { label: 'My Services', href: '/my-services' },
        { label: 'Orders', href: '/freelancer/orders' },
        { label: 'Proposals', href: '/my-proposals' },
        { label: 'Messages', href: '/messages' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Admin Dashboard', href: '/admin/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Categories', href: '/admin/categories' },
      ];
    }

    return baseItems;
  };

  return (
    <nav className="glass border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse-glow mr-2" />
              <span className="text-2xl font-bold text-gradient-purple hover:scale-105 transition-all duration-300">Servpe</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/otp-login')} className="text-gray-900 border-gray-300 hover:bg-gray-100 btn-3d">
                  Login
                </Button>
                <Button onClick={() => navigate('/otp-login')} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 arrow-hover" />
                </Button>
              </>
            ) : (
              <UserMenu />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
