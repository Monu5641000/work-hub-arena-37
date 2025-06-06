import { useState, useEffect } from "react";
import { Search, Star, Users, CheckCircle, ArrowRight, Menu, Sparkles, Globe, Zap, ChevronRight } from "lucide-react";
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
    }, 1500); // Show popup after 1.5 seconds

    return () => clearTimeout(timer);
  }, [user]);

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const categories = [
    { name: "Web Development", count: 1250, icon: "💻", color: "from-purple-500 to-indigo-600" },
    { name: "Graphic Design", count: 890, icon: "🎨", color: "from-pink-500 to-rose-600" },
    { name: "Digital Marketing", count: 675, icon: "📱", color: "from-emerald-500 to-teal-600" },
    { name: "Writing & Translation", count: 534, icon: "✍️", color: "from-violet-500 to-purple-600" },
    { name: "Video & Animation", count: 423, icon: "🎬", color: "from-red-500 to-pink-600" },
    { name: "Music & Audio", count: 298, icon: "🎵", color: "from-yellow-500 to-orange-600" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      content: "Found an amazing developer within 24 hours. The quality of work exceeded my expectations!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Director",
      content: "Servpe has been a game-changer for our agency. Top-tier talent at competitive rates.",
      rating: 5,
      avatar: "RK"
    },
    {
      name: "Priya Sharma",
      role: "E-commerce Owner",
      content: "The platform made it so easy to find the right freelancer for my project. Highly recommended!",
      rating: 5,
      avatar: "PS"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Login Popup */}
      <LoginPopup isOpen={showLoginPopup} onClose={handleCloseLoginPopup} />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 glass border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gradient-purple hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse-glow" />
                Servpe
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/services" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group">
                Browse Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/create-project" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group">
                Post Project
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-white border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-300 btn-3d">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4 arrow-hover" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="md:hidden">
              <Button variant="ghost" size="sm" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 perspective-1000">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find India's Top{" "}
              <span className="text-gradient-purple animate-gradient-shift">
                Freelancers
              </span>{" "}
              in Seconds
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
              <span className="text-xl text-white/80">Powered by AI</span>
            </div>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              No more endless scrolling. Just tell us what you need – Servpe's AI finds your
              perfect match in seconds.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex shadow-3d rounded-2xl overflow-hidden glass-card hover:shadow-glow transition-all duration-300">
                <Input
                  type="text"
                  placeholder='Describe your requirements... (e.g. "E-commerce website management")'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-14 text-lg border-0 bg-transparent text-white placeholder:text-white/50 focus:ring-0"
                />
                <Button type="submit" className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group">
                  <Search className="h-5 w-5 mr-2" />
                  <ArrowRight className="h-5 w-5 arrow-hover" />
                </Button>
              </div>
            </form>

            {/* Quick Service Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["Video Editing", "Website development", "Instagram reel editing", "Graphic design", "Content writing", "AI services", "Youtube thumbnail"].map((tag, index) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="px-4 py-2 glass text-white border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    ['--stagger' as any]: index
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" onClick={() => navigate(user.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer')} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 arrow-hover" />
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/login')} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 arrow-hover" />
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => navigate('/services')} className="border-white/30 text-white hover:bg-white/10 btn-3d">
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-16 px-4 perspective-1000">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-glow">Popular Categories</h2>
            <p className="text-white/70 text-lg">Discover services across various categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.name} 
                className="group card-3d hover:shadow-3d transition-all duration-500 cursor-pointer transform-3d"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  ['--stagger' as any]: index
                }}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  <div className="text-4xl mb-4 group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">{category.icon}</div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-glow transition-all duration-300">{category.name}</h3>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">{category.count} services</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-glow">Why Choose Servpe?</h2>
            <p className="text-white/70 text-lg">The best platform to connect with talented freelancers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group card-3d p-6 rounded-2xl transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-500 shadow-glow">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-glow">Verified Professionals</h3>
              <p className="text-white/70">All freelancers are verified and have proven track records</p>
            </div>
            
            <div className="text-center group card-3d p-6 rounded-2xl transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-500 shadow-glow">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-glow">Quality Guaranteed</h3>
              <p className="text-white/70">Get your money back if you're not satisfied with the work</p>
            </div>
            
            <div className="text-center group card-3d p-6 rounded-2xl transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-500 shadow-glow">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-glow">Top Rated</h3>
              <p className="text-white/70">Work with freelancers rated 4.9/5 on average</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-glow">What Our Clients Say</h2>
            <p className="text-white/70 text-lg">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="group card-3d hover:shadow-3d transition-all duration-500 transform-3d"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  ['--stagger' as any]: index
                }}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold group-hover:animate-spin-3d">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg group-hover:text-glow">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 border border-white/10 card-3d">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">Ready to Get Started?</h2>
            <p className="text-xl text-white/70 mb-8">Join Servpe today and connect with top freelancers</p>
            <Button size="lg" onClick={() => navigate('/login')} className="bg-white text-gray-900 hover:bg-gray-100 btn-3d group text-lg px-8 py-4">
              Sign Up Now
              <ArrowRight className="ml-2 h-6 w-6 arrow-hover" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative glass text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 text-gradient-purple">Servpe</div>
              <p className="text-white/60">Connecting talented freelancers with amazing projects.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">For Clients</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">How to Hire</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Talent Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Project Catalog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">For Freelancers</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">How to Find Work</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Direct Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Find Freelance Jobs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Help & Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Servpe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
