
import { useState } from "react";
import { ArrowLeft, User, Briefcase, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'client' | 'freelancer' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup:', { ...formData, userType });
    
    // Redirect based on user type
    if (userType === 'client') {
      navigate('/dashboard/client');
    } else if (userType === 'freelancer') {
      navigate('/dashboard/freelancer');
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Servpe</h1>
            <p className="text-gray-600">Choose how you want to use our platform</p>
          </div>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-300"
              onClick={() => setUserType('client')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-fit">
                  <Briefcase className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">I'm a Client</CardTitle>
                <CardDescription className="text-lg">
                  Looking to hire freelancers for my projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Post projects and hire talent
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Access to verified freelancers
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Secure payment protection
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-300"
              onClick={() => setUserType('freelancer')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-fit">
                  <User className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">I'm a Freelancer</CardTitle>
                <CardDescription className="text-lg">
                  Looking to find work and build my career
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Browse quality projects
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Build your reputation
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Get paid securely
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setUserType(null)}
            className="mb-4 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold">
            Sign up as {userType === 'client' ? 'Client' : 'Freelancer'}
          </CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button variant="link" onClick={() => navigate('/login')} className="p-0">
                Sign in
              </Button>
            </p>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => console.log('Google signup')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
