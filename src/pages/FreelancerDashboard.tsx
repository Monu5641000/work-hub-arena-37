
import { ArrowLeft, Search, Filter, Star, MapPin, Clock, DollarSign, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const FreelancerDashboard = () => {
  const navigate = useNavigate();

  const availableJobs = [
    {
      title: "Full-Stack React Developer Needed",
      client: "TechStart Inc.",
      budget: "$3,000 - $5,000",
      deadline: "3 weeks",
      skills: ["React", "Node.js", "MongoDB"],
      rating: 4.8,
      location: "Remote",
      posted: "2 hours ago",
      proposals: 5
    },
    {
      title: "Mobile App UI/UX Design",
      client: "Creative Agency",
      budget: "$1,500 - $2,500", 
      deadline: "2 weeks",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      rating: 4.9,
      location: "Remote",
      posted: "5 hours ago",
      proposals: 8
    },
    {
      title: "WordPress E-commerce Website",
      client: "Online Retailer",
      budget: "$2,000 - $3,500",
      deadline: "4 weeks", 
      skills: ["WordPress", "WooCommerce", "PHP"],
      rating: 4.7,
      location: "Remote",
      posted: "1 day ago",
      proposals: 12
    }
  ];

  const myProjects = [
    {
      title: "Dashboard Analytics Platform",
      client: "DataCorp",
      budget: "$4,500",
      progress: 65,
      deadline: "1 week",
      status: "In Progress"
    },
    {
      title: "Brand Identity Design",
      client: "Startup XYZ",
      budget: "$1,800",
      progress: 90,
      deadline: "3 days", 
      status: "Review"
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
              <h1 className="text-xl font-semibold text-gray-900">Freelancer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">My Profile</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">Submit Proposal</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah!</h2>
          <p className="text-gray-600">Find your next opportunity and grow your freelancing career.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">$18,750</p>
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
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Client Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Jobs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Available Jobs</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search jobs..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {availableJobs.map((job, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <span>{job.client}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{job.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{job.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{job.deadline}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div>
                        <span>{job.proposals} proposals</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Posted {job.posted}</span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Submit Proposal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Active Projects */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">My Active Projects</h3>
            <div className="space-y-4">
              {myProjects.map((project, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <Badge 
                        variant={project.status === "Review" ? "default" : "secondary"}
                        className={project.status === "Review" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
                    <p className="text-sm text-gray-600 mb-3">Budget: {project.budget}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{project.progress}% Complete</span>
                      <span>Due in {project.deadline}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Portfolio Manager
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Message Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Payment History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
