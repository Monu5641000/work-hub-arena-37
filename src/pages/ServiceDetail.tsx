
import { useState, useEffect } from "react";
import { ArrowLeft, Star, Heart, Clock, CheckCircle, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { serviceAPI } from "@/api/services";
import { orderAPI } from "@/api/orders";
import Chat from "@/components/Chat";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const loadService = async () => {
    try {
      const response = await serviceAPI.getService(serviceId!);
      if (response.success) {
        setService(response.data);
      } else {
        toast({
          title: "Error",
          description: "Service not found",
          variant: "destructive",
        });
        navigate('/services');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service",
        variant: "destructive",
      });
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to book this service",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!requirements.trim()) {
      toast({
        title: "Requirements Missing",
        description: "Please provide your requirements",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const orderData = {
        serviceId: service._id,
        selectedPlan,
        requirements: requirements.trim(),
        addOns: []
      };

      const response = await orderAPI.createOrder(orderData);
      if (response.success) {
        toast({
          title: "Order Placed",
          description: "Your order has been sent to the freelancer",
        });
        navigate('/client/orders');
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to contact the seller",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setShowChat(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Service not found</p>
          <Button onClick={() => navigate('/services')} className="mt-4">
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const currentPlan = service.pricingPlans[selectedPlan];

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setShowChat(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Service
          </Button>
          <Chat
            recipientId={service.freelancer._id}
            recipientName={`${service.freelancer.firstName} ${service.freelancer.lastName}`}
            onClose={() => setShowChat(false)}
          />
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
            {/* Service Images */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={service.images?.[0]?.url || "/placeholder.svg"} 
                alt={service.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{service.category}</Badge>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.averageRating || 0}</span>
                    <span className="text-gray-500">({service.totalReviews || 0} reviews)</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{service.orders || 0} orders completed</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.tags?.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Freelancer Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={service.freelancer.profilePicture || "/placeholder.svg"}
                      alt={`${service.freelancer.firstName} ${service.freelancer.lastName}`}
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {service.freelancer.firstName} {service.freelancer.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="secondary">Freelancer</Badge>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span>{service.freelancer.rating?.average || 0}</span>
                      </div>
                      <span>•</span>
                      <span>{service.freelancer.rating?.count || 0} reviews</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleContactSeller}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Package Selection */}
                  <div className="flex space-x-2">
                    {Object.entries(service.pricingPlans).map(([key, plan]: [string, any]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPlan(key)}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                          selectedPlan === key 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {plan.title || key.charAt(0).toUpperCase() + key.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Selected Package Details */}
                  {currentPlan && (
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">
                          {currentPlan.title || selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                        </h3>
                        <span className="text-2xl font-bold">₹{currentPlan.price?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{currentPlan.deliveryTime} days delivery</span>
                        </div>
                        <span>•</span>
                        <span>{currentPlan.revisions} revisions</span>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {currentPlan.features?.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-3">
                        <Textarea
                          placeholder="Describe your requirements..."
                          value={requirements}
                          onChange={(e) => setRequirements(e.target.value)}
                          className="min-h-[100px]"
                        />
                        
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          onClick={handleBookNow}
                          disabled={isBooking}
                        >
                          {isBooking ? 'Placing Order...' : `Book Now (₹${currentPlan.price?.toLocaleString()})`}
                        </Button>
                        
                        <Button variant="outline" className="w-full" onClick={handleContactSeller}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
