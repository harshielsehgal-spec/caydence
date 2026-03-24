import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, AlertTriangle, Target, TrendingUp, Sparkles, Trophy, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getDrillDisplayName } from "@/utils/drillReportTemplate";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8001/api';

interface WorkoutResults {
  workout_id: string;
  exercise_type: string;
  total_reps: number;
  valid_reps: number;
  voided_reps: number;
  avg_score: number;
  grade: string;
  dominant_fault: string;
  ai_summary: string;
  reps: Array<{
    rep_number: number;
    score: number;
    faults: string[];
    depth: number;
    tempo: number;
    voided: boolean;
  }>;
  metrics?: {
    avg_rom: number;
    avg_stab: number;
    avg_ctrl: number;
    fault_distribution: Record<string, number>;
  };
}

const DrillReport = () => {
  const { drillKey, reportId } = useParams<{ drillKey: string; reportId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<WorkoutResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        setError("Please sign in."); 
        setLoading(false); 
        return; 
      }

      const response = await fetch(`${API_BASE_URL}/workout/${reportId}/results`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis results');
      }

      const data: WorkoutResults = await response.json();
      setResults(data);
      
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (reportId) {
      fetchReport(); 
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-montserrat">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-montserrat text-center">{error}</p>
        <Button variant="outline" onClick={() => navigate("/sport-selection")}>Back to Drills</Button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-montserrat">No results found</p>
      </div>
    );
  }

  const reps = results.reps || [];
  const midpoint = Math.floor(reps.length / 2);
  const firstHalf = reps.slice(0, midpoint);
  const secondHalf = reps.slice(midpoint);
  const firstHalfAvg = firstHalf.length ? firstHalf.reduce((sum, r) => sum + r.score, 0) / firstHalf.length : 0;
  const secondHalfAvg = secondHalf.length ? secondHalf.reduce((sum, r) => sum + r.score, 0) / secondHalf.length : 0;
  const trend = secondHalfAvg - firstHalfAvg;

  const gradeColors: Record<string, string> = {
    'A+': 'from-emerald-500 to-green-600',
    'A': 'from-emerald-500 to-green-600',
    'B': 'from-primary to-orange-glow',
    'C': 'from-yellow-500 to-orange-500',
    'D': 'from-orange-500 to-destructive',
    'F': 'from-destructive to-red-700',
  };

  const gradientClass = gradeColors[results.grade] || 'from-muted to-secondary';
  const getScoreColor = (score: number) => score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-primary' : 'text-destructive';

  return (
    <div className="min-h-screen px-4 py-12 bg-background">
      <div className="max-w-4xl mx-auto">
        
        <button
          onClick={() => navigate(`/fitness/drills/${drillKey}`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {getDrillDisplayName(drillKey || "")}
        </button>

        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-poppins gradient-text">
            {getDrillDisplayName(drillKey || "")} Analysis
          </h1>
          <p className="text-muted-foreground font-montserrat flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Powered by AI + Computer Vision
          </p>
        </div>

        <div className="space-y-6">
          
          {/* AI Coaching Card */}
          <Card className="overflow-hidden border-border shadow-card-hover bg-gradient-to-br from-card to-background">
            <CardHeader className="relative p-6 bg-gradient-to-r from-primary to-orange-glow">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              
              <div className="flex items-start gap-4">
                <div className={`px-6 py-3 rounded-xl bg-gradient-to-br ${gradientClass} shadow-strong`}>
                  <span className="text-4xl font-black text-white">{results.grade}</span>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1 font-poppins">
                    AI Form Analysis
                  </h2>
                  <p className="text-white/80 text-sm font-montserrat">
                    {results.total_reps} reps • {results.valid_reps} valid • {results.voided_reps} voided
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              
              {/* AI Summary */}
              <div className="p-5 bg-card/50 rounded-xl border border-border">
                <p className="text-foreground leading-relaxed text-base font-montserrat whitespace-pre-line">
                  {results.ai_summary}
                </p>
              </div>

              {/* Metrics Grid */}
              {results.metrics && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Range</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{Math.round(results.metrics.avg_rom)}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-border bg-card/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-muted-foreground">Stability</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">{Math.round(results.metrics.avg_stab)}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-border bg-card/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-orange-glow" />
                      <span className="text-xs font-medium text-muted-foreground">Tempo</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-glow">{Math.round(results.metrics.avg_ctrl)}</div>
                  </div>
                </div>
              )}

              {/* Dominant Fault */}
              {results.dominant_fault && results.dominant_fault !== 'None' && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-destructive text-sm font-poppins">
                      Primary Form Issue
                    </p>
                    <p className="text-destructive/80 text-sm mt-1 font-montserrat">
                      {results.dominant_fault}
                    </p>
                  </div>
                </div>
              )}

            </CardContent>

            <div className="px-6 py-4 bg-primary/10 border-t border-primary/20">
              <p className="text-sm text-muted-foreground text-center font-montserrat">
                💡 <span className="font-medium text-foreground">Next session:</span> Focus on {results.dominant_fault || 'maintaining form'}
              </p>
            </div>
          </Card>

          {/* Performance Trend */}
          {reps.length >= 4 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" /> Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  trend > 5 ? 'bg-emerald-500/10 text-emerald-500' :
                  trend < -8 ? 'bg-destructive/10 text-destructive' :
                  'bg-muted/50 text-muted-foreground'
                }`}>
                  {trend > 5 ? <Trophy className="w-4 h-4" /> : 
                   trend < -8 ? <AlertTriangle className="w-4 h-4" /> :
                   <span className="text-sm">→</span>}
                  <span className="text-sm font-medium font-montserrat">
                    {trend > 5 ? 'Form improved ↑' :
                     trend < -8 ? 'Fatigue detected ↓' :
                     'Consistent'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rep Breakdown */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins text-foreground">Rep Breakdown</h3>
            <div className="space-y-3">
              {reps.map((rep) => {
                const scoreColor = getScoreColor(rep.score);
                const bgClass = rep.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30' :
                               rep.score >= 60 ? 'bg-primary/10 border-primary/30' :
                               'bg-destructive/10 border-destructive/30';
                const barColor = rep.score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                               rep.score >= 60 ? 'bg-gradient-to-r from-primary to-orange-glow' :
                               'bg-gradient-to-r from-destructive to-red-600';

                return (
                  <Card key={rep.rep_number} className={`border-2 ${bgClass} transition-all hover:shadow-card-hover`}>
                    <CardContent className="p-4">
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center font-bold text-foreground">
                            {rep.rep_number}
                          </div>
                          <div>
                            <div className={`text-2xl font-black ${scoreColor}`}>{rep.score}</div>
                            <div className="text-xs text-muted-foreground">/ 100</div>
                          </div>
                        </div>

                        {rep.voided && (
                          <Badge variant="destructive" className="text-xs">VOID</Badge>
                        )}
                      </div>

                      {/* Score Bar */}
                      <div className="mb-3">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${rep.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-card rounded-lg border border-border">
                          <div className="text-xs text-muted-foreground mb-1 font-montserrat">Depth</div>
                          <div className="font-bold text-foreground">{rep.depth}°</div>
                        </div>
                        <div className="text-center p-2 bg-card rounded-lg border border-border">
                          <div className="text-xs text-muted-foreground mb-1 font-montserrat">Tempo</div>
                          <div className="font-bold text-foreground">{rep.tempo}s</div>
                        </div>
                        <div className="text-center p-2 bg-card rounded-lg border border-border">
                          <div className="text-xs text-muted-foreground mb-1 font-montserrat">Score</div>
                          <div className="font-bold text-foreground">{rep.score}</div>
                        </div>
                      </div>

                      {/* Faults */}
                      {rep.faults && rep.faults.length > 0 && (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <div className="text-xs font-semibold mb-1 font-poppins text-foreground">Issues:</div>
                            <div className="flex flex-wrap gap-1">
                              {rep.faults.map((fault, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs font-montserrat border-primary/30 text-primary">
                                  {fault}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {(!rep.faults || rep.faults.length === 0) && !rep.voided && (
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-montserrat">Clean rep!</span>
                        </div>
                      )}

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => navigate(`/fitness/drills/${drillKey}`)} className="font-poppins bg-gradient-to-r from-primary to-orange-glow hover:shadow-strong transition-all">
              Record Another
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DrillReport;