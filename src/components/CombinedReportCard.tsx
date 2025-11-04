import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Video, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CombinedReportCardProps {
  report: {
    id: string;
    athleteId: string;
    athleteName?: string;
    coachId: string;
    coachName?: string;
    sport: string;
    date: string;
    ai: {
      posture: number;
      balance: number;
      cadence: number;
      symmetry: number;
      deltas: {
        posture: number;
        balance: number;
        cadence: number;
        symmetry: number;
      };
    };
    coach: {
      notes: string[];
      rating: number;
      tags: string[];
    };
    media: {
      athleteUrl: string;
      coachUrl: string;
      keyFrames: number[];
    };
  };
  viewType: "athlete" | "coach";
}

export function CombinedReportCard({ report, viewType }: CombinedReportCardProps) {
  const navigate = useNavigate();

  const metrics = [
    { name: "Posture", value: report.ai.posture, delta: report.ai.deltas.posture },
    { name: "Balance", value: report.ai.balance, delta: report.ai.deltas.balance },
    { name: "Cadence", value: report.ai.cadence, delta: report.ai.deltas.cadence },
    { name: "Symmetry", value: report.ai.symmetry, delta: report.ai.deltas.symmetry },
  ];

  const handleViewReport = () => {
    if (viewType === "athlete") {
      navigate(`/athlete/reports/${report.id}`);
    } else {
      navigate(`/coach/analytics?tab=reports&reportId=${report.id}`);
    }
  };

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-smooth shadow-card hover:shadow-card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-heading text-foreground">
              {viewType === "athlete" ? report.coachName : report.athleteName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {report.sport} • {new Date(report.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-yellow-500">
            <Star className="h-4 w-4 fill-yellow-500" />
            <span className="text-sm font-semibold">{report.coach.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Thumbnails */}
        <div className="flex gap-2">
          <div className="flex-1 aspect-video bg-secondary rounded-lg flex items-center justify-center border border-border">
            <Video className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 aspect-video bg-secondary rounded-lg flex items-center justify-center border border-border">
            <Video className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-3 bg-secondary rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{metric.name}</p>
                <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                  metric.delta > 0 ? 'text-green-500' : metric.delta < 0 ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  {metric.delta > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : metric.delta < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {metric.delta > 0 ? '+' : ''}{metric.delta}
                </div>
              </div>
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Coach Notes Preview */}
        <div className="p-3 bg-secondary/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">Coach Notes</p>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {report.coach.notes[0]}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {report.coach.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleViewReport} className="flex-1">
            View Full Report
          </Button>
          {viewType === "athlete" && (
            <Button variant="outline" onClick={() => navigate("/video-upload")}>
              New Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
