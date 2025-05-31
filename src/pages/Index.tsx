
import { ArrowRight, Users, Briefcase, Shield, Star, CheckCircle, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Design", count: "1,200+ services" },
    { name: "Marketing", count: "800+ services" },
    { name: "Video Editing", count: "650+ services" },
    { name: "Web Development", count: "2,100+ services" },
    { name: "Content Writing", count: "900+ services" },
    { name: "Mobile Apps", count: "450+ services" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Startup Founder",
      content: "Found amazing developers from India who delivered exactly what I needed.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Freelance Designer",
      content: "This platform helped me connect with international clients easily.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Servpe
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/services')}
                className="hover:bg-orange-50"
              >
                Explore Services
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="hover:bg-orange-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Get Started
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
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Hire top Indian freelancers
              </span>
              <br />
              <span className="text-gray-900">in minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with skilled Indian professionals for your projects. Get quality work done at competitive prices with our trusted freelancing platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="What do you need help with?" 
                  className="pl-12 h-14 text-lg border-2 border-orange-200 focus:border-orange-500"
                />
                <Button className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg group"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-orange-400 px-8 py-3 text-lg"
                onClick={() => navigate('/services')}
              >
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600">Find the perfect freelancer for your project</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied clients and freelancers
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join Servpe Today
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Whether you're looking to hire or get hired, we've got you covered
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group" onClick={() => navigate('/signup')}>
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
                  Hire skilled Indian freelancers for your projects
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Access to top Indian talent
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Competitive pricing
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Secure payments
                  </div>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white group-hover:bg-blue-600 transition-colors">
                  Start Hiring
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group" onClick={() => navigate('/signup')}>
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
                  Showcase your skills and get hired
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Global client access
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Build your reputation
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Secure payments
                  </div>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white group-hover:bg-purple-600 transition-colors">
                  Start Freelancing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Servpe</span>
              </div>
              <p className="text-gray-400">
                Connecting Indian talent with global opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>How to Hire</li>
                <li>Talent Marketplace</li>
                <li>Project Catalog</li>
                <li>Enterprise</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>How to Find Work</li>
                <li>Direct Contracts</li>
                <li>Find Freelance Jobs</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help & Support</li>
                <li>Success Stories</li>
                <li>Reviews</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">
              © 2024 Servpe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
