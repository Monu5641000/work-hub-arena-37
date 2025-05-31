
import { ArrowLeft, Plus, Search, Filter, Star, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();

  const activeProjects = [
    {
      title: "E-commerce Website Development",
      freelancer: "Sarah Johnson",
      budget: "$2,500",
      deadline: "2 weeks",
      progress: 75,
      status: "In Progress"
    },
    {
      title: "Mobile App UI/UX Design",
      freelancer: "Alex Chen",
      budget: "$1,800",
      deadline: "1 week",
      progress: 90,
      status: "Almost Done"
    }
  ];

  const proposalRequests = [
    {
      title: "React Dashboard Development",
      proposals: 12,
      budget: "$3,000 - $5,000",
      posted: "2 days ago"
    },
    {
      title: "Content Writing for Blog",
      proposals: 8,
      budget: "$500 - $800",
      posted: "5 days ago"
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
              <h1 className="text-xl font-semibold text-gray-900">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Manage your projects and find the perfect freelancers for your needs.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
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
                  <p className="text-2xl font-bold text-gray-900">$24,500</p>
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
                  <p className="text-2xl font-bold text-gray-900">15</p>
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
                  <p className="text-2xl font-bold text-gray-900">96%</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h3>
          <div className="space-y-4">
            {activeProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                      <p className="text-gray-600">Freelancer: {project.freelancer}</p>
                    </div>
                    <Badge 
                      variant={project.status === "Almost Done" ? "default" : "secondary"}
                      className={project.status === "Almost Done" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Budget: {project.budget}</span>
                    <span>Deadline: {project.deadline}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{project.progress}% Complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Posted Projects */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recently Posted Projects</h3>
          <div className="space-y-4">
            {proposalRequests.map((project, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{project.proposals} proposals</span>
                        <span>Budget: {project.budget}</span>
                        <span>Posted {project.posted}</span>
                      </div>
                    </div>
                    <Button variant="outline">View Proposals</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
