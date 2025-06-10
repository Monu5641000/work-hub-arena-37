
import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ServiceUploadForm = ({ onSubmit, onCancel }: { 
  onSubmit: (serviceData: any) => void; 
  onCancel: () => void; 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    pricingPlans: {
      basic: {
        title: 'Basic',
        description: '',
        price: 0,
        deliveryTime: 1,
        revisions: 1,
        features: [] as string[]
      }
    },
    images: [] as File[]
  });
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const categories = [
    'web-development',
    'mobile-development',
    'design',
    'writing',
    'marketing',
    'data-science',
    'consulting',
    'other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const handlePricingChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      pricingPlans: {
        ...formData.pricingPlans,
        basic: {
          ...formData.pricingPlans.basic,
          [field]: value
        }
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.pricingPlans.basic.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        pricingPlans: {
          ...prev.pricingPlans,
          basic: {
            ...prev.pricingPlans.basic,
            features: [...prev.pricingPlans.basic.features, newFeature.trim()]
          }
        }
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      pricingPlans: {
        ...prev.pricingPlans,
        basic: {
          ...prev.pricingPlans.basic,
          features: prev.pricingPlans.basic.features.filter(f => f !== feature)
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Service</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="I will create a stunning website design"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your service in detail..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Frontend Development"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="pr-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 p-0 h-4 w-4"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Basic Package</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicPrice">Price (₹) *</Label>
                <Input
                  id="basicPrice"
                  type="number"
                  value={formData.pricingPlans.basic.price}
                  onChange={(e) => handlePricingChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Delivery Time (Days) *</Label>
                <Input
                  id="deliveryTime"
                  type="number"
                  value={formData.pricingPlans.basic.deliveryTime}
                  onChange={(e) => handlePricingChange('deliveryTime', parseInt(e.target.value) || 1)}
                  placeholder="7"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basicDescription">Package Description</Label>
              <Textarea
                id="basicDescription"
                value={formData.pricingPlans.basic.description}
                onChange={(e) => handlePricingChange('description', e.target.value)}
                placeholder="What's included in this package..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Package Features</Label>
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.pricingPlans.basic.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="pr-1">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 p-0 h-4 w-4"
                      onClick={() => removeFeature(feature)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Service Images (Max 5)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                </div>
              </label>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 p-0 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">
              Create Service
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceUploadForm;
