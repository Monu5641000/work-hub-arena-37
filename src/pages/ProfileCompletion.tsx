
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/api/auth';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    whatsappNumber: ''
  });

  useEffect(() => {
    if (!user || !token) {
      navigate('/otp-login');
      return;
    }

    // If user already has username, redirect to appropriate dashboard
    if (user.username) {
      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else if (user.role === 'freelancer') {
        navigate('/freelancer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [user, token, navigate]);

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/check-username/${username}`);
      const data = await response.json();
      setUsernameAvailable(data.data.available);
    } catch (error) {
      console.error('Username check error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'username') {
      checkUsernameAvailability(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      toast({
        title: "Required Fields",
        description: "Username and email are required",
        variant: "destructive",
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: "Username Taken",
        description: "Please choose a different username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been completed successfully!",
        });
        
        // Redirect based on role
        if (user?.role === 'client') {
          navigate('/client/dashboard');
        } else if (user?.role === 'freelancer') {
          navigate('/freelancer/dashboard');
        } else if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide some additional information to complete your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="your_username"
                required
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
                title="Username can only contain letters, numbers, and underscores"
              />
              {formData.username.length >= 3 && (
                <p className={`text-sm ${usernameAvailable === true ? 'text-green-600' : usernameAvailable === false ? 'text-red-600' : 'text-gray-500'}`}>
                  {usernameAvailable === true && '✓ Username is available'}
                  {usernameAvailable === false && '✗ Username is taken'}
                  {usernameAvailable === null && 'Checking availability...'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number (Optional)</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || usernameAvailable === false}
            >
              {loading ? "Updating..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
