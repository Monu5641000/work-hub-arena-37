
import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Heart, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceAPI } from '@/api/services';
import { formatCurrency } from '@/utils/currency';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, sortBy, searchQuery]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getAllServices({
        category: selectedCategory,
        sort: sortBy,
        search: searchQuery
      });
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const categories = [
    "Web Development",
    "Graphic Design",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio"
  ];

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <header className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find the Perfect Service</h1>
          <p className="text-gray-600">Explore a wide range of services offered by talented freelancers.</p>
        </div>
      </header>

      {/* Search and Filters Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex items-center mb-6">
            <div className="flex rounded-md shadow-sm w-full">
              <Input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
              <Button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest_rated">Highest Rated</SelectItem>
                  <SelectItem value="lowest_rated">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-500">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Card key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge className="mr-2">{service.category}</Badge>
                      {service.is_featured && <Badge className="bg-green-500 text-white">Featured</Badge>}
                    </div>
                    <CardDescription className="text-gray-600 mb-4">{service.short_description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="text-purple-600 font-bold">{formatCurrency(service.price)}</div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-500">{service.rating || 4.5} ({service.review_count || 25})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Heart className="w-4 h-4" />
                        <span>{service.likes || 120}</span>
                        <Eye className="w-4 h-4" />
                        <span>{service.views || 350}</span>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/services/${service.id}`)} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
