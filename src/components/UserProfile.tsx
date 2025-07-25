import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

interface UserProfileProps {
  userId?: string;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, isOwnProfile = true }) => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const { user: currentUser, updateUser } = useAuth();

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      let response;
      if (isOwnProfile) {
        response = await authAPI.getMe();
        setUser(response.user);
        setFormData(response.user);
      } else {
        response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
          setFormData(data.data.user);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        setUser(response.data);
        updateUser(response.data);
        setEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {user.role === 'freelancer' ? 'Freelancer' : user.role === 'admin' ? 'Administrator' : 'Client'}
                  </CardDescription>
                  {user.role === 'freelancer' && user.rating && (
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {user.rating.average} ({user.rating.count} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {isOwnProfile && (
                <div className="space-x-2">
                  {!editing ? (
                    <Button onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="contact">Contact & Settings</TabsTrigger>
            {user.role === 'freelancer' && <TabsTrigger value="professional">Professional</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">
                    {user.bio || 'No bio provided yet.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skills (for freelancers) */}
            {user.role === 'freelancer' && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill.name} - {skill.level}
                        </Badge>
                      )) || <p className="text-gray-500">No skills added yet</p>}
                    </div>
                    {user.hourlyRate && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Hourly Rate</p>
                        <p className="text-lg font-semibold text-green-600">₹{user.hourlyRate}/hour</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Contact & Account Settings
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    {editing ? (
                      <Input
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        type="email"
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{user.email || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    {editing ? (
                      <Input
                        value={formData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{user.phoneNumber || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  {editing ? (
                    <Input
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{user.location || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === 'freelancer' && (
            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Hourly Rate (₹)</label>
                        <Input
                          type="number"
                          value={formData.hourlyRate || ''}
                          onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                          placeholder="Enter hourly rate"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Experience</label>
                        <Textarea
                          value={formData.experience || ''}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          placeholder="Describe your professional experience..."
                          rows={4}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.hourlyRate && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Hourly Rate</p>
                          <p className="text-lg font-semibold text-green-600">₹{user.hourlyRate}/hour</p>
                        </div>
                      )}
                      {user.experience && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Experience</p>
                          <p className="text-gray-700 mt-1">{user.experience}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
