
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Plus, 
  Search,
  Filter,
  Star,
  Eye,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/currency';
import Navbar from '@/components/Navbar';
import { serviceAPI } from '@/api/services';
import { projectAPI } from '@/api/projects';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
    completedOrders: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  useEffect(() => {
    fetchAvailableServices();
  }, [searchQuery, selectedCategory]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch my projects
      const projectsResponse = await projectAPI.getMyProjects();
      setMyProjects(projectsResponse.data || []);
      
      // Calculate stats
      const activeProjects = projectsResponse.data?.filter(p => p.status === 'open').length || 0;
      
      setStats({
        totalSpent: 8750, // This would come from orders data
        activeOrders: 5,
        completedOrders: 23,
        activeProjects
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableServices = async () => {
    try {
      const params = {
        search: searchQuery,
        category: selectedCategory,
        limit: 6
      };
      
      const response = await serviceAPI.getAllServices(params);
      setAvailableServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setAvailableServices([]);
    }
  };

  const statsCards = [
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Orders",
      value: stats.activeOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders.toString(),
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const categories = [
    "Web Development", "Graphic Design", "Digital Marketing", 
    "Writing & Translation", "Video & Animation", "Music & Audio"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Manage your projects and find new services</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/post-project')} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Post Project
              </Button>
              <Button onClick={() => navigate('/services')} variant="outline" className="border-purple-600 text-purple-600">
                Browse Services
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Projects */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">My Projects</CardTitle>
                  <Button onClick={() => navigate('/my-projects')} variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {myProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't posted any projects yet</p>
                    <Button onClick={() => navigate('/post-project')} className="bg-purple-600 hover:bg-purple-700">
                      Post Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProjects.slice(0, 4).map(project => (
                      <div key={project._id} className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={
                            project.status === 'open' ? 'default' : 
                            project.status === 'in-progress' ? 'secondary' : 'outline'
                          }>
                            {project.status}
                          </Badge>
                          <span className="text-sm text-purple-600 font-medium">
                            {project.budget?.type === 'fixed' 
                              ? formatCurrency(project.budget.amount.min)
                              : `${formatCurrency(project.budget?.amount?.min || 0)}/hr`
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Available Services */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Featured Services</CardTitle>
                  <Button onClick={() => navigate('/services')} variant="outline" size="sm">
                    View All Services
                  </Button>
                </div>
                
                {/* Search and Filter */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {availableServices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No services found. Try adjusting your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableServices.map(service => (
                      <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {service.freelancer?.firstName?.[0]}{service.freelancer?.lastName?.[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{service.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              by {service.freelancer?.firstName} {service.freelancer?.lastName}
                            </p>
                            
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {service.averageRating?.toFixed(1) || '0.0'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Eye className="w-4 h-4" />
                                <span>{service.impressions || 0}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-purple-600 font-bold">
                                {formatCurrency(service.pricingPlans?.basic?.price || 0)}
                              </span>
                              <Button 
                                size="sm" 
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Project "E-commerce Website" received 3 proposals</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Order for "Logo Design" has been delivered</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New message from freelancer John Doe</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
