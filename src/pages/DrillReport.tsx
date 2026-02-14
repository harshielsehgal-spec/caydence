import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, Target, TrendingUp, Dumbbell, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import type { DrillReport as DrillReportType } from "@/utils/drillReportTemplate";
import { getDrillDisplayName } from "@/utils/drillReportTemplate";

const DrillReport = () => {
  const { drillKey, reportId } = useParams<{ drillKey: string; reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please sign in."); setLoading(false); return; }

      const { data, error: fetchErr } = await supabase
        .from("drill_video_reports" as any)
        .select("*")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .single();

      if (fetchErr || !data) throw fetchErr || new Error("Report not found");
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <p className="text-muted-foreground font-montserrat">Loading report…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/5 to-background">
        <p className="text-destructive font-montserrat">{error}</p>
        <Button variant="outline" onClick={() => navigate("/sport-selection")}>Back</Button>
      </div>
    );
  }

  const r: DrillReportType | null = report?.report_json as any;
  const status = report?.status;
  const isProcessing = status === "processing" || status === "uploaded";

  const ratingColor = (rating: string) => {
    if (rating === "Good") return "text-green-500";
    if (rating === "Average") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(`/fitness/drills/${drillKey}`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {getDrillDisplayName(drillKey || "")}
        </button>

        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-poppins">
            {getDrillDisplayName(drillKey || "")} Report
          </h1>
          {isProcessing && !r && (
            <div className="flex flex-col items-center gap-3 mt-4">
              <Badge variant="secondary" className="text-sm">Processing…</Badge>
              <Button variant="outline" size="sm" onClick={fetchReport}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
          )}
        </div>

        {r && (
          <div className="space-y-6">
            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center font-montserrat italic">
              {r.summary.label}
            </p>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                  <Target className="w-5 h-5 text-primary" /> Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="text-5xl font-bold font-poppins text-primary">{r.summary.score}<span className="text-xl text-muted-foreground">/10</span></div>
                <Badge variant={r.summary.status === "Good" ? "default" : "secondary"}>{r.summary.status}</Badge>
              </CardContent>
            </Card>

            {/* Positives & Fixes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Key Positives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {r.positives.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-montserrat">
                        <span className="text-green-500 mt-0.5">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" /> Key Fixes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {r.fixes.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-montserrat">
                        <span className="text-yellow-500 mt-0.5">⚠</span> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Form Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" /> Form Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {r.formBreakdown.map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-montserrat font-medium">{row.metric}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-montserrat">{row.value}</span>
                        <Badge variant="outline" className={ratingColor(row.rating)}>{row.rating}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Flags */}
            {r.safetyFlags.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                    <Shield className="w-5 h-5 text-red-500" /> Safety Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {r.safetyFlags.map((f, i) => (
                      <li key={i} className="text-sm font-montserrat text-red-400">🚩 {f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Goals + Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                    <Target className="w-5 h-5 text-primary" /> Next Session Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {r.nextGoals.map((g, i) => (
                      <li key={i} className="text-sm font-montserrat">🎯 {g}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                    <Dumbbell className="w-5 h-5 text-primary" /> Suggested Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm font-montserrat">
                  <p><strong>{r.suggestedPlan.sets}</strong> sets × <strong>{r.suggestedPlan.reps}</strong> reps</p>
                  <p>Rest: <strong>{r.suggestedPlan.rest}</strong></p>
                </CardContent>
              </Card>
            </div>

            {/* Video Meta */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                  <Clock className="w-5 h-5 text-muted-foreground" /> Video Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm font-montserrat text-muted-foreground">
                <p>Drill: {r.meta.drill}</p>
                <p>Uploaded: {new Date(r.meta.uploadedAt).toLocaleString()}</p>
                {r.meta.fileName && <p>File: {r.meta.fileName}</p>}
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button onClick={() => navigate(`/fitness/drills/${drillKey}`)} className="font-poppins">
                Record Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrillReport;
