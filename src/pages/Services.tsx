
import { useState } from "react";
import { ArrowLeft, Search, Filter, Star, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 1,
      title: "Professional Logo Design",
      freelancer: "Priya Sharma",
      rating: 4.9,
      reviews: 127,
      price: "₹2,500",
      image: "/placeholder.svg",
      location: "Mumbai, India",
      category: "Design",
      deliveryTime: "3 days"
    },
    {
      id: 2,
      title: "React.js Web Development",
      freelancer: "Amit Kumar",
      rating: 4.8,
      reviews: 89,
      price: "₹15,000",
      image: "/placeholder.svg",
      location: "Bangalore, India",
      category: "Development",
      deliveryTime: "7 days"
    },
    // Add more services...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search services..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Design', 'Development', 'Marketing', 'Writing', 'Video'].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Under ₹5,000', '₹5,000 - ₹15,000', '₹15,000 - ₹50,000', 'Above ₹50,000'].map((range) => (
                  <label key={range} className="flex items-center space-x-2">
                    <input type="radio" name="price" className="rounded" />
                    <span className="text-sm">{range}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Browse Services</h1>
              <select className="border rounded-md px-3 py-2">
                <option>Sort by: Relevance</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <img 
                        src="/placeholder.svg" 
                        alt={service.freelancer}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{service.freelancer}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {service.title}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-sm text-gray-500">({service.reviews})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{service.price}</span>
                      <Badge variant="secondary">{service.deliveryTime}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
