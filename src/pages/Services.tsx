import { useState } from "react";
import { Search, Star, Heart, MapPin, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/currency";

const Services = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const services = [
    {
      id: "1",
      title: "Build a responsive website with React",
      thumbnail: "/mock-service-image.webp",
      startingPrice: 50,
      rating: 4.8,
      reviews: 62,
      category: "Web Development",
      freelancer: {
        name: "John Doe",
        avatar: "/avatar-1.png",
        level: 2,
        location: "Bangalore, India"
      }
    },
    {
      id: "2",
      title: "Design a stunning logo for your brand",
      thumbnail: "/mock-service-image-2.webp",
      startingPrice: 30,
      rating: 4.9,
      reviews: 125,
      category: "Graphic Design",
      freelancer: {
        name: "Alice Smith",
        avatar: "/avatar-2.png",
        level: 3,
        location: "Mumbai, India"
      }
    },
    {
      id: "3",
      title: "Manage your social media marketing",
      thumbnail: "/mock-service-image-3.webp",
      startingPrice: 40,
      rating: 4.7,
      reviews: 88,
      category: "Digital Marketing",
      freelancer: {
        name: "Bob Johnson",
        avatar: "/avatar-3.png",
        level: 1,
        location: "Delhi, India"
      }
    },
    {
      id: "4",
      title: "Write engaging blog posts for your website",
      thumbnail: "/mock-service-image-4.webp",
      startingPrice: 25,
      rating: 4.6,
      reviews: 45,
      category: "Writing & Translation",
      freelancer: {
        name: "Priya Sharma",
        avatar: "/avatar-4.png",
        level: 2,
        location: "Chennai, India"
      }
    },
    {
      id: "5",
      title: "Create a professional explainer video",
      thumbnail: "/mock-service-image-5.webp",
      startingPrice: 60,
      rating: 4.9,
      reviews: 150,
      category: "Video & Animation",
      freelancer: {
        name: "Rajesh Kumar",
        avatar: "/avatar-5.png",
        level: 3,
        location: "Kolkata, India"
      }
    },
    {
      id: "6",
      title: "Produce a catchy jingle for your business",
      thumbnail: "/mock-service-image-6.webp",
      startingPrice: 35,
      rating: 4.5,
      reviews: 32,
      category: "Music & Audio",
      freelancer: {
        name: "Neha Patel",
        avatar: "/avatar-6.png",
        level: 1,
        location: "Hyderabad, India"
      }
    }
  ];

  const categories = [
    "Web Development",
    "Graphic Design",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  const handleCategoryFilterChange = (category: string) => {
    if (categoryFilters.includes(category)) {
      setCategoryFilters(categoryFilters.filter((c) => c !== category));
    } else {
      setCategoryFilters([...categoryFilters, category]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Servpe
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/services" className="text-gray-700 hover:text-gray-900">Browse Services</a>
              <a href="/create-project" className="text-gray-700 hover:text-gray-900">Post Project</a>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Get Started
              </Button>
            </div>
            
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find the perfect service for your needs
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse a wide range of services offered by talented freelancers.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search for services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button type="submit" className="ml-2 h-12 px-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              {/* Price Range */}
              <div className="mb-6">
                <Label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    id="min-price"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    id="max-price"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  max={10000}
                  step={100}
                  onValueChange={(value) => {
                    setMinPrice(value[0]);
                    setMaxPrice(value[1]);
                  }}
                  className="mt-4"
                />
              </div>

              {/* Categories */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={categoryFilters.includes(category)}
                        onCheckedChange={() => handleCategoryFilterChange(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="ml-2 text-sm font-medium text-gray-900">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            {/* Search and Sort Controls */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {searchQuery ? `Results for "${searchQuery}"` : "All Services"}
              </h2>
              <div className="flex items-center gap-4">
                <Label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
                  Sort by:
                </Label>
                <div className="relative">
                  <select
                    id="sort-by"
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                Loading services...
              </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/services/${service.id}`)}>
                  <div className="aspect-video relative">
                    <img 
                      src={service.thumbnail || "/placeholder.svg"} 
                      alt={service.title}
                      className="w-full h-full object-cover rounded-t-lg"
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
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={service.freelancer?.avatar || "/placeholder.svg"} 
                        alt={service.freelancer?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{service.freelancer?.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Level {service.freelancer?.level || 1}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{service.title}</h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{service.rating || 4.9}</span>
                      <span className="text-sm text-gray-500">({service.reviews || 125})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {service.freelancer?.location || 'India'}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Starting at</div>
                        <div className="font-semibold text-lg">
                          {formatCurrency(service.startingPrice * 83)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button className="ml-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
