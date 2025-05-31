
import { ArrowRight, Users, Briefcase, Shield, Star, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Find Top Talent",
      description: "Connect with skilled freelancers from around the world"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-purple-500" />,
      title: "Quality Projects",
      description: "Access high-paying projects from verified clients"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow system"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Freelancers" },
    { number: "25K+", label: "Happy Clients" },
    { number: "$10M+", label: "Paid to Freelancers" },
    { number: "99%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FreelanceHub
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/client')}
                className="hover:bg-blue-50"
              >
                For Clients
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/freelancer')}
                className="hover:bg-purple-50"
              >
                For Freelancers
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="border-gray-300 hover:bg-gray-50"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Freelance
              </span>
              <br />
              <span className="text-gray-900">Your Way to Success</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect talented freelancers with amazing projects. Build your career or grow your business 
              on the world's most trusted freelancing platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg group"
                onClick={() => navigate('/client')}
              >
                Hire Freelancers
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-purple-400 px-8 py-3 text-lg"
                onClick={() => navigate('/freelancer')}
              >
                Find Work
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FreelanceHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of freelancing with our cutting-edge platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals already succeeding on our platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group" onClick={() => navigate('/client')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  I'm a Client
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-gray-600 text-base mb-4">
                  Hire skilled freelancers for your projects
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Post unlimited projects
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Access to verified freelancers
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Secure payment system
                  </div>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white group-hover:bg-blue-600 transition-colors">
                  Get Started as Client
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group" onClick={() => navigate('/freelancer')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  I'm a Freelancer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-gray-600 text-base mb-4">
                  Find amazing projects and grow your career
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Browse quality projects
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Build your reputation
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Get paid securely
                  </div>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white group-hover:bg-purple-600 transition-colors">
                  Start Freelancing
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group" onClick={() => navigate('/admin')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-gray-600 text-base mb-4">
                  Manage platform operations and users
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                    Monitor platform analytics
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                    Manage user accounts
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                    Platform configuration
                  </div>
                </div>
                <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white group-hover:bg-gray-800 transition-colors">
                  Admin Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">FreelanceHub</span>
          </div>
          <p className="text-gray-400 mb-8">
            Building the future of freelancing, one connection at a time.
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">
              © 2024 FreelanceHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
