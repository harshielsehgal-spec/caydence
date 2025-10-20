import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SportCard from "@/components/SportCard";
import { 
  CircleDot, 
  Dumbbell, 
  Heart, 
  Trophy, 
  Zap,
  Activity
} from "lucide-react";

const sports = [
  { 
    name: "Cricket", 
    icon: CircleDot, 
    description: "Track motion, fix form",
    gradient: "from-green-500 to-emerald-600"
  },
  { 
    name: "Football", 
    icon: CircleDot, 
    description: "Improve technique & speed",
    gradient: "from-blue-500 to-cyan-600"
  },
  { 
    name: "Basketball", 
    icon: Trophy, 
    description: "Perfect your shot",
    gradient: "from-orange-500 to-red-600"
  },
  { 
    name: "Fitness", 
    icon: Dumbbell, 
    description: "Build strength & endurance",
    gradient: "from-purple-500 to-pink-600"
  },
  { 
    name: "Yoga", 
    icon: Heart, 
    description: "Master poses & balance",
    gradient: "from-teal-500 to-green-600"
  },
  { 
    name: "Boxing", 
    icon: Zap, 
    description: "Refine striking technique",
    gradient: "from-red-500 to-rose-600"
  },
  { 
    name: "Tennis", 
    icon: Activity, 
    description: "Enhance serve & footwork",
    gradient: "from-yellow-500 to-orange-600"
  },
  { 
    name: "Running", 
    icon: Activity, 
    description: "Optimize cadence & stride",
    gradient: "from-indigo-500 to-blue-600"
  },
];

const SportSelection = () => {
  const navigate = useNavigate();

  const handleSportSelect = (sport: string) => {
    navigate("/skill-mode", { state: { sport } });
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">
            Choose Your Sport
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            Select the sport you want to train in
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sports.map((sport, index) => (
            <div
              key={sport.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SportCard
                name={sport.name}
                icon={sport.icon}
                description={sport.description}
                gradient={sport.gradient}
                onClick={() => handleSportSelect(sport.name)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="font-poppins"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SportSelection;
