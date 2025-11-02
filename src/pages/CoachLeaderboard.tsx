import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, TrendingUp, Star, Eye } from "lucide-react";
import { toast } from "sonner";

const SPORTS = ["All Sports", "Football", "Cricket", "Tennis", "Basketball", "Badminton"];

export default function CoachLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedSport]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("calculate_coach_leaderboard", {
        sport_filter: selectedSport === "All Sports" ? null : selectedSport,
      });

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: "text-yellow-500", glow: "shadow-yellow-500/50" };
    if (rank === 2) return { color: "text-gray-400", glow: "shadow-gray-400/50" };
    if (rank === 3) return { color: "text-amber-600", glow: "shadow-amber-600/50" };
    return { color: "text-muted-foreground", glow: "" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-foreground">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Coach Leaderboard</h1>
            <p className="text-muted-foreground">Top performing coaches across all sports</p>
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-48 bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPORTS.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {leaderboard.map((entry) => {
            const rankStyle = getRankBadge(Number(entry.rank));
            const isTopThree = Number(entry.rank) <= 3;

            return (
              <Card
                key={`${entry.coach_id}-${entry.sport}`}
                className={`bg-card border-border overflow-hidden transition-all hover:scale-[1.02] ${
                  isTopThree ? `shadow-lg ${rankStyle.glow}` : ""
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className={`flex flex-col items-center min-w-[80px] ${rankStyle.color}`}>
                      {isTopThree && <Trophy className="h-8 w-8 mb-1" />}
                      <div className={`text-3xl font-bold ${isTopThree ? "animate-pulse" : ""}`}>
                        #{entry.rank}
                      </div>
                    </div>

                    {/* Coach Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={entry.coach_photo_url} alt={entry.coach_name} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {entry.coach_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {entry.coach_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-secondary/20">
                            {entry.sport}
                          </Badge>
                          {entry.avg_rating > 0 && (
                            <div className="flex items-center text-primary">
                              <Star className="h-4 w-4 mr-1 fill-current" />
                              <span className="font-medium">{Number(entry.avg_rating).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 min-w-[300px]">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {entry.total_bookings}
                        </div>
                        <div className="text-xs text-muted-foreground">Bookings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {Number(entry.avg_rating).toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {entry.masterclass_views}
                        </div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-center min-w-[100px]">
                      <div className="flex items-center justify-center text-primary mb-1">
                        <TrendingUp className="h-5 w-5 mr-1" />
                        <span className="text-2xl font-bold">{Number(entry.score).toFixed(0)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {isTopThree && (
                  <div className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                )}
              </Card>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <Card className="bg-card border-border p-12 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No rankings yet</h3>
            <p className="text-muted-foreground">
              Start coaching to appear on the leaderboard
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
