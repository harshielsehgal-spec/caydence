import { useState, useRef, useEffect } from "react";
import { Star, MapPin, Video, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div 
        className="w-full h-full rounded-2xl overflow-hidden flex flex-col border-3 transition-smooth hover:border-vibrantOrange hover:shadow-orange-glow"
        style={{
          backgroundColor: '#181818',
          borderColor: 'rgba(255, 107, 0, 0.3)',
        }}
      >
        {/* AI Verified Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white text-charcoal px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold text-xs shadow-orange-glow">
            <CheckCircle className="h-3.5 w-3.5 text-vibrantOrange" />
            AI Verified
          </div>
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
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Section Divider */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-vibrantOrange to-transparent -mt-3"></div>
          
          <div>
            <h2 className="text-2xl font-bold font-heading mb-1" style={{ color: '#F2F2F2' }}>
              {coach.name}
            </h2>
            <p className="text-sm font-body" style={{ color: '#BFBFBF' }}>{coach.specialization}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center bg-charcoal/50 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 mr-1" style={{ fill: '#FFB800', color: '#FFB800' }} />
              <span className="font-semibold" style={{ color: '#F2F2F2' }}>{coach.rating}</span>
            </div>
            <div className="flex items-center" style={{ color: '#BFBFBF' }}>
              <MapPin className="h-4 w-4 mr-1 text-vibrantOrange" />
              {coach.city}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-vibrantOrange/20 text-vibrantOrange px-3 py-1 rounded-lg text-xs font-semibold border border-vibrantOrange/40">
              {coach.sport}
            </div>
            <div className="bg-charcoal/60 text-white px-3 py-1 rounded-lg text-xs font-semibold border border-white/20 flex items-center gap-1">
              {getModeIcon()}
              <span>{coach.mode}</span>
            </div>
            <div className="bg-charcoal/60 text-white px-3 py-1 rounded-lg text-xs font-semibold border border-white/20">
              {coach.experience}
            </div>
          </div>

          <p className="text-sm font-body line-clamp-2" style={{ color: '#BFBFBF' }}>
            {coach.bio}
          </p>

          <div className="pt-3 border-t-2 border-vibrantOrange/30">
            <div className="text-3xl font-bold text-vibrantOrange font-heading flex items-baseline gap-2">
              ₹{coach.price}
              <span className="text-sm font-normal" style={{ color: '#BFBFBF' }}>/session</span>
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
