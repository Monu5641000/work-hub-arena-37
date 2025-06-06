
import { useState, useEffect } from "react";
import { Search, Star, Users, CheckCircle, ArrowRight, Menu, Sparkles, Globe, Zap, ChevronRight, TrendingUp, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/currency";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";
import LoginPopup from "@/components/LoginPopup";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Show login popup on page load for non-authenticated users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setShowLoginPopup(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const categories = [
    { name: "Web Development", count: 1250, icon: "💻", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50" },
    { name: "Graphic Design", count: 890, icon: "🎨", color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50" },
    { name: "Digital Marketing", count: 675, icon: "📱", color: "from-green-500 to-green-600", bgColor: "bg-green-50" },
    { name: "Writing & Translation", count: 534, icon: "✍️", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50" },
    { name: "Video & Animation", count: 423, icon: "🎬", color: "from-red-500 to-red-600", bgColor: "bg-red-50" },
    { name: "Music & Audio", count: 298, icon: "🎵", color: "from-yellow-500 to-yellow-600", bgColor: "bg-yellow-50" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      content: "Found an amazing developer within 24 hours. The quality of work exceeded my expectations!",
      rating: 5,
      avatar: "SJ",
      company: "TechStart Inc."
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Director", 
      content: "Servpe has been a game-changer for our agency. Top-tier talent at competitive rates.",
      rating: 5,
      avatar: "RK",
      company: "Digital Solutions"
    },
    {
      name: "Priya Sharma",
      role: "E-commerce Owner",
      content: "The platform made it so easy to find the right freelancer for my project. Highly recommended!",
      rating: 5,
      avatar: "PS",
      company: "Fashion Hub"
    }
  ];

  const stats = [
    { label: "Active Freelancers", value: "50,000+", icon: Users },
    { label: "Projects Completed", value: "1M+", icon: CheckCircle },
    { label: "Client Satisfaction", value: "98%", icon: Star },
    { label: "Countries Served", value: "150+", icon: Globe }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Login Popup */}
      <LoginPopup isOpen={showLoginPopup} onClose={handleCloseLoginPopup} />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div 
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2" 
                onClick={() => navigate('/')}
              >
                <Sparkles className="w-6 h-6 text-purple-600" />
                Servpe
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/services" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 font-medium">
                Browse Services
              </a>
              <a href="/create-project" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 font-medium">
                Post Project
              </a>
              
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-600 hover:text-purple-600">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="md:hidden">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Powered by AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Find India's Top{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Freelancers
              </span>{" "}
              in Seconds
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              No more endless scrolling. Just tell us what you need – Servpe's AI finds your
              perfect match in seconds.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Input
                  type="text"
                  placeholder='Describe your requirements... (e.g. "E-commerce website management")'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-14 text-lg border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0"
                />
                <Button type="submit" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Service Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {["Video Editing", "Website Development", "Instagram Reel Editing", "Graphic Design", "Content Writing", "AI Services", "YouTube Thumbnail"].map((tag, index) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-colors duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" onClick={() => navigate(user.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/login')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => navigate('/services')} className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg">
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Popular Categories</h2>
            <p className="text-gray-600 text-lg">Discover services across various categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.name} 
                className="group bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} services</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose Servpe?</h2>
            <p className="text-gray-600 text-lg">The best platform to connect with talented freelancers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Verified Professionals</h3>
              <p className="text-gray-600">All freelancers are verified and have proven track records</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Quality Guaranteed</h3>
              <p className="text-gray-600">Get your money back if you're not satisfied with the work</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600">Get your projects completed quickly with our efficient platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-sm"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-purple-600">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8">Join Servpe today and connect with top freelancers</p>
          <Button size="lg" onClick={() => navigate('/login')} className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Sign Up Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Servpe</div>
              <p className="text-gray-400">Connecting talented freelancers with amazing projects.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">How to Hire</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Talent Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Project Catalog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">For Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">How to Find Work</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Direct Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Find Freelance Jobs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Help & Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Servpe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
