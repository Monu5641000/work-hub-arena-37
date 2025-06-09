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
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";

const CreateService = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        deliveryTime: '',
        revisions: '1',
        features: []
      },
      standard: {
        title: 'Standard',
        description: '',
        price: '',
        deliveryTime: '',
        revisions: '2',
        features: []
      },
      premium: {
        title: 'Premium',
        description: '',
        price: '',
        deliveryTime: '',
        revisions: '3',
        features: []
      }
    }
  });

  const [currentTag, setCurrentTag] = useState('');
  const [images, setImages] = useState([]);

  const categories = [
    'web-development', 'mobile-development', 'design', 'writing', 
    'marketing', 'data-science', 'consulting', 'other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingPlanChange = (plan, field, value) => {
    setFormData(prev => ({
      ...prev,
      pricingPlans: {
        ...prev.pricingPlans,
        [plan]: {
          ...prev.pricingPlans[plan],
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

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addFeature = (plan) => {
    const feature = prompt('Enter feature:');
    if (feature) {
      handlePricingPlanChange(plan, 'features', [
        ...formData.pricingPlans[plan].features,
        feature
      ]);
    }
  };

  const removeFeature = (plan, index) => {
    const newFeatures = formData.pricingPlans[plan].features.filter((_, i) => i !== index);
    handlePricingPlanChange(plan, 'features', newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare service data for backend
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        tags: formData.tags,
        pricingPlans: {
          basic: {
            ...formData.pricingPlans.basic,
            price: Number(formData.pricingPlans.basic.price),
            deliveryTime: Number(formData.pricingPlans.basic.deliveryTime),
            revisions: Number(formData.pricingPlans.basic.revisions)
          },
          standard: formData.pricingPlans.standard.price ? {
            ...formData.pricingPlans.standard,
            price: Number(formData.pricingPlans.standard.price),
            deliveryTime: Number(formData.pricingPlans.standard.deliveryTime),
            revisions: Number(formData.pricingPlans.standard.revisions)
          } : undefined,
          premium: formData.pricingPlans.premium.price ? {
            ...formData.pricingPlans.premium,
            price: Number(formData.pricingPlans.premium.price),
            deliveryTime: Number(formData.pricingPlans.premium.deliveryTime),
            revisions: Number(formData.pricingPlans.premium.revisions)
          } : undefined
        }
      };

      const response = await serviceAPI.createService(serviceData);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Service created successfully",
        });
        navigate('/dashboard/freelancer');
      } else {
        throw new Error(response.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Create service error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/freelancer')}
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
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  placeholder="I will create a professional logo design..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
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
                  <Label>Category</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
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
                        <Label>Package Description</Label>
                        <Textarea
                          placeholder="Describe what's included"
                          rows={3}
                          value={formData.pricingPlans[plan].description}
                          onChange={(e) => handlePricingPlanChange(plan, 'description', e.target.value)}
                          required={plan === 'basic'}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Price (₹)</Label>
                          <Input
                            type="number"
                            placeholder="2500"
                            value={formData.pricingPlans[plan].price}
                            onChange={(e) => handlePricingPlanChange(plan, 'price', e.target.value)}
                            required={plan === 'basic'}
                          />
                        </div>
                        <div>
                          <Label>Delivery (days)</Label>
                          <Input
                            type="number"
                            placeholder="3"
                            value={formData.pricingPlans[plan].deliveryTime}
                            onChange={(e) => handlePricingPlanChange(plan, 'deliveryTime', e.target.value)}
                            required={plan === 'basic'}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Revisions</Label>
                        <Input
                          type="number"
                          placeholder="2"
                          value={formData.pricingPlans[plan].revisions}
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
                          {formData.pricingPlans[plan].features.map((feature, index) => (
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
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard/freelancer')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
