import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star, 
  Plus, 
  Upload,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/currency';
import Navbar from '@/components/Navbar';
import { serviceAPI } from '@/api/services';
import { freelancerProjectAPI } from '@/api/freelancerProjects';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeOrders: 0,
    completedOrders: 0,
    averageRating: 0,
    totalServices: 0,
    totalProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch services
      const servicesResponse = await serviceAPI.getMyServices();
      setServices(servicesResponse.data || []);
      
      // Fetch freelancer projects
      const projectsResponse = await freelancerProjectAPI.getMyProjects();
      setProjects(projectsResponse.data || []);
      
      // Calculate stats
      const totalServices = servicesResponse.data?.length || 0;
      const totalProjects = projectsResponse.data?.length || 0;
      
      setStats({
        totalEarnings: 12500, // This would come from orders data
        activeOrders: 8,
        completedOrders: 47,
        averageRating: user?.rating?.average || 4.8,
        totalServices,
        totalProjects
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPicture(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axios.put<ApiResponse>(`${API_BASE_URL}/users/profile/picture`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update user profile picture in context if needed
        window.location.reload(); // Simple refresh to update the UI
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setUploadingPicture(false);
    }
  };

  const statsCards = [
    {
      title: "Total Earnings",
      value: formatCurrency(stats.totalEarnings),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Orders",
      value: stats.activeOrders.toString(),
      icon: Clock,
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
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
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

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={fullName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    `${user?.firstName?.[0]}${user?.lastName?.[0]}`
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    disabled={uploadingPicture}
                  />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-600">Here's what's happening with your freelance business</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/create-service')} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Service
              </Button>
              <Button onClick={() => navigate('/post-project')} variant="outline" className="border-purple-600 text-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Post Project
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Services */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">My Services</CardTitle>
                <Button onClick={() => navigate('/my-services')} variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't created any services yet</p>
                  <Button onClick={() => navigate('/create-service')} className="bg-purple-600 hover:bg-purple-700">
                    Create Your First Service
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.slice(0, 3).map((service: any) => (
                    <div key={service._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-500">{service.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-purple-600 font-medium">
                            {formatCurrency(service.pricingPlans?.basic?.price)}
                          </span>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{service.impressions || 0}</span>
                            <Star className="w-4 h-4" />
                            <span>{service.averageRating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Projects */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">My Projects</CardTitle>
                <Button onClick={() => navigate('/freelancer-projects')} variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't posted any projects yet</p>
                  <Button onClick={() => navigate('/post-project')} variant="outline">
                    Post Your First Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project: any) => (
                    <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{project.views || 0}</span>
                            <Heart className="w-4 h-4" />
                            <span>{project.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
                  <p className="text-sm font-medium text-gray-900">New order received for "Website Design"</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Service "Logo Design" was viewed 15 times</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Received 5-star review</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
