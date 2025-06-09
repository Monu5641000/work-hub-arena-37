import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { serviceAPI } from '@/api/services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceUploadFormProps {
  onSuccess: () => void;
}

const ServiceUploadForm = ({ onSuccess }: ServiceUploadFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pricingPlans, setPricingPlans] = useState({
    basic: {
      name: '',
      price: 0,
      deliveryTime: 0,
      features: ['']
    },
    standard: {
      name: '',
      price: 0,
      deliveryTime: 0,
      features: ['']
    },
    premium: {
      name: '',
      price: 0,
      deliveryTime: 0,
      features: ['']
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a service.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('tags', tags);

      // Append images
      images.forEach((image) => {
        formData.append('images', image);
      });

      // Append pricing plans
      formData.append('pricingPlans[basic][title]', pricingPlans.basic.name);
      formData.append('pricingPlans[basic][price]', String(pricingPlans.basic.price));
      formData.append('pricingPlans[basic][deliveryDays]', String(pricingPlans.basic.deliveryTime));
      formData.append('pricingPlans[standard][title]', pricingPlans.standard.name);
      formData.append('pricingPlans[standard][price]', String(pricingPlans.standard.price));
      formData.append('pricingPlans[standard][deliveryDays]', String(pricingPlans.standard.deliveryTime));
      formData.append('pricingPlans[premium][title]', pricingPlans.premium.name);
      formData.append('pricingPlans[premium][price]', String(pricingPlans.premium.price));
      formData.append('pricingPlans[premium][deliveryDays]', String(pricingPlans.premium.deliveryTime));

      const response = await serviceAPI.createService(formData);

      if (response?.success) {
        toast({
          title: "Service Created",
          description: "Your service has been successfully created.",
        });
        onSuccess();
        navigate('/dashboard/freelancer');
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to create service.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Service creation error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Service</CardTitle>
        <CardDescription>Fill in the details to list your service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Basic Information</Label>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Pricing Plans</Label>
            
            {/* Basic Plan */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Basic Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="basic-name">Plan Name</Label>
                  <Input
                    id="basic-name"
                    value={pricingPlans.basic.name}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      basic: { ...prev.basic, name: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="basic-price">Price ($)</Label>
                  <Input
                    id="basic-price"
                    type="number"
                    value={pricingPlans.basic.price}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      basic: { ...prev.basic, price: Number(e.target.value) }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="basic-delivery">Delivery Time (days)</Label>
                  <Input
                    id="basic-delivery"
                    type="number"
                    value={pricingPlans.basic.deliveryTime}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      basic: { ...prev.basic, deliveryTime: Number(e.target.value) }
                    }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Standard Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="standard-name">Plan Name</Label>
                  <Input
                    id="standard-name"
                    value={pricingPlans.standard.name}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      standard: { ...prev.standard, name: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="standard-price">Price ($)</Label>
                  <Input
                    id="standard-price"
                    type="number"
                    value={pricingPlans.standard.price}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      standard: { ...prev.standard, price: Number(e.target.value) }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="standard-delivery">Delivery Time (days)</Label>
                  <Input
                    id="standard-delivery"
                    type="number"
                    value={pricingPlans.standard.deliveryTime}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      standard: { ...prev.standard, deliveryTime: Number(e.target.value) }
                    }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Premium Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="premium-name">Plan Name</Label>
                  <Input
                    id="premium-name"
                    value={pricingPlans.premium.name}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      premium: { ...prev.premium, name: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="premium-price">Price ($)</Label>
                  <Input
                    id="premium-price"
                    type="number"
                    value={pricingPlans.premium.price}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      premium: { ...prev.premium, price: Number(e.target.value) }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="premium-delivery">Delivery Time (days)</Label>
                  <Input
                    id="premium-delivery"
                    type="number"
                    value={pricingPlans.premium.deliveryTime}
                    onChange={(e) => setPricingPlans(prev => ({
                      ...prev,
                      premium: { ...prev.premium, deliveryTime: Number(e.target.value) }
                    }))}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Service..." : "Create Service"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceUploadForm;
