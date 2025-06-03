
import { Star, MapPin, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FreelancerCardProps {
  freelancer: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    skills: Array<{ name: string; level: string }>;
    hourlyRate: number;
    rating: { average: number; count: number };
    location: { country: string; city: string };
    bio: string;
    portfolio: Array<{ title: string; imageUrl: string }>;
  };
  onShowInterest: (freelancerId: string) => void;
}

const FreelancerCard = ({ freelancer, onShowInterest }: FreelancerCardProps) => {
  const { toast } = useToast();

  const handleShowInterest = () => {
    onShowInterest(freelancer.id);
    toast({
      title: "Interest Shown",
      description: `${freelancer.firstName} will be notified of your interest!`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {freelancer.firstName[0]}{freelancer.lastName[0]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {freelancer.firstName} {freelancer.lastName}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{freelancer.rating.average} ({freelancer.rating.count} reviews)</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{freelancer.location.city}, {freelancer.location.country}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">${freelancer.hourlyRate}/hr</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {freelancer.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {freelancer.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {freelancer.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{freelancer.skills.length - 4} more
            </Badge>
          )}
        </div>

        {freelancer.portfolio.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {freelancer.portfolio.slice(0, 3).map((item, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl || "/placeholder.svg"} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(`/messages?freelancer=${freelancer.id}`, '_blank')}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleShowInterest}
          >
            <Heart className="h-4 w-4 mr-1" />
            Show Interest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerCard;
