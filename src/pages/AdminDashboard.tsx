
import { ArrowLeft, Users, Briefcase, DollarSign, TrendingUp, Settings, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+12%",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Active Projects", 
      value: "1,567",
      change: "+8%",
      icon: <Briefcase className="h-6 w-6 text-green-600" />,
      color: "green"
    },
    {
      title: "Total Revenue",
      value: "$2.1M",
      change: "+15%",
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      color: "purple"
    },
    {
      title: "Platform Growth",
      value: "23.5%",
      change: "+5%",
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      color: "orange"
    }
  ];

  const recentActivity = [
    {
      type: "user_joined",
      message: "New freelancer registered: Sarah Johnson",
      time: "5 minutes ago",
      status: "info"
    },
    {
      type: "project_completed",
      message: "Project completed: E-commerce Website",
      time: "1 hour ago", 
      status: "success"
    },
    {
      type: "payment_processed",
      message: "Payment processed: $2,500 to Alex Chen",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "dispute_raised",
      message: "Dispute raised: Project #1234",
      time: "3 hours ago",
      status: "warning"
    }
  ];

  const pendingApprovals = [
    {
      type: "Freelancer Verification",
      user: "Mike Rodriguez",
      submitted: "2 days ago",
      priority: "high"
    },
    {
      type: "Project Dispute",
      user: "TechStart Inc. vs John Doe",
      submitted: "1 day ago", 
      priority: "urgent"
    },
    {
      type: "Withdrawal Request",
      user: "Emma Wilson",
      submitted: "3 days ago",
      priority: "medium"
    }
  ];

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
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-gray-700 hover:bg-gray-800">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h2>
          <p className="text-gray-600">Monitor and manage your freelancing platform operations.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Quick actions for user administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Freelancers
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Handle Disputes
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Project Oversight
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Management
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items requiring admin attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{item.type}</h4>
                        <Badge 
                          variant={item.priority === 'urgent' ? 'destructive' : 
                                 item.priority === 'high' ? 'default' : 'secondary'}
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.user}</p>
                      <p className="text-xs text-gray-500 mb-3">Submitted {item.submitted}</p>
                      <div className="space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-blue-600">120ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium text-purple-600">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm font-medium text-red-600">0.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
