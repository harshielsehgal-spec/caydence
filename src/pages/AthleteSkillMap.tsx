import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AthleteSkillMap = () => {
  const navigate = useNavigate();

  // Mock analysis history
  const analysisHistory = [
    { date: "2025-10-01", metrics: { balance: 68, posture: 62, cadence: 71, symmetry: 60 } },
    { date: "2025-11-01", metrics: { balance: 76, posture: 66, cadence: 74, symmetry: 65 } },
  ];

  const current = analysisHistory[analysisHistory.length - 1].metrics;
  const previous = analysisHistory[0].metrics;

  const improvements = {
    balance: current.balance - previous.balance,
    posture: current.posture - previous.posture,
    cadence: current.cadence - previous.cadence,
    symmetry: current.symmetry - previous.symmetry,
  };

  const metrics = [
    { 
      name: "Balance", 
      key: "balance" as const,
      score: current.balance, 
      improvement: improvements.balance,
      description: "Your center of gravity and stability during movement"
    },
    { 
      name: "Posture", 
      key: "posture" as const,
      score: current.posture, 
      improvement: improvements.posture,
      description: "Alignment of your spine and body positioning"
    },
    { 
      name: "Cadence", 
      key: "cadence" as const,
      score: current.cadence, 
      improvement: improvements.cadence,
      description: "Rhythm and timing consistency in your movements"
    },
    { 
      name: "Symmetry", 
      key: "symmetry" as const,
      score: current.symmetry, 
      improvement: improvements.symmetry,
      description: "Balance between left and right side movements"
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-primary";
    return "text-destructive";
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
              onClick={() => navigate("/dashboard")}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-poppins">Skill Map</h1>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-poppins">
            Your Performance Metrics
          </h2>
          <p className="text-muted-foreground font-montserrat">
            Track your progress across key movement skills
          </p>
        </div>

        {/* Body Heatmap - Scores Grid */}
        <Card className="mb-8 shadow-card-hover bg-card animate-slide-up">
          <CardHeader>
            <CardTitle className="font-poppins">Current Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div 
                  key={metric.name}
                  className="flex flex-col items-center justify-center p-6 rounded-xl bg-secondary/50 border border-border transition-smooth hover:border-primary/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`text-5xl font-bold mb-2 font-poppins ${getScoreColor(metric.score)}`}>
                    {metric.score}
                  </div>
                  <div className="text-sm font-semibold text-foreground font-poppins mb-1">
                    {metric.name}
                  </div>
                  <Progress value={metric.score} className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card 
              key={metric.name}
              className="shadow-card bg-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-poppins mb-1">{metric.name}</h3>
                    <p className="text-sm text-muted-foreground font-montserrat">
                      {metric.description}
                    </p>
                  </div>
                  {metric.improvement > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : metric.improvement < 0 ? (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  ) : null}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary font-poppins">
                      {metric.score}
                    </span>
                    <span className="text-sm text-muted-foreground font-montserrat">/ 100</span>
                  </div>
                  {metric.improvement !== 0 && (
                    <div className={`text-sm font-semibold font-montserrat ${
                      metric.improvement > 0 ? "text-green-500" : "text-destructive"
                    }`}>
                      {metric.improvement > 0 ? "+" : ""}{metric.improvement} points this month
                      {metric.improvement > 0 && " 🎯"}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-4">
                  <p className="text-sm text-foreground font-montserrat">
                    {metric.improvement > 0 
                      ? `${metric.name} improved +${Math.round((metric.improvement / previous[metric.key]) * 100)}% this month` 
                      : metric.improvement < 0
                      ? `${metric.name} needs work` 
                      : `${metric.name} is stable`}
                  </p>
                </div>

                <Button 
                  onClick={() => navigate(`/athlete/playlists?focus=${metric.key}`)}
                  className="w-full font-poppins shadow-orange-glow"
                >
                  View drills
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Progress Summary */}
        <Card className="shadow-card-hover bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-poppins mb-2">Overall Progress</h3>
                <p className="text-muted-foreground font-montserrat">
                  You've improved an average of{" "}
                  <span className="text-primary font-semibold">
                    +{Math.round((improvements.balance + improvements.posture + improvements.cadence + improvements.symmetry) / 4)} points
                  </span>{" "}
                  across all metrics this month
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate("/video-upload")}
                className="font-poppins whitespace-nowrap"
              >
                New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AthleteSkillMap;
