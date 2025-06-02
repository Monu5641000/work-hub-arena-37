
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Star, DollarSign, Clock, TrendingUp, Eye, MessageSquare, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { orderAPI } from "@/api/orders";
import { serviceAPI } from "@/api/services";
import { proposalAPI } from "@/api/proposals";
import { authAPI } from "@/api/auth";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeOrders: 0,
    completedOrders: 0,
    successRate: 0,
    totalServices: 0,
    pendingProposals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser || currentUser.role !== 'freelancer') {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Fetch data in parallel
      const [ordersResponse, servicesResponse, proposalsResponse] = await Promise.all([
        orderAPI.getMyOrders(),
        serviceAPI.getMyServices(),
        proposalAPI.getMyProposals()
      ]);

      if (ordersResponse.success) {
        const allOrders = ordersResponse.data;
        const activeOrdersList = allOrders.filter((order: any) => 
          ['in_progress', 'delivered'].includes(order.status)
        );
        setActiveOrders(activeOrdersList);

        // Calculate earnings and stats
        const totalEarnings = allOrders
          .filter((order: any) => order.status === 'completed')
          .reduce((sum: number, order: any) => sum + (order.freelancerEarnings || 0), 0);
        
        const completedOrders = allOrders.filter((order: any) => order.status === 'completed').length;
        const successRate = allOrders.length > 0 ? (completedOrders / allOrders.length) * 100 : 0;

        setStats(prev => ({
          ...prev,
          totalEarnings,
          activeOrders: activeOrdersList.length,
          completedOrders,
          successRate: Math.round(successRate)
        }));
      }

      if (servicesResponse.success) {
        setServices(servicesResponse.data);
        setStats(prev => ({
          ...prev,
          totalServices: servicesResponse.data.length
        }));
      }

      if (proposalsResponse.success) {
        setProposals(proposalsResponse.data);
        const pendingProposals = proposalsResponse.data.filter((proposal: any) => 
          proposal.status === 'pending'
        ).length;
        setStats(prev => ({
          ...prev,
          pendingProposals
        }));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Freelancer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/create-service')} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Service
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Freelancer'}!
          </h2>
          <p className="text-gray-600">Manage your services, orders, and grow your freelancing business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Active Orders</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Active Orders</h3>
              <Button variant="outline" onClick={() => navigate('/services')}>
                Browse Projects
              </Button>
            </div>
            
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No active orders at the moment.</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/create-service')}>
                    Create a Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order: any) => (
                  <Card key={order._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {order.service?.title || 'Service Order'}
                          </h4>
                          <p className="text-gray-600">
                            Client: {order.client?.firstName} {order.client?.lastName}
                          </p>
                        </div>
                        <Badge 
                          variant={order.status === "delivered" ? "default" : "secondary"}
                          className={order.status === "delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                        >
                          {order.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Earnings: ${order.freelancerEarnings}</span>
                        <span>
                          {order.daysRemaining > 0 
                            ? `${order.daysRemaining} days remaining` 
                            : order.isOverdue 
                              ? 'Overdue' 
                              : 'Due today'
                          }
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${order.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{order.progress || 0}% Complete</p>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/messages?order=${order._id}`)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" onClick={() => navigate(`/order/${order._id}`)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">My Services</h3>
              <Button onClick={() => navigate('/create-service')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Service
              </Button>
            </div>
            
            {services.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No services created yet.</p>
                  <Button className="mt-4" onClick={() => navigate('/create-service')}>
                    Create Your First Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <Card key={service._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        {service.images?.[0] && (
                          <img 
                            src={service.images[0].url} 
                            alt={service.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{service.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {service.averageRating || 0} ({service.totalReviews || 0})
                        </span>
                        <span>${service.pricingPlans?.basic?.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {service.impressions || 0} views
                        </span>
                        <Badge variant="outline">
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/services/${service._id}`)}>
                          View
                        </Button>
                        <Button size="sm" onClick={() => navigate(`/edit-service/${service._id}`)}>
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">My Proposals</h3>
              <Button onClick={() => navigate('/my-proposals')}>
                View All Proposals
              </Button>
            </div>
            
            {proposals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No proposals submitted yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/services')}>
                    Browse Projects
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {proposals.slice(0, 5).map((proposal: any) => (
                  <Card key={proposal._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {proposal.project?.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Proposed: ${proposal.proposedBudget?.amount}</span>
                            <span>Duration: {proposal.estimatedDuration}</span>
                            <span>Submitted {new Date(proposal.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Badge 
                            variant={
                              proposal.status === 'accepted' ? 'default' :
                              proposal.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                            className={
                              proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/proposal/${proposal._id}`)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Messages</h3>
              <Button onClick={() => navigate('/messages')}>
                View All Messages
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Communicate with your clients</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/messages')}>
                  Open Messages
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
