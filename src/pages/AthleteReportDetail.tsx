import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Video, Star, TrendingUp, TrendingDown, FileText, Play } from "lucide-react";
import { toast } from "sonner";

// Mock data - in real app, fetch by ID
const MOCK_REPORT = {
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
    notes: [
      "Open hips on cut - this will improve your agility",
      "Shorten stride on last two steps for better control",
      "Great improvement in overall form consistency"
    ],
    rating: 4.8,
    tags: ["posture", "balance", "agility"]
  },
  media: {
    athleteUrl: "/mock/athlete-video.mp4",
    coachUrl: "/mock/coach-feedback.mp4",
    keyFrames: [12, 27, 39]
  },
  suggestedDrills: [
    { id: "D01", title: "Hip Mobility Series", duration: "10 min", focus: "posture" },
    { id: "D02", title: "Balance Board Training", duration: "12 min", focus: "balance" },
    { id: "D03", title: "Stride Control Drills", duration: "8 min", focus: "cadence" }
  ]
};

export default function AthleteReportDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const metrics = [
    { name: "Posture", value: MOCK_REPORT.ai.posture, delta: MOCK_REPORT.ai.deltas.posture, color: "text-purple-500" },
    { name: "Balance", value: MOCK_REPORT.ai.balance, delta: MOCK_REPORT.ai.deltas.balance, color: "text-blue-500" },
    { name: "Cadence", value: MOCK_REPORT.ai.cadence, delta: MOCK_REPORT.ai.deltas.cadence, color: "text-green-500" },
    { name: "Symmetry", value: MOCK_REPORT.ai.symmetry, delta: MOCK_REPORT.ai.deltas.symmetry, color: "text-orange-500" }
  ];

  const handleExportPDF = () => {
    toast.success("Exporting report as PDF...", {
      description: "Your report will download shortly"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-secondary to-charcoal">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/athlete/reports")}
            className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 font-heading">
                Combined Analysis Report
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <span>{MOCK_REPORT.sport}</span>
                <span>•</span>
                <span>{new Date(MOCK_REPORT.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>Coach: {MOCK_REPORT.coachName}</span>
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span className="text-sm font-semibold">{MOCK_REPORT.coach.rating}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Video Comparison */}
        <Card className="bg-card border-border mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground font-heading flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Side-by-Side Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Your Performance</p>
                <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center border border-border group relative overflow-hidden">
                  <Video className="h-12 w-12 text-muted-foreground" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <Button size="lg" className="rounded-full" variant="ghost">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Coach Feedback Video</p>
                <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center border border-border group relative overflow-hidden">
                  <Video className="h-12 w-12 text-muted-foreground" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <Button size="lg" className="rounded-full" variant="ghost">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Metrics Grid */}
          <Card className="lg:col-span-2 bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">AI Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.name} className="p-6 bg-secondary rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-muted-foreground">{metric.name}</p>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        metric.delta > 0 ? 'text-green-500' : metric.delta < 0 ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {metric.delta > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : metric.delta < 0 ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : null}
                        {metric.delta > 0 ? '+' : ''}{metric.delta}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className={`text-4xl font-bold ${metric.color} font-heading`}>{metric.value}</p>
                      <p className="text-muted-foreground text-sm mb-1">/100</p>
                    </div>
                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOCK_REPORT.coach.tags.map(tag => (
                  <Badge key={tag} className="bg-primary/10 text-primary border-primary/30 text-sm py-1.5 px-3">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Coach Notes */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground font-heading flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Coach Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_REPORT.coach.notes.map((note, index) => (
                  <div key={index} className="p-4 bg-secondary rounded-lg border border-border">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-foreground flex-1">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Drills */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">Suggested Drills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_REPORT.suggestedDrills.map((drill) => (
                  <div key={drill.id} className="p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-smooth">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{drill.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{drill.duration}</span>
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            {drill.focus}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => navigate("/athlete/playlists")}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
