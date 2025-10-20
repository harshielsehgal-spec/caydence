import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Video, Users } from "lucide-react";

interface Coach {
  id: number;
  name: string;
  sport: string;
  rating: number;
  price: number;
  city: string;
  mode: string;
  image: string;
  experience: string;
  specialization: string;
}

interface CoachCardProps {
  coach: Coach;
  onClick: () => void;
}

const CoachCard = ({ coach, onClick }: CoachCardProps) => {
  const getModeIcon = () => {
    if (coach.mode.toLowerCase().includes("online")) return <Video className="h-3 w-3" />;
    if (coach.mode.toLowerCase().includes("offline")) return <Users className="h-3 w-3" />;
    return <Video className="h-3 w-3" />;
  };

  return (
    <Card 
      className="cursor-pointer transition-smooth hover:shadow-card-hover group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        <img 
          src={coach.image} 
          alt={coach.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-charcoal font-semibold">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {coach.rating}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-lg font-poppins mb-1">{coach.name}</h3>
          <p className="text-sm text-muted-foreground font-montserrat">{coach.specialization}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-montserrat">
            {coach.sport}
          </Badge>
          <Badge variant="outline" className="font-montserrat">
            {getModeIcon()}
            <span className="ml-1">{coach.mode}</span>
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {coach.city}
          </div>
          <div className="text-lg font-bold text-primary font-poppins">
            ₹{coach.price}
            <span className="text-sm font-normal text-muted-foreground">/session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
