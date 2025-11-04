import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { toast } from "sonner";

// Drill library
const drillLibrary = {
  balance: [
    { 
      id: "bal12", 
      title: "Balance Builder", 
      duration: 12, 
      improvement: "Improve balance by 8-12% in 2 weeks",
      description: "Single-leg stance exercises with progressive difficulty"
    },
    { 
      id: "bal15", 
      title: "Core Stability Flow", 
      duration: 15, 
      improvement: "Strengthen core for better balance control",
      description: "Dynamic core exercises focusing on stability"
    },
    { 
      id: "bal10", 
      title: "Balance Board Routine", 
      duration: 10, 
      improvement: "Enhance proprioception and balance",
      description: "Balance board exercises with varied intensity"
    },
  ],
  posture: [
    { 
      id: "pos8", 
      title: "Posture Reset", 
      duration: 8, 
      improvement: "Correct posture alignment by 10-15%",
      description: "Targeted stretches and alignment exercises"
    },
    { 
      id: "pos12", 
      title: "Upper Body Alignment", 
      duration: 12, 
      improvement: "Strengthen postural muscles",
      description: "Focus on shoulders, back, and neck positioning"
    },
    { 
      id: "pos10", 
      title: "Dynamic Posture Practice", 
      duration: 10, 
      improvement: "Maintain posture during movement",
      description: "Posture awareness during dynamic movements"
    },
  ],
  cadence: [
    { 
      id: "cad10", 
      title: "Cadence Control", 
      duration: 10, 
      improvement: "Optimize movement rhythm by 5-8%",
      description: "Metronome-based timing exercises"
    },
    { 
      id: "cad14", 
      title: "Rhythm & Timing", 
      duration: 14, 
      improvement: "Develop consistent movement patterns",
      description: "Pattern-based cadence training"
    },
    { 
      id: "cad8", 
      title: "Speed Ladder Drills", 
      duration: 8, 
      improvement: "Improve foot speed and cadence",
      description: "Agility ladder with varied patterns"
    },
  ],
  symmetry: [
    { 
      id: "sym9", 
      title: "Left–Right Sync", 
      duration: 9, 
      improvement: "Balance left-right differences by 10%",
      description: "Unilateral exercises for symmetry"
    },
    { 
      id: "sym13", 
      title: "Bilateral Balance", 
      duration: 13, 
      improvement: "Equalize strength and coordination",
      description: "Side-to-side comparison exercises"
    },
    { 
      id: "sym11", 
      title: "Mirror Movement Drills", 
      duration: 11, 
      improvement: "Improve movement symmetry",
      description: "Mirror exercises focusing on both sides"
    },
  ],
};

interface DrillSuggestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  athlete: {
    id: string;
    name: string;
    sport: string;
  };
  weakestMetric: string;
}

export const DrillSuggestionsModal = ({ 
  open, 
  onOpenChange, 
  athlete,
  weakestMetric 
}: DrillSuggestionsModalProps) => {
  const [assignedDrills, setAssignedDrills] = useState<Set<string>>(new Set());
  
  const drills = drillLibrary[weakestMetric as keyof typeof drillLibrary] || drillLibrary.balance;

  const handleAssign = (drillId: string, drillTitle: string) => {
    // Store assignment (mock)
    const assignment = {
      athleteId: athlete.id,
      date: new Date().toISOString(),
      drillId,
      drillTitle,
    };
    
    // Add note (mock)
    const note = {
      athleteId: athlete.id,
      date: new Date().toISOString(),
      note: `Assigned ${drillTitle} to improve ${weakestMetric}.`,
    };
    
    // Store in localStorage for persistence
    const existingAssignments = JSON.parse(localStorage.getItem("assignedDrills") || "[]");
    const existingNotes = JSON.parse(localStorage.getItem("coachNotes") || "[]");
    
    localStorage.setItem("assignedDrills", JSON.stringify([...existingAssignments, assignment]));
    localStorage.setItem("coachNotes", JSON.stringify([...existingNotes, note]));
    
    setAssignedDrills(prev => new Set(prev).add(drillId));
    toast.success(`${drillTitle} assigned to ${athlete.name} for this week`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-charcoal border-vibrantOrange/30">
        <DialogHeader>
          <DialogTitle className="text-white font-heading text-2xl">
            Drill Suggestions for {athlete.name}
          </DialogTitle>
          <DialogDescription className="text-coolGray">
            AI-recommended drills to improve <span className="text-vibrantOrange font-medium">{weakestMetric}</span> performance
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {drills.map((drill) => {
            const isAssigned = assignedDrills.has(drill.id);
            
            return (
              <Card 
                key={drill.id}
                className="bg-charcoal/60 border-border hover:border-vibrantOrange/50 transition-smooth"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-white text-base font-heading">
                      {drill.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-coolGray border-border">
                      <Clock className="h-3 w-3 mr-1" />
                      {drill.duration}m
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    {drill.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-md bg-vibrantOrange/10 border border-vibrantOrange/30">
                    <p className="text-xs text-vibrantOrange font-medium">
                      Expected: {drill.improvement}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isAssigned ? "outline" : "default"}
                    onClick={() => handleAssign(drill.id, drill.title)}
                    disabled={isAssigned}
                    className="w-full"
                  >
                    {isAssigned ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Assigned
                      </>
                    ) : (
                      "Assign Drill"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
