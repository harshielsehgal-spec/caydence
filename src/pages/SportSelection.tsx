import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SportCard from "@/components/SportCard";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CircleDot, 
  Dumbbell, 
  Heart, 
  Trophy, 
  Zap,
  Activity,
  ArrowLeft,
  Users,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

type FitnessStep = "none" | "choose" | "drills";

const drills = [
  { name: "Pushup", icon: Target, gradient: "from-purple-500 to-pink-600" },
  { name: "Bicep", icon: Dumbbell, gradient: "from-indigo-500 to-purple-600" },
  { name: "Squat", icon: Activity, gradient: "from-rose-500 to-red-600" },
];

const SportSelection = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("athlete");
  const [hasSavedSport, setHasSavedSport] = useState(false);
  const [fitnessStep, setFitnessStep] = useState<FitnessStep>("none");

  useEffect(() => {
    const storedSport = localStorage.getItem("cadenceActiveSport");
    if (storedSport) {
      setSelectedSport(storedSport);
      setHasSavedSport(true);
    }
    const role = localStorage.getItem("currentRole") || "athlete";
    setCurrentRole(role);
  }, []);

  const clearFitnessKeys = () => {
    localStorage.removeItem("fitnessPath");
    localStorage.removeItem("selectedDrill");
  };

  const handleSportSelect = async (sport: string) => {
    // Clear fitness-specific keys when picking any sport
    clearFitnessKeys();

    if (sport === "Fitness") {
      localStorage.setItem("cadenceActiveSport", sport);
      setSelectedSport(sport);
      setFitnessStep("choose");
      return;
    }

    localStorage.setItem("cadenceActiveSport", sport);
    setSelectedSport(sport);

    if (currentRole === "coach") {
      navigate("/coach/home");
    } else {
      navigate("/skill-mode", { state: { sport } });
    }
  };

  const handleFitnessCoaches = () => {
    localStorage.setItem("fitnessPath", "coaches");
    if (currentRole === "coach") {
      navigate("/coach/home");
    } else {
      navigate("/skill-mode", { state: { sport: "Fitness" } });
    }
  };

  const handleFitnessDrills = () => {
    localStorage.setItem("fitnessPath", "drills");
    setFitnessStep("drills");
  };

  const handleDrillSelect = (drill: string) => {
    localStorage.setItem("selectedDrill", drill.toLowerCase());
    navigate(`/skill-mode?sport=fitness&mode=drills&drill=${drill.toLowerCase()}`, {
      state: { sport: "Fitness", mode: "drills", drill: drill.toLowerCase() },
    });
  };

  const handleFitnessBack = () => {
    if (fitnessStep === "drills") {
      setFitnessStep("choose");
    } else {
      setFitnessStep("none");
    }
  };

  // Fitness sub-step: Drills vs Coaches
  if (fitnessStep === "choose") {
    return (
      <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleFitnessBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">Fitness</h1>
            <p className="text-lg text-muted-foreground font-montserrat">
              How do you want to train?
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Card
              className="cursor-pointer transition-smooth hover:shadow-card-hover group"
              onClick={handleFitnessDrills}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg font-poppins">Drills</h3>
                <p className="text-sm text-muted-foreground font-montserrat">Self-guided workouts</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer transition-smooth hover:shadow-card-hover group"
              onClick={handleFitnessCoaches}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg font-poppins">Coaches</h3>
                <p className="text-sm text-muted-foreground font-montserrat">Find a fitness coach</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Fitness sub-step: Drill selection
  if (fitnessStep === "drills") {
    return (
      <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleFitnessBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">Choose a Drill</h1>
            <p className="text-lg text-muted-foreground font-montserrat">
              Select a drill to start training
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {drills.map((drill) => (
              <Card
                key={drill.name}
                className="cursor-pointer transition-smooth hover:shadow-card-hover group"
                onClick={() => handleDrillSelect(drill.name)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${drill.gradient} flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card`}>
                    <drill.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg font-poppins">{drill.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">
            Choose Your Sport
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            {selectedSport 
              ? "Select your sport to continue training — or head straight to your dashboard."
              : "Select the sport you want to train in"
            }
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sports.map((sport, index) => (
            <div
              key={sport.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`relative ${selectedSport === sport.name ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl' : ''}`}>
                <SportCard
                  name={sport.name}
                  icon={sport.icon}
                  description={sport.description}
                  gradient={sport.gradient}
                  onClick={() => handleSportSelect(sport.name)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          {selectedSport && currentRole === "athlete" && (
            <Button
              onClick={() => navigate("/skill-mode", { state: { sport: selectedSport } })}
              className="font-poppins font-semibold px-8 py-6 text-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-xl shadow-lg hover:shadow-[0_0_12px_rgba(255,107,0,0.6)] transition-all"
            >
              Continue with {selectedSport}
            </Button>
          )}
          
          {hasSavedSport && currentRole === "athlete" && (
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="font-poppins font-semibold px-8 py-6 text-lg border-2 border-[#FF6B00] text-white hover:bg-[#FF6B00]/10 hover:shadow-[0_0_12px_rgba(255,107,0,0.4)] transition-all"
            >
              Go to Dashboard
            </Button>
          )}
          
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
