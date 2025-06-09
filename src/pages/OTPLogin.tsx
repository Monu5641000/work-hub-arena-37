
import { useState, useEffect } from "react";
import { ArrowLeft, Phone, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_WEB_CLIENT_ID"; // You need to set this

declare global {
  interface Window {
    google: any;
    googleLoginCallback: (response: any) => void;
  }
}

const OTPLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    whatsappNumber: ''
  });
  const [tempToken, setTempToken] = useState('');
  const [tempUser, setTempUser] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.needsRoleSelection || !user.roleSelected) {
        navigate('/role-selection');
      } else {
        navigate(user.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer');
      }
    }
  }, [user, navigate]);

  // ... keep existing code (useEffect for Google OAuth, initializeGoogleAuth, handleGoogleResponse)
  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogleAuth;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    
    try {
      const result = await authAPI.googleLogin(response.credential);
      
      if (result.success && result.user && result.token) {
        login(result.token, result.user);
        
        toast({
          title: "Login Successful",
          description: "Welcome to Servpe!",
        });
        
        // Navigate based on user role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.needsRoleSelection) {
          navigate('/role-selection');
        } else {
          if (result.user.role === 'client') {
            navigate('/dashboard/client');
          } else if (result.user.role === 'freelancer') {
            navigate('/dashboard/freelancer');
          } else {
            navigate('/role-selection');
          }
        }
      } else {
        throw new Error(result.message || 'Google login failed');
      }
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.response?.data?.message || "Failed to login with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure +91 prefix is always present
    if (!value.startsWith('+91 ')) {
      setPhoneNumber('+91 ');
    } else {
      setPhoneNumber(value);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Indian phone number (10 digits after +91)
    const phoneRegex = /^\+91 [6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian mobile number (10 digits starting with 6-9)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending OTP to:', phoneNumber);
      const response = await authAPI.sendOTP(phoneNumber);
      console.log('OTP Response:', response);
      
      if (response.success && response.data?.orderId) {
        setOrderId(response.data.orderId);
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${phoneNumber}`,
        });
        setStep('otp');
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('OTP sending error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(phoneNumber, otp, orderId);
      
      if (response.success && response.user && response.token) {
        // Check if user needs to complete profile
        if (!response.user.email || !response.user.username) {
          setTempToken(response.token);
          setTempUser(response.user);
          setStep('details');
        } else {
          login(response.token, response.user);
          
          toast({
            title: "Login Successful",
            description: `Welcome ${response.user.role === 'admin' ? 'Admin' : 'to Servpe'}!`,
          });
          
          // Navigate based on user role
          if (response.user.role === 'admin') {
            navigate('/admin');
          } else if (response.user.needsRoleSelection) {
            navigate('/role-selection');
          } else {
            if (response.user.role === 'client') {
              navigate('/dashboard/client');
            } else if (response.user.role === 'freelancer') {
              navigate('/dashboard/freelancer');
            } else {
              navigate('/role-selection');
            }
          }
        }
      } else {
        throw new Error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast({
        title: "Invalid OTP",
        description: error.response?.data?.message || "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userDetails.username || !userDetails.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile with additional details
      const updateData = {
        username: userDetails.username,
        email: userDetails.email,
        whatsappNumber: userDetails.whatsappNumber || phoneNumber
      };

      const response = await authAPI.updateProfile(updateData);
      
      if (response.success && tempUser && tempToken) {
        login(tempToken, { ...tempUser, ...updateData });
        
        toast({
          title: "Profile Completed",
          description: "Welcome to Servpe!",
        });
        
        // Navigate based on user role
        if (tempUser.role === 'admin') {
          navigate('/admin');
        } else if (tempUser.needsRoleSelection) {
          navigate('/role-selection');
        } else {
          if (tempUser.role === 'client') {
            navigate('/dashboard/client');
          } else if (tempUser.role === 'freelancer') {
            navigate('/dashboard/freelancer');
          } else {
            navigate('/role-selection');
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: "Profile Update Failed",
        description: error.response?.data?.message || "Failed to complete profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      toast({
        title: "Google Login Error",
        description: "Google authentication is not loaded. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in shadow-2xl">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (step === 'details') setStep('otp');
              else if (step === 'otp') setStep('phone');
              else navigate('/');
            }}
            className="mb-4 self-start hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold animate-fade-in">
            {step === 'phone' && 'Login with Phone'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'details' && 'Complete Profile'}
          </CardTitle>
          <CardDescription className="animate-fade-in" style={{animationDelay: '0.1s'}}>
            {step === 'phone' && 'Enter your Indian mobile number to receive a verification code'}
            {step === 'otp' && `Enter the 6-digit code sent to ${phoneNumber}`}
            {step === 'details' && 'Please complete your profile information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-in" style={{animationDelay: '0.2s'}}>
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                    autoComplete="tel"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter 10-digit mobile number (e.g., +91 98765 43210)
                </p>
                {phoneNumber === '+91 8789601387' && (
                  <p className="text-xs text-red-600 font-medium">
                    Admin login detected
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
                disabled={isLoading || phoneNumber.length < 14}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : step === 'otp' ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  className="w-full"
                >
                  <InputOTPGroup className="w-full justify-center">
                    <InputOTPSlot index={0} className="transition-all duration-200" />
                    <InputOTPSlot index={1} className="transition-all duration-200" />
                    <InputOTPSlot index={2} className="transition-all duration-200" />
                    <InputOTPSlot index={3} className="transition-all duration-200" />
                    <InputOTPSlot index={4} className="transition-all duration-200" />
                    <InputOTPSlot index={5} className="transition-all duration-200" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setStep('phone')}
                disabled={isLoading}
              >
                Change Phone Number
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={userDetails.username}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder={phoneNumber}
                    value={userDetails.whatsappNumber}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Leave empty to use your phone number
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
                disabled={isLoading || !userDetails.username || !userDetails.email}
              >
                {isLoading ? "Completing..." : "Complete Profile"}
              </Button>
            </form>
          )}
          
          {(step === 'phone' || step === 'otp') && (
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
                className="w-full mt-4 hover:bg-gray-50 hover:scale-105 transition-all duration-200"
                onClick={handleGoogleLogin}
                disabled={isLoading}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPLogin;
