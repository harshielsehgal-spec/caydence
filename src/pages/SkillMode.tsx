import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const SkillMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sport = location.state?.sport || "Fitness";
  
  const [skill, setSkill] = useState("");
  const [mode, setMode] = useState("");
  const [budget, setBudget] = useState([500]);

  const handleNext = () => {
    navigate("/coach-swipe", { 
      state: { sport, skill, mode, budget: budget[0] } 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
      <Card className="w-full max-w-2xl shadow-card-hover animate-slide-up">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-poppins">
            Customize Your Training
          </CardTitle>
          <CardDescription className="text-base">
            Tell us about your preferences for {sport}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Skill Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold font-poppins">Skill Level</Label>
            <Select onValueChange={setSkill}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Training Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold font-poppins">Training Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={mode === "online" ? "default" : "outline"}
                onClick={() => setMode("online")}
                className="h-12 font-poppins"
              >
                Online
              </Button>
              <Button
                type="button"
                variant={mode === "offline" ? "default" : "outline"}
                onClick={() => setMode("offline")}
                className="h-12 font-poppins"
              >
                Offline
              </Button>
              <Button
                type="button"
                variant={mode === "hybrid" ? "default" : "outline"}
                onClick={() => setMode("hybrid")}
                className="h-12 font-poppins"
              >
                Hybrid
              </Button>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold font-poppins">Budget per Session</Label>
              <span className="text-lg font-semibold text-primary">₹{budget[0]}</span>
            </div>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={200}
              max={2000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹200</span>
              <span>₹2000</span>
            </div>
          </div>

          {/* AI Info */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-center font-montserrat">
              🤖 AI recommends coaches based on your skill level, budget, and location
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 h-12 font-poppins"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!skill || !mode}
              className="flex-1 h-12 font-poppins font-semibold"
            >
              Find Coaches
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillMode;
