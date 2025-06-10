
import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { serviceAPI } from '@/api/services';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    deliveryTime: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

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

  useEffect(() => {
    loadServices();
  }, [filters, pagination.page]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await serviceAPI.getAllServices(params);
      
      if (response.success) {
        setServices(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages
        }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Load services error:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadServices();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      deliveryTime: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  const getBasicPrice = (service) => {
    return service.pricingPlans?.basic?.price || 0;
  };

  const getMinDeliveryTime = (service) => {
    return service.pricingPlans?.basic?.deliveryTime || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Services</h1>
          
          {/* Search and Filters */}
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search services..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <Select value={filters.category || undefined} onValueChange={(value) => handleFilterChange('category', value || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="pricingPlans.basic.price">Price: Low to High</SelectItem>
                <SelectItem value="averageRating">Rating</SelectItem>
                <SelectItem value="orders">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 grid lg:grid-cols-4 gap-4">
            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
            <Input
              placeholder="Max Delivery Days"
              type="number"
              value={filters.deliveryTime}
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            />
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {services.length} of {pagination.total} services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <Card key={service._id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    {/* Service Image */}
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      {service.images?.[0]?.url ? (
                        <img 
                          src={service.images[0].url} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      {/* Freelancer Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={service.freelancer?.profilePicture} />
                          <AvatarFallback className="text-xs">
                            {service.freelancer?.firstName?.[0]}{service.freelancer?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600">
                            {service.freelancer?.firstName} {service.freelancer?.lastName}
                          </span>
                          {service.freelancer?.username && (
                            <span className="text-xs text-gray-500">@{service.freelancer.username}</span>
                          )}
                        </div>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                        {service.title}
                      </h3>

                      {/* Rating */}
                      {service.averageRating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.averageRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({service.totalReviews})</span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {service.category.replace('-', ' ')}
                        </Badge>
                        {service.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Price and Delivery */}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-green-600">
                            ₹{getBasicPrice(service)}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{getMinDeliveryTime(service)} days</span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/services/${service._id}`)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          View <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
