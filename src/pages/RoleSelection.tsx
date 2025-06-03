
import { useState } from "react";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/api/auth";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: 'client' | 'freelancer') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);

    try {
      // Update user role in localStorage for demo
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.role = selectedRole;
      user.isFirstTime = false;
      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: "Role Selected",
        description: `Welcome to Servpe as a ${selectedRole}!`,
      });

      // Navigate to appropriate dashboard or onboarding
      if (selectedRole === 'client') {
        navigate('/dashboard/client');
      } else {
        navigate('/dashboard/freelancer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Servpe!
          </h1>
          <p className="text-lg text-gray-600">
            How would you like to use our platform?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'client' 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleRoleSelect('client')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">I'm a Client</CardTitle>
              <CardDescription>
                I want to hire freelancers for my projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Post projects and get proposals</li>
                <li>• Browse freelancer profiles</li>
                <li>• Manage your projects and payments</li>
                <li>• Communicate with freelancers</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'freelancer' 
                ? 'ring-2 ring-green-500 border-green-500' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleRoleSelect('freelancer')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">I'm a Freelancer</CardTitle>
              <CardDescription>
                I want to offer my services and work on projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Create and showcase your services</li>
                <li>• Submit proposals to projects</li>
                <li>• Build your portfolio</li>
                <li>• Earn money from your skills</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8"
          >
            {isLoading ? "Setting up..." : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
