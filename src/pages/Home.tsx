
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/role-selection');
    } else if (user.role === 'client') {
      navigate('/services');
    } else if (user.role === 'freelancer') {
      navigate('/my-services');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-orange-600">Servpe</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with talented freelancers or offer your services to clients worldwide. 
            Build your career, grow your business, and achieve your goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/services')}
              className="text-lg px-8 py-3"
            >
              Browse Services
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-blue-600">For Clients</CardTitle>
              <CardDescription>Find the perfect freelancer for your project</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2">
                <li>• Post projects and get proposals</li>
                <li>• Browse verified freelancers</li>
                <li>• Secure payment system</li>
                <li>• 24/7 customer support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-green-600">For Freelancers</CardTitle>
              <CardDescription>Showcase your skills and grow your business</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2">
                <li>• Create service listings</li>
                <li>• Build your portfolio</li>
                <li>• Secure earnings</li>
                <li>• Global client base</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-purple-600">Why Servpe?</CardTitle>
              <CardDescription>The platform that works for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2">
                <li>• Easy to use interface</li>
                <li>• Secure transactions</li>
                <li>• Quality assurance</li>
                <li>• Growing community</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of clients and freelancers who trust Servpe
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            Join Servpe Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
