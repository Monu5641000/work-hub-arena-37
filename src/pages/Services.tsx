
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Star, MapPin, Clock, DollarSign, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceAPI } from '@/api/services';
import { formatCurrency } from '@/utils/currency';
import Navbar from '@/components/Navbar';

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services', searchQuery, category, priceRange, sortBy],
    queryFn: () => serviceAPI.getServices({
      search: searchQuery,
      category,
      minPrice: priceRange === 'low' ? undefined : priceRange === 'mid' ? 1000 : priceRange === 'high' ? 5000 : undefined,
      maxPrice: priceRange === 'low' ? 1000 : priceRange === 'mid' ? 5000 : priceRange === 'high' ? undefined : undefined,
      sort: sortBy,
    }),
  });

  const services = servicesData?.data || [];

  const categories = [
    'Web Development',
    'Mobile Development',
    'Graphic Design',
    'Digital Marketing',
    'Content Writing',
    'Video Editing',
    'SEO',
    'Social Media'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <div className="h-48 bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-glow">
            Browse <span className="text-gradient-purple">Services</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover amazing services from talented freelancers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-2xl p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-gray-50"
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d">
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-gray-900 hover:bg-gray-100">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="" className="text-gray-900 hover:bg-gray-100">All Prices</SelectItem>
                  <SelectItem value="low" className="text-gray-900 hover:bg-gray-100">Under ₹1,000</SelectItem>
                  <SelectItem value="mid" className="text-gray-900 hover:bg-gray-100">₹1,000 - ₹5,000</SelectItem>
                  <SelectItem value="high" className="text-gray-900 hover:bg-gray-100">Above ₹5,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="newest" className="text-gray-900 hover:bg-gray-100">Newest First</SelectItem>
                  <SelectItem value="price_low" className="text-gray-900 hover:bg-gray-100">Price: Low to High</SelectItem>
                  <SelectItem value="price_high" className="text-gray-900 hover:bg-gray-100">Price: High to Low</SelectItem>
                  <SelectItem value="rating" className="text-gray-900 hover:bg-gray-100">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="btn-3d"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="btn-3d"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass-card rounded-2xl p-12 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No services found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
              <Button onClick={() => {
                setSearchQuery('');
                setCategory('');
                setPriceRange('');
              }} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d">
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {services.map((service: any, index) => (
              <Card 
                key={service._id} 
                className="group card-3d hover:shadow-3d transition-all duration-500 cursor-pointer transform-3d glass-card border-gray-200 overflow-hidden"
                onClick={() => navigate(`/services/${service._id}`)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  ['--stagger' as any]: index
                }}
              >
                <div className="relative">
                  {service.images && service.images.length > 0 && (
                    <div className="h-48 overflow-hidden rounded-t-xl">
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      {service.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 group-hover:text-glow transition-all duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {service.freelancer?.firstName?.[0] || 'F'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {service.freelancer?.firstName} {service.freelancer?.lastName}
                        </p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">
                            {service.rating || 5.0} ({service.reviewCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.deliveryTime} days
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Starting at</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(service.pricing?.basic?.price || service.basePrice)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
