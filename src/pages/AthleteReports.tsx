import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Star, TrendingUp, TrendingDown, Video, Filter, User } from "lucide-react";
import HeaderCoin from "@/components/HeaderCoin";

// Mock combined reports data
const MOCK_REPORTS = [
  {
    id: "R001",
    athleteId: "A001",
    athleteName: "Current User",
    coachId: "C001",
    coachName: "Rajesh Kumar",
    sport: "Football",
    date: "2024-03-15",
    ai: {
      posture: 72,
      balance: 68,
      cadence: 74,
      symmetry: 65,
      deltas: { posture: 6, balance: -4, cadence: 8, symmetry: 2 }
    },
    coach: {
      notes: ["Open hips on cut", "Shorten stride on last two steps"],
      rating: 4.8,
      tags: ["posture", "balance"]
    },
    media: {
      athleteUrl: "/mock/a.mp4",
      coachUrl: "/mock/c.mp4",
      keyFrames: [12, 27, 39]
    }
  },
  {
    id: "R002",
    athleteId: "A001",
    athleteName: "Current User",
    coachId: "C002",
    coachName: "Priya Sharma",
    sport: "Cricket",
    date: "2024-03-10",
    ai: {
      posture: 78,
      balance: 82,
      cadence: 76,
      symmetry: 80,
      deltas: { posture: 12, balance: 8, cadence: 5, symmetry: 10 }
    },
    coach: {
      notes: ["Excellent follow-through", "Maintain this tempo"],
      rating: 4.9,
      tags: ["cadence", "symmetry"]
    },
    media: {
      athleteUrl: "/mock/a2.mp4",
      coachUrl: "/mock/c2.mp4",
      keyFrames: [8, 22, 35]
    }
  },
  {
    id: "R003",
    athleteId: "A001",
    athleteName: "Current User",
    coachId: "C001",
    coachName: "Rajesh Kumar",
    sport: "Football",
    date: "2024-03-05",
    ai: {
      posture: 66,
      balance: 72,
      cadence: 66,
      symmetry: 63,
      deltas: { posture: -2, balance: 3, cadence: -6, symmetry: -4 }
    },
    coach: {
      notes: ["Work on core strength", "Focus on landing mechanics"],
      rating: 4.5,
      tags: ["posture", "cadence"]
    },
    media: {
      athleteUrl: "/mock/a3.mp4",
      coachUrl: "/mock/c3.mp4",
      keyFrames: [10, 25, 40]
    }
  }
];

export default function AthleteReports() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedDate, setSelectedDate] = useState("All Time");

  const sports = ["All Sports", ...Array.from(new Set(MOCK_REPORTS.map(r => r.sport)))];
  const dateRanges = ["All Time", "Last Week", "Last Month", "Last 3 Months"];

  const filteredReports = MOCK_REPORTS.filter(report => {
    if (selectedSport !== "All Sports" && report.sport !== selectedSport) return false;
    // Date filtering would be implemented here based on selectedDate
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-secondary to-charcoal">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-charcoal/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <h1 className="text-xl font-bold text-foreground">Combined Reports</h1>
          <div className="flex items-center gap-3">
            <HeaderCoin />
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/profile")}
              className="font-poppins"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-muted-foreground">
                Your AI analysis history with coach feedback
              </p>
            </div>
            <Button onClick={() => navigate("/video-upload")} size="lg">
              <Video className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6 shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-40 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-40 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="bg-card border-border hover:border-primary/50 transition-smooth shadow-card hover:shadow-card-hover cursor-pointer"
              onClick={() => navigate(`/athlete/reports/${report.id}`)}
            >
              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-heading">
                      {report.coachName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {report.sport} • {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span className="text-sm font-semibold">{report.coach.rating}</span>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center border border-border group-hover:border-primary/50 transition-smooth">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(report.ai.deltas).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-secondary rounded border border-border">
                      <span className="text-xs text-muted-foreground capitalize">{key}</span>
                      <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                        value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {value > 0 ? <TrendingUp className="h-3 w-3" /> : value < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                        {value > 0 ? '+' : ''}{value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {report.coach.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Reports Found</h3>
              <p className="text-muted-foreground mb-6">
                Start your training journey by uploading a video for AI analysis
              </p>
              <Button onClick={() => navigate("/video-upload")}>
                <Video className="mr-2 h-4 w-4" />
                Upload First Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
