import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Sparkles } from "lucide-react";
import { DrillSuggestionsModal } from "./DrillSuggestionsModal";
import { MessageTemplateModal } from "./MessageTemplateModal";

// Mock athlete data with metrics
const mockAthletes = [
  {
    id: "A01",
    name: "Riya Patel",
    sport: "Football",
    avatar: null,
    metrics: { balance: 62, posture: 71, cadence: 74, symmetry: 66 },
    deltas: { balance: -9, posture: 3, cadence: 2, symmetry: -2 },
    lastActiveDays: 8,
    upcomingSession: true,
  },
  {
    id: "A02",
    name: "Aditya Mehra",
    sport: "Cricket",
    avatar: null,
    metrics: { balance: 78, posture: 65, cadence: 70, symmetry: 72 },
    deltas: { balance: -3, posture: -6, cadence: 1, symmetry: 4 },
    lastActiveDays: 2,
    upcomingSession: false,
  },
  {
    id: "A03",
    name: "Priya Singh",
    sport: "Basketball",
    avatar: null,
    metrics: { balance: 55, posture: 68, cadence: 72, symmetry: 58 },
    deltas: { balance: -5, posture: -8, cadence: -1, symmetry: -4 },
    lastActiveDays: 3,
    upcomingSession: true,
  },
  {
    id: "A04",
    name: "Rahul Verma",
    sport: "Tennis",
    avatar: null,
    metrics: { balance: 82, posture: 59, cadence: 76, symmetry: 80 },
    deltas: { balance: 2, posture: -12, cadence: 3, symmetry: 1 },
    lastActiveDays: 12,
    upcomingSession: false,
  },
  {
    id: "A05",
    name: "Sneha Kapoor",
    sport: "Badminton",
    avatar: null,
    metrics: { balance: 70, posture: 75, cadence: 68, symmetry: 71 },
    deltas: { balance: -1, posture: 2, cadence: -3, symmetry: 0 },
    lastActiveDays: 1,
    upcomingSession: false,
  },
];

// Priority scoring logic
const calculatePriorityScore = (athlete: typeof mockAthletes[0]) => {
  const minDelta = Math.min(...Object.values(athlete.deltas));
  const minMetric = Math.min(...Object.values(athlete.metrics));
  
  let score = 0;
  score += athlete.upcomingSession ? 30 : 0;
  score += Math.max(0, -minDelta) * 2;
  score += athlete.lastActiveDays >= 7 ? 15 : 0;
  score += minMetric < 60 ? 10 : 0;
  
  return score;
};

// Get reason badges
const getReasonBadges = (athlete: typeof mockAthletes[0]) => {
  const badges: { text: string; variant: "default" | "destructive" | "secondary" }[] = [];
  
  if (athlete.upcomingSession) {
    badges.push({ text: "Session Today", variant: "default" });
  }
  
  Object.entries(athlete.deltas).forEach(([key, value]) => {
    if (value <= -8) {
      badges.push({ 
        text: `Drop in ${key.charAt(0).toUpperCase() + key.slice(1)} (${value}%)`, 
        variant: "destructive" 
      });
    }
  });
  
  if (athlete.lastActiveDays >= 7) {
    badges.push({ text: `Inactivity ${athlete.lastActiveDays}d`, variant: "secondary" });
  }
  
  const minMetric = Math.min(...Object.values(athlete.metrics));
  if (minMetric < 60) {
    const metricName = Object.entries(athlete.metrics).find(([_, v]) => v === minMetric)?.[0];
    badges.push({ 
      text: `Low ${metricName?.charAt(0).toUpperCase()}${metricName?.slice(1)} (<60)`, 
      variant: "destructive" 
    });
  }
  
  return badges;
};

// Get weakest metric
const getWeakestMetric = (athlete: typeof mockAthletes[0]) => {
  const minMetric = Math.min(...Object.values(athlete.metrics));
  return Object.entries(athlete.metrics).find(([_, v]) => v === minMetric)?.[0] || "balance";
};

export const CoachAICoPilot = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<typeof mockAthletes[0] | null>(null);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Sort athletes by priority
  const prioritizedAthletes = [...mockAthletes]
    .sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a))
    .slice(0, 6);

  const handleSuggestDrills = (athlete: typeof mockAthletes[0]) => {
    setSelectedAthlete(athlete);
    setShowDrillModal(true);
  };

  const handleMessage = (athlete: typeof mockAthletes[0]) => {
    setSelectedAthlete(athlete);
    setShowMessageModal(true);
  };

  return (
    <>
      <Card className="bg-charcoal/80 border-vibrantOrange/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-vibrantOrange" />
            <div>
              <CardTitle className="text-white font-heading">AI Co-Pilot</CardTitle>
              <p className="text-coolGray text-sm mt-1">
                Smart priorities based on performance trends and activity
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prioritizedAthletes.map((athlete) => {
              const badges = getReasonBadges(athlete);
              const initials = athlete.name.split(' ').map(n => n[0]).join('');
              
              return (
                <div
                  key={athlete.id}
                  className="flex flex-col justify-between gap-3 p-4 rounded-xl bg-charcoal/40 border border-border hover:border-vibrantOrange/30 transition-smooth min-h-[110px] max-w-full overflow-hidden box-border"
                >
                  {/* Top: Avatar & Info */}
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={athlete.avatar || undefined} />
                      <AvatarFallback className="bg-vibrantOrange/20 text-vibrantOrange">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{athlete.name}</p>
                      <p className="text-coolGray text-sm">{athlete.sport}</p>
                    </div>
                  </div>

                  {/* Middle: Badges */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {badges.map((badge, idx) => (
                      <Badge
                        key={idx}
                        variant={badge.variant}
                        className="text-xs"
                      >
                        {badge.text}
                      </Badge>
                    ))}
                  </div>

                  {/* Bottom: Stats + Action Buttons */}
                  <div className="flex items-center justify-between gap-3 flex-nowrap">
                    {/* Stats */}
                    <div className="flex gap-3 items-center flex-shrink-0">
                      {Object.entries(athlete.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className={`text-xs font-semibold ${value < 60 ? 'text-red-400' : 'text-white'}`}>
                            {value}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {key.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 shrink-0 flex-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuggestDrills(athlete)}
                        className="hover:border-vibrantOrange hover:text-vibrantOrange whitespace-nowrap"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Suggest Drills
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessage(athlete)}
                        className="hover:border-vibrantOrange hover:text-vibrantOrange whitespace-nowrap"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedAthlete && (
        <>
          <DrillSuggestionsModal
            open={showDrillModal}
            onOpenChange={setShowDrillModal}
            athlete={selectedAthlete}
            weakestMetric={getWeakestMetric(selectedAthlete)}
          />
          <MessageTemplateModal
            open={showMessageModal}
            onOpenChange={setShowMessageModal}
            athlete={selectedAthlete}
            badges={getReasonBadges(selectedAthlete)}
          />
        </>
      )}
    </>
  );
};
