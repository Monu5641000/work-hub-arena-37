
import { useState, useEffect } from "react";
import { ArrowLeft, Users, Briefcase, DollarSign, TrendingUp, Eye, MessageSquare, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/api/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalServices: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingServices: 0,
    activeDisputes: 0
  });
  const [pendingServices, setPendingServices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // In a real app, you would fetch this data from admin-specific endpoints
      // For now, we'll simulate the data structure
      
      // Simulate fetching admin stats
      const adminStatsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (adminStatsResponse.ok) {
        const statsData = await adminStatsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      } else {
        // Fallback to mock data if admin endpoints aren't ready
        setStats({
          totalUsers: 1250,
          totalFreelancers: 850,
          totalClients: 400,
          totalServices: 2340,
          totalOrders: 1850,
          totalRevenue: 285000,
          pendingServices: 23,
          activeDisputes: 5
        });
      }

      // Fetch pending services
      const servicesResponse = await fetch('http://localhost:5000/api/admin/services/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        if (servicesData.success) {
          setPendingServices(servicesData.data);
        }
      }

      // Fetch recent orders
      const ordersResponse = await fetch('http://localhost:5000/api/admin/orders/recent', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          setRecentOrders(ordersData.data);
        }
      }

    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      // Set mock data for demo purposes
      setStats({
        totalUsers: 1250,
        totalFreelancers: 850,
        totalClients: 400,
        totalServices: 2340,
        totalOrders: 1850,
        totalRevenue: 285000,
        pendingServices: 23,
        activeDisputes: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveService = async (serviceId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/services/${serviceId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Service Approved",
          description: "The service has been approved and is now live.",
        });
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve service",
        variant: "destructive",
      });
    }
  };

  const handleRejectService = async (serviceId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/services/${serviceId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: 'Does not meet platform guidelines' })
      });

      if (response.ok) {
        toast({
          title: "Service Rejected",
          description: "The service has been rejected.",
        });
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject service",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="bg-red-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">Manage users, services, orders, and platform operations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {stats.totalFreelancers} freelancers, {stats.totalClients} clients
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12.5% this month</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Services</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServices.toLocaleString()}</p>
                  <p className="text-xs text-orange-600">{stats.pendingServices} pending approval</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                  <p className="text-xs text-red-600">{stats.activeDisputes} active disputes</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-800">{stats.pendingServices}</h3>
                    <p className="text-orange-600">Services to Review</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800">{stats.activeDisputes}</h3>
                    <p className="text-red-600">Active Disputes</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800">12</h3>
                    <p className="text-blue-600">User Reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">New freelancer registration</p>
                      <p className="text-sm text-gray-600">Sarah Johnson joined as a UI/UX Designer</p>
                    </div>
                    <span className="text-sm text-gray-500">2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Service published</p>
                      <p className="text-sm text-gray-600">"React Development" by Alex Chen</p>
                    </div>
                    <span className="text-sm text-gray-500">5 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Order completed</p>
                      <p className="text-sm text-gray-600">$2,500 order by TechCorp Inc.</p>
                    </div>
                    <span className="text-sm text-gray-500">15 minutes ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Pending Approval</CardTitle>
                <CardDescription>Review and approve new services submitted by freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingServices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No services pending approval</p>
                ) : (
                  <div className="space-y-4">
                    {pendingServices.map((service: any) => (
                      <div key={service._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{service.title}</h3>
                          <p className="text-sm text-gray-600">{service.description.substring(0, 100)}...</p>
                          <p className="text-sm text-gray-500">
                            by {service.freelancer?.firstName} {service.freelancer?.lastName}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/admin/service/${service._id}`)}
                          >
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveService(service._id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectService(service._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Monitor platform transactions and order status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock recent orders */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">E-commerce Website Development</h3>
                      <p className="text-sm text-gray-600">Client: TechCorp Inc. | Freelancer: Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Order #ORD1234567890123</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      <p className="text-sm font-medium">$2,500</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Logo Design Package</h3>
                      <p className="text-sm text-gray-600">Client: StartupXYZ | Freelancer: Alex Chen</p>
                      <p className="text-sm text-gray-500">Order #ORD1234567890124</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      <p className="text-sm font-medium">$800</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Monitor and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Registrations</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">Freelancer - UI/UX Designer</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">TechCorp Inc.</p>
                          <p className="text-sm text-gray-600">Client - Technology</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Active Users (30 days)</span>
                        <span className="font-semibold">1,045</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>New Registrations (7 days)</span>
                        <span className="font-semibold">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Verification Rate</span>
                        <span className="font-semibold">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Disputes</CardTitle>
                <CardDescription>Resolve conflicts between clients and freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.activeDisputes === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active disputes</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                      <div>
                        <h3 className="font-medium">Payment Issue - Order #ORD123</h3>
                        <p className="text-sm text-gray-600">Client claims work was not delivered as specified</p>
                        <p className="text-sm text-gray-500">Dispute opened 2 days ago</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm">Resolve</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
