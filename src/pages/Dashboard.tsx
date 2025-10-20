import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Clock, Calendar, BarChart3, User } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const weeklyData = [
    { day: "Mon", value: 82 },
    { day: "Tue", value: 85 },
    { day: "Wed", value: 79 },
    { day: "Thu", value: 88 },
    { day: "Fri", value: 91 },
    { day: "Sat", value: 87 },
    { day: "Sun", value: 93 },
  ];

  const badges = [
    { name: "Consistent Trainer", icon: "🎯", unlocked: true },
    { name: "Precision Improver", icon: "📈", unlocked: true },
    { name: "Rhythm Master", icon: "🎵", unlocked: false },
    { name: "Week Warrior", icon: "💪", unlocked: true },
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-poppins">
              Your Progress
            </h1>
            <p className="text-muted-foreground font-montserrat">
              Track your training journey
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="font-poppins"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground font-montserrat">Sessions</span>
              </div>
              <div className="text-3xl font-bold font-poppins">24</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground font-montserrat">Hours Trained</span>
              </div>
              <div className="text-3xl font-bold font-poppins">36</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground font-montserrat">Improvement</span>
              </div>
              <div className="text-3xl font-bold font-poppins">+18%</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground font-montserrat">Badges</span>
              </div>
              <div className="text-3xl font-bold font-poppins">3/4</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress Chart */}
        <Card className="mb-8 shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <BarChart3 className="h-5 w-5 text-primary" />
              Form Accuracy Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-3">
              {weeklyData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-sm font-semibold text-primary font-poppins">
                    {data.value}%
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-smooth hover:opacity-80"
                    style={{ height: `${(data.value / 100) * 200}px` }}
                  />
                  <div className="text-sm text-muted-foreground font-montserrat">
                    {data.day}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Rhythm Score */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-poppins">
                Your AI Rhythm Score This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-primary mb-2 font-poppins">
                  87
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  +5 from last week
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground text-center font-montserrat">
                Your movement consistency has improved significantly. Keep maintaining this rhythm!
              </p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-poppins">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-smooth ${
                      badge.unlocked
                        ? "bg-primary/5 border border-primary/20"
                        : "bg-muted/50 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold font-poppins">{badge.name}</div>
                    </div>
                    {badge.unlocked && (
                      <Badge variant="outline" className="text-primary border-primary">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate("/motion-analysis")}
            className="h-20 text-lg font-poppins"
          >
            New Analysis
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/marketplace")}
            className="h-20 text-lg font-poppins"
          >
            Find Coaches
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/ai-insights")}
            className="h-20 text-lg font-poppins"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
