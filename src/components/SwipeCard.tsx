import { useState, useRef, useEffect } from "react";
import { Star, MapPin, Video, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  bio: string;
}

interface SwipeCardProps {
  coach: Coach;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  style?: React.CSSProperties;
}

const SwipeCard = ({ coach, onSwipeLeft, onSwipeRight, onSwipeUp, style }: SwipeCardProps) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    setOffsetX(deltaX);
    setOffsetY(deltaY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Swipe thresholds
    if (Math.abs(offsetX) > 120) {
      if (offsetX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else if (offsetY < -120) {
      onSwipeUp();
    }

    setOffsetX(0);
    setOffsetY(0);
  };

  const rotation = offsetX / 20;
  const opacity = 1 - Math.abs(offsetX) / 300;

  const getModeIcon = () => {
    if (coach.mode.toLowerCase().includes("online")) return <Video className="h-3 w-3" />;
    if (coach.mode.toLowerCase().includes("offline")) return <Users className="h-3 w-3" />;
    return <Video className="h-3 w-3" />;
  };

  return (
    <div
      ref={cardRef}
      className="absolute inset-4 md:inset-8 select-none touch-none cursor-grab active:cursor-grabbing"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
        opacity: opacity,
        transition: isDragging ? "none" : "all 0.3s ease-out",
        ...style,
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="w-full h-full bg-card rounded-[16px] shadow-card overflow-hidden flex flex-col">
        {/* AI Verified Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-crimson text-white font-semibold">
            <CheckCircle className="h-3 w-3 mr-1" />
            AI Verified
          </Badge>
        </div>

        {/* Coach Photo */}
        <div className="relative h-[55%] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <img 
            src={coach.image} 
            alt={coach.name}
            className="w-full h-full object-cover"
            draggable="false"
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal/90 to-transparent" />
        </div>

        {/* Coach Info */}
        <div className="flex-1 p-6 space-y-3 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold font-poppins mb-1">{coach.name}</h2>
            <p className="text-sm text-muted-foreground font-montserrat">{coach.specialization}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{coach.rating}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {coach.city}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="font-montserrat">
              {coach.sport}
            </Badge>
            <Badge variant="outline" className="font-montserrat">
              {getModeIcon()}
              <span className="ml-1">{coach.mode}</span>
            </Badge>
            <Badge variant="outline" className="font-montserrat">
              {coach.experience}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground font-montserrat line-clamp-2">
            {coach.bio}
          </p>

          <div className="pt-2 border-t">
            <div className="text-2xl font-bold text-crimson font-poppins">
              ₹{coach.price}
              <span className="text-sm font-normal text-muted-foreground">/session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      {offsetX > 50 && (
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-6xl opacity-70">
          ❤️
        </div>
      )}
      {offsetX < -50 && (
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-6xl opacity-70">
          👎
        </div>
      )}
      {offsetY < -50 && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-6xl opacity-70">
          👀
        </div>
      )}
    </div>
  );
};

export default SwipeCard;
