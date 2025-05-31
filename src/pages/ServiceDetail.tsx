
import { useState } from "react";
import { ArrowLeft, Star, Heart, Clock, CheckCircle, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [selectedPlan, setSelectedPlan] = useState('basic');

  // In a real app, this would be fetched from the API
  const service = {
    id: serviceId,
    title: "I will create a professional logo design for your business",
    freelancer: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviews: 127,
      level: "Top Rated",
      memberSince: "2020",
      responseTime: "1 hour",
      isOnline: true
    },
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    video: "/placeholder.mp4",
    description: "I will create a stunning, professional logo that perfectly represents your brand identity. With over 5 years of experience in graphic design, I understand what makes a logo memorable and effective.",
    category: "Design",
    tags: ["logo", "branding", "graphic-design"],
    rating: 4.9,
    reviews: 234,
    totalOrders: 1500,
    pricingPlans: {
      basic: {
        title: "Basic Logo",
        price: 2500,
        deliveryDays: 3,
        revisions: 2,
        features: [
          "1 Logo concept",
          "High-resolution files",
          "Vector files (AI, EPS)",
          "Commercial use rights"
        ]
      },
      standard: {
        title: "Standard Package",
        price: 4500,
        deliveryDays: 5,
        revisions: 5,
        features: [
          "3 Logo concepts",
          "High-resolution files",
          "Vector files (AI, EPS)",
          "Source files",
          "Social media kit",
          "Commercial use rights"
        ]
      },
      premium: {
        title: "Premium Package",
        price: 7500,
        deliveryDays: 7,
        revisions: 10,
        features: [
          "5 Logo concepts",
          "High-resolution files",
          "Vector files (AI, EPS)",
          "Source files",
          "Complete brand kit",
          "Business card design",
          "Social media kit",
          "Commercial use rights"
        ]
      }
    },
    faqs: [
      {
        question: "What file formats will I receive?",
        answer: "You'll receive your logo in multiple formats including PNG, JPG, PDF, AI, and EPS files."
      },
      {
        question: "How many revisions are included?",
        answer: "The number of revisions depends on the package you choose. Basic includes 2, Standard includes 5, and Premium includes 10 revisions."
      }
    ]
  };

  const reviews = [
    {
      client: "Rahul Kumar",
      rating: 5,
      comment: "Excellent work! Priya understood my requirements perfectly and delivered beyond expectations.",
      date: "2 weeks ago"
    },
    {
      client: "Sarah Johnson",
      rating: 5,
      comment: "Professional, fast, and high-quality work. Highly recommended!",
      date: "1 month ago"
    }
  ];

  const currentPlan = service.pricingPlans[selectedPlan as keyof typeof service.pricingPlans];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/services')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Images */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={service.images[0]} 
                alt={service.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{service.category}</Badge>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-gray-500">({service.reviews} reviews)</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{service.totalOrders} orders completed</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Freelancer Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={service.freelancer.avatar}
                      alt={service.freelancer.name}
                      className="w-16 h-16 rounded-full"
                    />
                    {service.freelancer.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.freelancer.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="secondary">{service.freelancer.level}</Badge>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span>{service.freelancer.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{service.freelancer.reviews} reviews</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Member since {service.freelancer.memberSince}</span>
                      <span>•</span>
                      <span>Responds within {service.freelancer.responseTime}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for additional content */}
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList>
                <TabsTrigger value="reviews">Reviews ({service.reviews})</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.client}</span>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="faq" className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-gray-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Package Selection */}
                  <div className="flex space-x-2">
                    {Object.entries(service.pricingPlans).map(([key, plan]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPlan(key)}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                          selectedPlan === key 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {plan.title}
                      </button>
                    ))}
                  </div>

                  {/* Selected Package Details */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">{currentPlan.title}</h3>
                      <span className="text-2xl font-bold">₹{currentPlan.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{currentPlan.deliveryDays} days delivery</span>
                      </div>
                      <span>•</span>
                      <span>{currentPlan.revisions} revisions</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                      Continue (₹{currentPlan.price.toLocaleString()})
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
