
import { useState } from "react";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { serviceAPI } from "@/api/services";
import { useAuth } from "@/contexts/AuthContext";

const CreateService = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    tags: [],
    pricingPlans: {
      basic: {
        title: 'Basic',
        description: '',
        price: '',
        deliveryDays: '',
        revisions: '1',
        features: []
      },
      standard: {
        title: 'Standard',
        description: '',
        price: '',
        deliveryDays: '',
        revisions: '2',
        features: []
      },
      premium: {
        title: 'Premium',
        description: '',
        price: '',
        deliveryDays: '',
        revisions: '3',
        features: []
      }
    },
    requirements: [],
    faqs: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [images, setImages] = useState([]);

  const categories = [
    'Design', 'Development', 'Marketing', 'Writing', 'Video Editing', 
    'Data Entry', 'Translation', 'Other'
  ];

  if (!user || user.role !== 'freelancer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">You must be logged in as a freelancer to create services.</p>
            <Button onClick={() => navigate('/otp-login')} className="mt-4">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingPlanChange = (plan: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricingPlans: {
        ...prev.pricingPlans,
        [plan]: {
          ...prev.pricingPlans[plan as keyof typeof prev.pricingPlans],
          [field]: value
        }
      }
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addFeature = (plan: string) => {
    const feature = prompt('Enter feature:');
    if (feature) {
      const currentFeatures = formData.pricingPlans[plan as keyof typeof formData.pricingPlans].features;
      handlePricingPlanChange(plan, 'features', [
        ...currentFeatures,
        feature
      ]);
    }
  };

  const removeFeature = (plan: string, index: number) => {
    const currentFeatures = formData.pricingPlans[plan as keyof typeof formData.pricingPlans].features;
    const newFeatures = currentFeatures.filter((_, i) => i !== index);
    handlePricingPlanChange(plan, 'features', newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate at least one pricing plan
    const hasValidPlan = Object.values(formData.pricingPlans).some(
      plan => plan.price && plan.deliveryDays && plan.description
    );

    if (!hasValidPlan) {
      toast({
        title: "Pricing Required",
        description: "Please complete at least one pricing plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare service data
      const serviceData = {
        ...formData,
        pricingPlans: {
          basic: {
            ...formData.pricingPlans.basic,
            price: Number(formData.pricingPlans.basic.price) || 0,
            deliveryDays: Number(formData.pricingPlans.basic.deliveryDays) || 0,
            revisions: Number(formData.pricingPlans.basic.revisions) || 0,
          },
          standard: {
            ...formData.pricingPlans.standard,
            price: Number(formData.pricingPlans.standard.price) || 0,
            deliveryDays: Number(formData.pricingPlans.standard.deliveryDays) || 0,
            revisions: Number(formData.pricingPlans.standard.revisions) || 0,
          },
          premium: {
            ...formData.pricingPlans.premium,
            price: Number(formData.pricingPlans.premium.price) || 0,
            deliveryDays: Number(formData.pricingPlans.premium.deliveryDays) || 0,
            revisions: Number(formData.pricingPlans.premium.revisions) || 0,
          }
        }
      };

      const response = await serviceAPI.createService(serviceData);
      
      if (response.success) {
        toast({
          title: "Service Created",
          description: "Your service has been created successfully!",
        });
        navigate('/my-services');
      } else {
        throw new Error(response.message || 'Failed to create service');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/freelancer/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Service</h1>
          <p className="text-gray-600">Showcase your skills and start earning by creating an amazing service listing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the main details about your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="I will create a professional logo design..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you'll deliver, your experience, and why clients should choose you..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    placeholder="e.g., Logo Design"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Plans</CardTitle>
              <CardDescription>Create different packages for your service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {['basic', 'standard', 'premium'].map((plan) => (
                  <div key={plan} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg capitalize mb-4">{plan}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Package Title</Label>
                        <Input
                          placeholder={`${plan} package`}
                          value={formData.pricingPlans[plan as keyof typeof formData.pricingPlans].title}
                          onChange={(e) => handlePricingPlanChange(plan, 'title', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe what's included"
                          rows={3}
                          value={formData.pricingPlans[plan as keyof typeof formData.pricingPlans].description}
                          onChange={(e) => handlePricingPlanChange(plan, 'description', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Price (₹)</Label>
                          <Input
                            type="number"
                            placeholder="2500"
                            value={formData.pricingPlans[plan as keyof typeof formData.pricingPlans].price}
                            onChange={(e) => handlePricingPlanChange(plan, 'price', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Delivery (days)</Label>
                          <Input
                            type="number"
                            placeholder="3"
                            value={formData.pricingPlans[plan as keyof typeof formData.pricingPlans].deliveryDays}
                            onChange={(e) => handlePricingPlanChange(plan, 'deliveryDays', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Revisions</Label>
                        <Input
                          type="number"
                          placeholder="2"
                          value={formData.pricingPlans[plan as keyof typeof formData.pricingPlans].revisions}
                          onChange={(e) => handlePricingPlanChange(plan, 'revisions', e.target.value)}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Features</Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => addFeature(plan)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {formData.pricingPlans[plan as keyof typeof formData.pricingPlans].features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                              <span>{feature}</span>
                              <X 
                                className="h-3 w-3 cursor-pointer text-gray-500" 
                                onClick={() => removeFeature(plan, index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/freelancer/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
