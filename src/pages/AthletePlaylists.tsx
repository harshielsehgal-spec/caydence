import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PlayCircle, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AthletePlaylists = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focus = searchParams.get("focus") || "all";

  const playlists = [
    {
      title: "Balance Fundamentals",
      focus: "balance",
      duration: "15 min",
      exercises: 8,
      difficulty: "Beginner",
      description: "Build a strong foundation for stability and control"
    },
    {
      title: "Posture Perfection",
      focus: "posture",
      duration: "20 min",
      exercises: 10,
      difficulty: "Intermediate",
      description: "Improve your alignment and body positioning"
    },
    {
      title: "Cadence Training",
      focus: "cadence",
      duration: "25 min",
      exercises: 12,
      difficulty: "Intermediate",
      description: "Develop consistent rhythm and timing"
    },
    {
      title: "Symmetry Drills",
      focus: "symmetry",
      duration: "18 min",
      exercises: 9,
      difficulty: "Beginner",
      description: "Balance your left and right side movements"
    },
  ];

  const filteredPlaylists = focus === "all" 
    ? playlists 
    : playlists.filter(p => p.focus === focus);

  const getFocusLabel = (focus: string) => {
    return focus.charAt(0).toUpperCase() + focus.slice(1);
  };

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
          {focus !== "all" && (
            <Badge className="bg-primary text-primary-foreground">
              {getFocusLabel(focus)}
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-poppins">
            {focus === "all" ? "All Training Playlists" : `${getFocusLabel(focus)} Drills`}
          </h2>
          <p className="text-muted-foreground font-montserrat">
            Personalized exercises to improve your skills
          </p>
        </div>

        {/* Playlists Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPlaylists.map((playlist, index) => (
            <Card 
              key={playlist.title}
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
                    <span>{playlist.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{playlist.exercises} exercises</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {playlist.difficulty}
                  </Badge>
                </div>

                <Button 
                  className="w-full font-poppins"
                  onClick={() => {
                    // Placeholder - would navigate to actual playlist detail
                    alert(`Coming soon: ${playlist.title} playlist`);
                  }}
                >
                  Start Training
                </Button>
              </CardContent>
            </Card>
          ))}
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
        <Card className="mt-8 shadow-card-hover bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 animate-slide-up">
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
    </div>
  );
};

export default AthletePlaylists;
