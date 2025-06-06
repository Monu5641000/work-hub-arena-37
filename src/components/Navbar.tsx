
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';

const Navbar = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const getNavItems = () => {
    if (!user || !token) {
      return [
        { label: 'Services', href: '/services' },
        { label: 'Find Freelancers', href: '/freelancers' },
      ];
    }

    const baseItems = [
      { label: 'Services', href: '/services' },
      { label: 'Projects', href: '/projects' },
    ];

    if (user.role === 'client') {
      return [
        ...baseItems,
        { label: 'Dashboard', href: '/dashboard/client' },
        { label: 'My Orders', href: '/orders' },
        { label: 'Post Project', href: '/post-project' },
        { label: 'Messages', href: '/messages' },
      ];
    }

    if (user.role === 'freelancer') {
      return [
        ...baseItems,
        { label: 'Dashboard', href: '/dashboard/freelancer' },
        { label: 'My Services', href: '/my-services' },
        { label: 'Orders', href: '/freelancer-orders' },
        { label: 'Proposals', href: '/my-proposals' },
        { label: 'Messages', href: '/messages' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Services', href: '/admin/services' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Categories', href: '/admin/categories' },
      ];
    }

    return baseItems;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">Servpe</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Get Started
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
