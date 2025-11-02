import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PlayCircle, Clock, TrendingUp, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SessionRunner } from "@/components/SessionRunner";
import { useToast } from "@/hooks/use-toast";

interface Drill {
  id: string;
  title: string;
  timeSec?: number;
  reps?: number;
}

interface Playlist {
  id: string;
  focus: string;
  title: string;
  durationMin: number;
  difficulty: string;
  description: string;
  drills: Drill[];
}

const AthletePlaylists = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [completionHistory, setCompletionHistory] = useState<string[]>([]);

  // Read focus from URL or default to "all"
  const activeFocus = searchParams.get("focus") || "all";

  // Mock analysis history to determine recommendations
  const analysisHistory = [
    { date: "2025-10-01", metrics: { balance: 68, posture: 62, cadence: 71, symmetry: 60 } },
    { date: "2025-11-01", metrics: { balance: 76, posture: 66, cadence: 74, symmetry: 65 } },
  ];
  const latestMetrics = analysisHistory[analysisHistory.length - 1].metrics;

  // Full playlists with drills
  const playlists: Playlist[] = [
    {
      id: "bal12",
      focus: "balance",
      title: "Balance Builder",
      durationMin: 12,
      difficulty: "Beginner",
      description: "Build a strong foundation for stability and control",
      drills: [
        { id: "d1", title: "Single-leg stand", timeSec: 60 },
        { id: "d2", title: "Lateral hops", reps: 20 },
        { id: "d3", title: "Heel-to-toe walk", timeSec: 90 },
        { id: "d4", title: "Wobble board hold", timeSec: 45 },
      ],
    },
    {
      id: "pos8",
      focus: "posture",
      title: "Posture Reset",
      durationMin: 8,
      difficulty: "Beginner",
      description: "Improve your alignment and body positioning",
      drills: [
        { id: "p1", title: "Wall angels", reps: 15 },
        { id: "p2", title: "Chin tucks", reps: 20 },
        { id: "p3", title: "Cat-cow stretch", reps: 12 },
      ],
    },
    {
      id: "cad10",
      focus: "cadence",
      title: "Cadence Control",
      durationMin: 10,
      difficulty: "Intermediate",
      description: "Develop consistent rhythm and timing",
      drills: [
        { id: "c1", title: "Metronome running", timeSec: 120 },
        { id: "c2", title: "Speed ladder drills", reps: 10 },
        { id: "c3", title: "Jump rope intervals", timeSec: 90 },
        { id: "c4", title: "High knees", timeSec: 60 },
      ],
    },
    {
      id: "sym9",
      focus: "symmetry",
      title: "Symmetry Drills",
      durationMin: 9,
      difficulty: "Beginner",
      description: "Balance your left and right side movements",
      drills: [
        { id: "s1", title: "Single-arm dumbbell rows", reps: 12 },
        { id: "s2", title: "Single-leg deadlifts", reps: 10 },
        { id: "s3", title: "Split squats", reps: 15 },
      ],
    },
    {
      id: "bal18",
      focus: "balance",
      title: "Advanced Balance",
      durationMin: 18,
      difficulty: "Advanced",
      description: "Challenge your stability with complex movements",
      drills: [
        { id: "ab1", title: "Bosu ball squats", reps: 15 },
        { id: "ab2", title: "Single-leg pistol squats", reps: 8 },
        { id: "ab3", title: "Balance beam walk", timeSec: 120 },
      ],
    },
    {
      id: "pos15",
      focus: "posture",
      title: "Posture Perfection Pro",
      durationMin: 15,
      difficulty: "Intermediate",
      description: "Advanced alignment techniques for better form",
      drills: [
        { id: "pp1", title: "Thoracic extensions", reps: 12 },
        { id: "pp2", title: "Scapular retractions", reps: 20 },
        { id: "pp3", title: "Plank with shoulder taps", timeSec: 60 },
        { id: "pp4", title: "Dead bug variations", reps: 16 },
      ],
    },
  ];

  // Load completion history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("playlistCompletions");
    if (stored) {
      setCompletionHistory(JSON.parse(stored));
    }
  }, []);

  // Calculate recommendations based on lowest scores
  const getRecommendedPlaylists = () => {
    const sortedMetrics = Object.entries(latestMetrics).sort((a, b) => a[1] - b[1]);
    const topThreeFocuses = sortedMetrics.slice(0, 3).map(([key]) => key);
    
    return playlists.filter((p) => topThreeFocuses.includes(p.focus)).slice(0, 3);
  };

  const recommendedPlaylists = getRecommendedPlaylists();

  const filteredPlaylists = activeFocus === "all" 
    ? playlists 
    : playlists.filter((p) => p.focus === activeFocus);

  const getFocusLabel = (focus: string) => {
    return focus.charAt(0).toUpperCase() + focus.slice(1);
  };

  const focusOptions = ["all", "balance", "posture", "cadence", "symmetry"];

  const handleStartSession = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setSessionOpen(true);
  };

  const handleCompleteSession = () => {
    if (!selectedPlaylist) return;
    
    const updatedHistory = [...completionHistory, selectedPlaylist.id];
    setCompletionHistory(updatedHistory);
    localStorage.setItem("playlistCompletions", JSON.stringify(updatedHistory));
    
    toast({
      title: "Session Completed! 🎉",
      description: `You've completed ${selectedPlaylist.title}. Keep up the great work!`,
    });
  };

  const streak = completionHistory.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-charcoal">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/athlete/skill-map")}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-poppins">Training Playlists</h1>
          </div>
          {activeFocus !== "all" && (
            <Badge className="bg-primary text-primary-foreground">
              {getFocusLabel(activeFocus)}
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Streak */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-poppins">
                Training Playlists
              </h2>
              <p className="text-muted-foreground font-montserrat">
                Personalized exercises to improve your skills
              </p>
            </div>
            {streak > 0 && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
                <Flame className="h-4 w-4 mr-1" />
                {streak} Streak
              </Badge>
            )}
          </div>
        </div>

        {/* Focus Filter Chips */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-slide-up">
          {focusOptions.map((option) => (
            <Button
              key={option}
              variant={activeFocus === option ? "default" : "outline"}
              onClick={() => {
                if (option === "all") {
                  setSearchParams({});
                } else {
                  setSearchParams({ focus: option });
                }
              }}
              className={`whitespace-nowrap font-montserrat ${
                activeFocus === option ? "shadow-orange-glow" : ""
              }`}
            >
              {getFocusLabel(option)}
            </Button>
          ))}
        </div>

        {/* Recommended For You */}
        {activeFocus === "all" && recommendedPlaylists.length > 0 && (
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="text-2xl font-bold font-poppins">Recommended for You</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedPlaylists.map((playlist, index) => (
                <Card
                  key={playlist.id}
                  className="shadow-card-hover bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 transition-smooth hover:border-primary animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-poppins text-lg mb-1">
                          {playlist.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-montserrat">
                          {playlist.description}
                        </p>
                      </div>
                      <PlayCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground font-montserrat">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{playlist.durationMin} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{playlist.drills.length} drills</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {playlist.difficulty}
                      </Badge>
                    </div>
                    <Button
                      className="w-full font-poppins"
                      onClick={() => handleStartSession(playlist)}
                    >
                      Start Training
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Playlists Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold font-poppins mb-4">
            {activeFocus === "all" ? "All Playlists" : `${getFocusLabel(activeFocus)} Playlists`}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPlaylists.map((playlist, index) => (
              <Card
                key={playlist.id}
                className="shadow-card-hover bg-card transition-smooth hover:border-primary/50 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-poppins mb-2">{playlist.title}</CardTitle>
                      <p className="text-sm text-muted-foreground font-montserrat">
                        {playlist.description}
                      </p>
                    </div>
                    <PlayCircle className="h-8 w-8 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground font-montserrat">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{playlist.durationMin} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{playlist.drills.length} drills</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {playlist.difficulty}
                    </Badge>
                  </div>

                  {/* Drills Preview */}
                  <div className="mb-4 p-3 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 font-montserrat">
                      DRILLS INCLUDED:
                    </p>
                    <ul className="text-sm space-y-1 font-montserrat">
                      {playlist.drills.slice(0, 3).map((drill) => (
                        <li key={drill.id} className="text-foreground flex items-center gap-2">
                          <span className="text-primary">•</span>
                          {drill.title}
                          {drill.timeSec && <span className="text-xs text-muted-foreground">({drill.timeSec}s)</span>}
                          {drill.reps && <span className="text-xs text-muted-foreground">({drill.reps} reps)</span>}
                        </li>
                      ))}
                      {playlist.drills.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{playlist.drills.length - 3} more drills
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button
                    className="w-full font-poppins shadow-orange-glow"
                    onClick={() => handleStartSession(playlist)}
                  >
                    Start Training
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredPlaylists.length === 0 && (
          <Card className="shadow-card bg-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground font-montserrat mb-4">
                No playlists found for this focus area
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/athlete/playlists")}
                className="font-poppins"
              >
                View All Playlists
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA */}
        <Card className="shadow-card-hover bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-poppins mb-2">Not sure where to start?</h3>
                <p className="text-muted-foreground font-montserrat">
                  Get a personalized training plan from one of our expert coaches
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate("/coach-swipe")}
                className="font-poppins whitespace-nowrap"
              >
                Find a Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Runner Modal */}
      {selectedPlaylist && (
        <SessionRunner
          open={sessionOpen}
          onOpenChange={setSessionOpen}
          playlistTitle={selectedPlaylist.title}
          drills={selectedPlaylist.drills}
          onComplete={handleCompleteSession}
        />
      )}
    </div>
  );
};

export default AthletePlaylists;
