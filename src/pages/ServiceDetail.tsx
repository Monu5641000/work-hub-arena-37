
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, RefreshCw, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { serviceAPI } from '@/api/services';
import ServiceOrderForm from '@/components/ServiceOrderForm';
import Chat from '@/components/Chat';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const response = await serviceAPI.getService(id);
      if (response.success) {
        setService(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Load service error:', error);
      toast({
        title: "Error",
        description: "Failed to load service details",
        variant: "destructive",
      });
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPlaced = (order) => {
    setShowOrderForm(false);
    setShowChat(true);
    toast({
      title: "Order placed successfully!",
      description: "You can now chat with the freelancer about your project.",
    });
  };

  const handleContactFreelancer = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to contact the freelancer",
        variant: "destructive",
      });
      return;
    }
    setShowChat(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <Button onClick={() => navigate('/services')}>Browse Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/services')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={service.freelancer?.profilePicture} />
                    <AvatarFallback>
                      {service.freelancer?.firstName?.[0]}{service.freelancer?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{service.freelancer?.firstName} {service.freelancer?.lastName}</span>
                      </div>
                      {service.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{service.averageRating.toFixed(1)} ({service.totalReviews} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{service.category.replace('-', ' ')}</Badge>
                  {service.subcategory && (
                    <Badge variant="outline">{service.subcategory}</Badge>
                  )}
                  {service.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Service Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(service.pricingPlans).map(([planName, plan]) => {
                    if (!plan || !plan.price) return null;
                    
                    return (
                      <div key={planName} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg capitalize mb-2">{planName}</h3>
                        <p className="text-2xl font-bold text-green-600 mb-2">₹{plan.price}</p>
                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{plan.deliveryTime} days delivery</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <RefreshCw className="h-4 w-4" />
                            <span>{plan.revisions} revisions</span>
                          </div>
                        </div>

                        {plan.features && plan.features.length > 0 && (
                          <div className="space-y-1">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                ✓ {feature}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* About Freelancer */}
            <Card>
              <CardHeader>
                <CardTitle>About the Freelancer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={service.freelancer?.profilePicture} />
                    <AvatarFallback>
                      {service.freelancer?.firstName?.[0]}{service.freelancer?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{service.freelancer?.firstName} {service.freelancer?.lastName}</h3>
                    {service.freelancer?.bio && (
                      <p className="text-gray-600 mt-2">{service.freelancer.bio}</p>
                    )}
                    {service.freelancer?.skills && service.freelancer.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {service.freelancer.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {user?.role === 'client' && service.freelancer?._id !== user._id && (
                  <>
                    <Button 
                      onClick={() => setShowOrderForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Order Now
                    </Button>
                    <Button 
                      onClick={handleContactFreelancer}
                      variant="outline"
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Freelancer
                    </Button>
                  </>
                )}
                
                {!user && (
                  <div className="text-center text-gray-600">
                    <p className="mb-4">Sign in to order this service</p>
                    <Button onClick={() => navigate('/login')} className="w-full">
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Service Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders in queue</span>
                  <span className="font-medium">{service.orders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total reviews</span>
                  <span className="font-medium">{service.totalReviews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-medium">Within 24 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Place Order</h2>
              <Button variant="ghost" onClick={() => setShowOrderForm(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <ServiceOrderForm 
                service={service}
                onOrderPlaced={handleOrderPlaced}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && service.freelancer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <Chat
              recipientId={service.freelancer._id}
              recipientName={`${service.freelancer.firstName} ${service.freelancer.lastName}`}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
