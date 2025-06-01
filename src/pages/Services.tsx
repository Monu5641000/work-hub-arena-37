
import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Star, Heart, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  freelancer: {
    _id: string;
    name: string;
    profilePicture: string;
    location: string;
    averageRating: number;
    totalReviews: number;
    isVerified: boolean;
  };
  pricingPlans: {
    basic: {
      title: string;
      price: number;
      deliveryDays: number;
      revisions: number;
    };
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  status: string;
}

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 12
  });

  const categories = ['Design', 'Development', 'Marketing', 'Writing', 'Video Editing', 'Data Entry', 'Translation', 'Other'];
  const priceRanges = [
    { label: 'Under ₹5,000', min: '', max: '5000' },
    { label: '₹5,000 - ₹15,000', min: '5000', max: '15000' },
    { label: '₹15,000 - ₹50,000', min: '15000', max: '50000' },
    { label: 'Above ₹50,000', min: '50000', max: '' }
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getAllServices(filters);
      
      if (response.success) {
        setServices(response.data);
        setPagination(response.pagination);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

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
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
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
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="category" 
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  <span className="text-sm">All Categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="category" 
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
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
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="price" 
                    checked={!filters.minPrice && !filters.maxPrice}
                    onChange={() => handlePriceRangeChange('', '')}
                  />
                  <span className="text-sm">Any Price</span>
                </label>
                {priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                      onChange={() => handlePriceRangeChange(range.min, range.max)}
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="rating" 
                      value={rating.toString()}
                      checked={filters.rating === rating.toString()}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                    />
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{rating}+ stars</span>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                Browse Services ({pagination.total} results)
              </h1>
              <select 
                className="border rounded-md px-3 py-2"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
                }}
              >
                <option value="createdAt-desc">Newest</option>
                <option value="pricingPlans.basic.price-asc">Price: Low to High</option>
                <option value="pricingPlans.basic.price-desc">Price: High to Low</option>
                <option value="averageRating-desc">Top Rated</option>
                <option value="totalOrders-desc">Most Popular</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading services...</span>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No services found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card 
                      key={service._id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleServiceClick(service._id)}
                    >
                      <div className="relative">
                        <img 
                          src={service.images?.[0]?.url || "/placeholder.svg"} 
                          alt={service.images?.[0]?.alt || service.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement wishlist functionality
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2 bg-white/90"
                        >
                          {service.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <img 
                            src={service.freelancer.profilePicture || "/placeholder.svg"} 
                            alt={service.freelancer.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-600">{service.freelancer.name}</span>
                          {service.freelancer.isVerified && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {service.title}
                        </h3>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{service.averageRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({service.totalReviews})</span>
                        </div>
                        {service.freelancer.location && (
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{service.freelancer.location}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg">
                            ₹{service.pricingPlans.basic.price.toLocaleString()}
                          </span>
                          <Badge variant="secondary">
                            {service.pricingPlans.basic.deliveryDays} days
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {service.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {service.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        {pagination.current > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(pagination.current - 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          const page = Math.max(1, pagination.current - 2) + i;
                          if (page > pagination.pages) return null;
                          
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === pagination.current}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {pagination.current < pagination.pages && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(pagination.current + 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
