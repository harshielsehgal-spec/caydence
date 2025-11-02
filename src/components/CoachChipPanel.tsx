import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CoachSimple = {
  id: number;
  name: string;
  city: string;
  rating: number;
  image: string;
  sport: string;
  price: number;
  mode: string;
};

type CoachChipPanelProps = {
  title: string;
  coaches: CoachSimple[];
  onDragStart: (coach: CoachSimple) => void;
  onDragEnd: () => void;
  onRemove: (id: number) => void;
  onViewProfile: (coach: CoachSimple) => void;
  badgeColor: string;
  onDrop?: (coach: CoachSimple) => void;
  draggedCoach?: CoachSimple | null;
};

const CoachChipPanel = ({
  title,
  coaches,
  onDragStart,
  onDragEnd,
  onRemove,
  onViewProfile,
  badgeColor,
  onDrop,
  draggedCoach,
}: CoachChipPanelProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    if (onDrop && draggedCoach) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDrop && draggedCoach) {
      onDrop(draggedCoach);
    }
  };

  if (coaches.length === 0) return null;

  return (
    <div 
      className="bg-charcoal/95 backdrop-blur-md rounded-2xl p-4 border-2 border-vibrantOrange/20 shadow-orange-glow/10"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold font-heading text-white">{title}</h3>
        <Badge className={badgeColor}>
          {coaches.length}
        </Badge>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-vibrantOrange/30 scrollbar-track-transparent">
        {coaches.map((coach) => (
          <HoverCard key={coach.id} openDelay={200}>
            <HoverCardTrigger asChild>
              <div
                draggable
                onDragStart={() => onDragStart(coach)}
                onDragEnd={onDragEnd}
                className="flex-shrink-0 bg-charcoal/80 border-2 border-white/10 hover:border-vibrantOrange/50 rounded-xl p-3 min-w-[140px] transition-smooth cursor-grab active:cursor-grabbing hover:shadow-orange-glow"
              >
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-vibrantOrange/30"
                  />
                  <div className="text-center w-full">
                    <p className="text-xs font-semibold text-white truncate">{coach.name}</p>
                    <p className="text-xs text-coolGray truncate">{coach.city}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white font-semibold">{coach.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              side="top" 
              className="w-80 bg-charcoal border-2 border-vibrantOrange/30 shadow-orange-glow"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-vibrantOrange/50"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base">{coach.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-coolGray mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span>{coach.rating}</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{coach.city}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-vibrantOrange/20 text-vibrantOrange text-xs">
                        {coach.sport}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-white">
                        {coach.mode}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-vibrantOrange font-bold text-lg">
                  ₹{coach.price}
                  <span className="text-sm text-coolGray font-normal">/session</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onViewProfile(coach)}
                    size="sm"
                    className="flex-1 bg-vibrantOrange hover:bg-vibrantOrange/90 text-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button
                    onClick={() => onRemove(coach.id)}
                    size="sm"
                    variant="outline"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default CoachChipPanel;
