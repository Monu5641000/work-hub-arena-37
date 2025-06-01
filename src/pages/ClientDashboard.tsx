
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, Filter, Star, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { orderAPI } from "@/api/orders";
import { projectAPI } from "@/api/projects";
import { authAPI } from "@/api/auth";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalSpent: 0,
    freelancersHired: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser || currentUser.role !== 'client') {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Fetch active orders
      const ordersResponse = await orderAPI.getMyOrders({ status: 'in_progress' });
      if (ordersResponse.success) {
        setActiveOrders(ordersResponse.data);
      }

      // Fetch projects
      const projectsResponse = await projectAPI.getMyProjects();
      if (projectsResponse.success) {
        setProjects(projectsResponse.data);
        
        // Calculate stats
        const activeProjectsCount = projectsResponse.data.filter((p: any) => 
          ['open', 'in-progress'].includes(p.status)
        ).length;
        
        const totalSpent = ordersResponse.data?.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || 0), 0) || 0;
        
        const uniqueFreelancers = new Set(ordersResponse.data?.map((order: any) => 
          order.freelancer?._id)).size;
        
        const completedOrders = ordersResponse.data?.filter((order: any) => 
          order.status === 'completed').length || 0;
        const totalOrders = ordersResponse.data?.length || 0;
        const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

        setStats({
          activeProjects: activeProjectsCount,
          totalSpent,
          freelancersHired: uniqueFreelancers,
          successRate: Math.round(successRate)
        });
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

  const handleCreateProject = () => {
    navigate('/create-project');
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
              <h1 className="text-xl font-semibold text-gray-900">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Post New Project
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Client'}!
          </h2>
          <p className="text-gray-600">Manage your projects and find the perfect freelancers for your needs.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
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
                  <p className="text-sm font-medium text-gray-600">Freelancers Hired</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.freelancersHired}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
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
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h3>
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No active orders at the moment.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/services')}>
                  Browse Services
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
                          Freelancer: {order.freelancer?.firstName} {order.freelancer?.lastName}
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
                      <span>Budget: ${order.totalAmount}</span>
                      <span>
                        {order.daysRemaining > 0 
                          ? `${order.daysRemaining} days remaining` 
                          : order.isOverdue 
                            ? 'Overdue' 
                            : 'Due today'
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${order.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{order.progress || 0}% Complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Posted Projects */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h3>
          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No projects posted yet.</p>
                <Button className="mt-4" onClick={handleCreateProject}>
                  Post Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project: any) => (
                <Card key={project._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{project.proposals?.length || 0} proposals</span>
                          <span>
                            Budget: ${project.budget?.amount?.min} - ${project.budget?.amount?.max}
                          </span>
                          <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">
                          {project.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                        <Button variant="outline" onClick={() => navigate(`/project/${project._id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
