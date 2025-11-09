import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Star, MapPin, Video, Users } from "lucide-react";

interface Coach {
  id: number;
  name: string;
  sport: string;
  sportTag: string;
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
    if (coach.mode.toLowerCase().includes("online") && coach.mode.toLowerCase().includes("offline")) {
      return <Video className="h-3 w-3" />;
    }
    if (coach.mode.toLowerCase().includes("online")) {
      return <Video className="h-3 w-3" />;
    }
    return <Users className="h-3 w-3" />;
  };

  const getSportIcon = () => {
    switch (coach.sportTag) {
      case "football": return "⚽";
      case "cricket": return "🏏";
      case "basketball": return "🏀";
      case "tennis": return "🎾";
      case "badminton": return "🏸";
      default: return "🏅";
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-smooth group overflow-hidden"
          onClick={onClick}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={coach.image} alt={coach.name} />
                <AvatarFallback>{coach.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-base font-poppins truncate">
                    {coach.name}
                  </h3>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {getSportIcon()} {coach.sport}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 font-montserrat truncate">
                  {coach.specialization}
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-montserrat">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="font-medium">{coach.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{coach.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getModeIcon()}
                    <span className="capitalize">{coach.mode}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-montserrat">
                {coach.experience} experience
              </div>
              <div className="font-semibold text-lg text-primary font-poppins">
                ₹{coach.price}/hr
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold font-poppins">Specializes in:</h4>
          <p className="text-sm text-muted-foreground font-montserrat">
            {coach.specialization}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CoachCard;
