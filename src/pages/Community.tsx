import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, TrendingDown, Award, Flame, Share2 } from "lucide-react";

const mockHighlights = [
  { id: "h01", type: "athlete", name: "Riya Patel", sport: "Football", achievement: "+12% balance", time: "2h ago", avatar: "/placeholder.svg", likes: 24 },
  { id: "h02", type: "coach", name: "Aarav Khanna", sport: "Cricket", achievement: "20 drills assigned this week", time: "5h ago", avatar: "/placeholder.svg", likes: 18 },
  { id: "h03", type: "athlete", name: "Dev Singh", sport: "Tennis", achievement: "Won 7-Day Cadence Challenge", time: "1d ago", avatar: "/placeholder.svg", likes: 42 },
  { id: "h04", type: "athlete", name: "Priya Sharma", sport: "Football", achievement: "+15% posture improvement", time: "3h ago", avatar: "/placeholder.svg", likes: 31 },
  { id: "h05", type: "coach", name: "Rohan Verma", sport: "Basketball", achievement: "Helped 10 athletes this week", time: "6h ago", avatar: "/placeholder.svg", likes: 27 },
];

const mockAthleteLeaderboard = [
  { rank: 1, name: "Dev Singh", sport: "Tennis", improvement: 18.5, consistency: 94, points: 2850, trend: "up", avatar: "/placeholder.svg" },
  { rank: 2, name: "Riya Patel", sport: "Football", improvement: 16.2, consistency: 91, points: 2720, trend: "up", avatar: "/placeholder.svg" },
  { rank: 3, name: "Priya Sharma", sport: "Football", improvement: 14.8, consistency: 88, points: 2580, trend: "same", avatar: "/placeholder.svg" },
  { rank: 4, name: "Arjun Kumar", sport: "Cricket", improvement: 13.5, consistency: 85, points: 2420, trend: "up", avatar: "/placeholder.svg" },
  { rank: 5, name: "Neha Gupta", sport: "Basketball", improvement: 12.1, consistency: 82, points: 2310, trend: "down", avatar: "/placeholder.svg" },
  { rank: 6, name: "Vikram Rao", sport: "Tennis", improvement: 11.8, consistency: 80, points: 2190, trend: "up", avatar: "/placeholder.svg" },
  { rank: 7, name: "Ananya Joshi", sport: "Football", improvement: 10.5, consistency: 78, points: 2050, trend: "same", avatar: "/placeholder.svg" },
  { rank: 8, name: "Kabir Mehta", sport: "Cricket", improvement: 9.7, consistency: 75, points: 1920, trend: "down", avatar: "/placeholder.svg" },
  { rank: 9, name: "Ishaan Patel", sport: "Basketball", improvement: 8.9, consistency: 72, points: 1810, trend: "up", avatar: "/placeholder.svg" },
  { rank: 10, name: "Sanya Reddy", sport: "Tennis", improvement: 8.2, consistency: 70, points: 1690, trend: "same", avatar: "/placeholder.svg" },
];

const mockCoachLeaderboard = [
  { rank: 1, name: "Aarav Khanna", sport: "Cricket", rating: 4.9, sessions: 142, engagement: 96, avatar: "/placeholder.svg", trend: "up" },
  { rank: 2, name: "Rohan Verma", sport: "Basketball", rating: 4.8, sessions: 128, engagement: 94, avatar: "/placeholder.svg", trend: "up" },
  { rank: 3, name: "Meera Iyer", sport: "Football", rating: 4.8, sessions: 115, engagement: 92, avatar: "/placeholder.svg", trend: "same" },
  { rank: 4, name: "Raj Malhotra", sport: "Tennis", rating: 4.7, sessions: 98, engagement: 89, avatar: "/placeholder.svg", trend: "up" },
  { rank: 5, name: "Kavya Nair", sport: "Cricket", rating: 4.6, sessions: 87, engagement: 85, avatar: "/placeholder.svg", trend: "down" },
  { rank: 6, name: "Aditya Singh", sport: "Football", rating: 4.6, sessions: 79, engagement: 83, avatar: "/placeholder.svg", trend: "up" },
  { rank: 7, name: "Divya Chopra", sport: "Basketball", rating: 4.5, sessions: 72, engagement: 80, avatar: "/placeholder.svg", trend: "same" },
  { rank: 8, name: "Aryan Shah", sport: "Tennis", rating: 4.5, sessions: 65, engagement: 78, avatar: "/placeholder.svg", trend: "up" },
  { rank: 9, name: "Simran Kaur", sport: "Cricket", rating: 4.4, sessions: 58, engagement: 75, avatar: "/placeholder.svg", trend: "down" },
  { rank: 10, name: "Karthik Raman", sport: "Football", rating: 4.4, sessions: 51, engagement: 72, avatar: "/placeholder.svg", trend: "same" },
];

const mockAchievements = [
  { id: "a01", title: "First Session Complete", badge: "Bronze", icon: "🥉", earned: true, date: "2 weeks ago" },
  { id: "a02", title: "5-Day Streak", badge: "Silver", icon: "🔥", earned: true, date: "1 week ago" },
  { id: "a03", title: "10% Improvement", badge: "Gold", icon: "🥇", earned: true, date: "3 days ago" },
  { id: "a04", title: "Elite Mentor", badge: "Elite", icon: "👑", earned: false, date: null },
  { id: "a05", title: "Challenge Champion", badge: "Gold", icon: "🏆", earned: true, date: "Yesterday" },
  { id: "a06", title: "Perfect Week", badge: "Silver", icon: "⭐", earned: false, date: null },
];

const Community = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [leaderboardTab, setLeaderboardTab] = useState<"athletes" | "coaches">("athletes");

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-yellow-600 border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-500 border-2 border-gray-300 shadow-[0_0_20px_rgba(156,163,175,0.4)]";
    if (rank === 3) return "bg-gradient-to-r from-orange-600 to-orange-700 border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]";
    return "bg-card";
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Bronze": return "bg-orange-900/40 text-orange-400 border-orange-600";
      case "Silver": return "bg-gray-700/40 text-gray-300 border-gray-500";
      case "Gold": return "bg-yellow-900/40 text-yellow-400 border-yellow-600";
      case "Elite": return "bg-purple-900/40 text-purple-400 border-purple-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Community</h1>
          <p className="text-[#D0D0D0] text-lg mb-6">Connect, compete, and celebrate progress together</p>
          
          {/* Engagement Summary */}
          <Card className="bg-[#181818] border-[#FF6B00]/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-wrap gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
                  <span className="text-white font-semibold">4,345</span>
                  <span className="text-[#D0D0D0]">athletes active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
                  <span className="text-white font-semibold">267</span>
                  <span className="text-[#D0D0D0]">coaches live</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
                  <span className="text-white font-semibold">3</span>
                  <span className="text-[#D0D0D0]">challenges running</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="highlights" className="space-y-6">
          <TabsList className="bg-[#181818] border border-[#FF6B00]/30">
            <TabsTrigger value="highlights" className="data-[state=active]:shadow-[0_0_12px_rgba(255,107,0,0.4)]">
              Highlights
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="data-[state=active]:shadow-[0_0_12px_rgba(255,107,0,0.4)]">
              Leaderboards
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:shadow-[0_0_12px_rgba(255,107,0,0.4)]">
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Highlights Tab */}
          <TabsContent value="highlights" className="space-y-4">
            {mockHighlights.map((highlight) => (
              <Card key={highlight.id} className="bg-[#181818] border-[#FF6B00]/20 hover:border-[#FF6B00]/40 transition-all">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={highlight.avatar} alt={highlight.name} />
                      <AvatarFallback>{highlight.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{highlight.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {highlight.type === "athlete" ? "Athlete" : "Coach"}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-[#FF6B00]/40 text-[#FF6B00]">
                          {highlight.sport}
                        </Badge>
                      </div>
                      <p className="text-[#D0D0D0] mb-2">{highlight.achievement}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{highlight.time}</span>
                        <button
                          onClick={() => toggleLike(highlight.id)}
                          className="flex items-center gap-1 text-sm hover:text-[#FF6B00] transition-colors"
                        >
                          <Heart
                            className={`h-4 w-4 ${likedPosts.has(highlight.id) ? "fill-[#FF6B00] text-[#FF6B00]" : "text-muted-foreground"}`}
                          />
                          <span className={likedPosts.has(highlight.id) ? "text-[#FF6B00]" : "text-muted-foreground"}>
                            {highlight.likes + (likedPosts.has(highlight.id) ? 1 : 0)}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Leaderboards Tab */}
          <TabsContent value="leaderboards" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                variant={leaderboardTab === "athletes" ? "default" : "outline"}
                onClick={() => setLeaderboardTab("athletes")}
                className={leaderboardTab === "athletes" ? "shadow-orange-glow" : ""}
              >
                Athletes
              </Button>
              <Button
                variant={leaderboardTab === "coaches" ? "default" : "outline"}
                onClick={() => setLeaderboardTab("coaches")}
                className={leaderboardTab === "coaches" ? "shadow-orange-glow" : ""}
              >
                Coaches
              </Button>
            </div>

            {leaderboardTab === "athletes" ? (
              <div className="space-y-3">
                {mockAthleteLeaderboard.map((athlete) => (
                  <Card key={athlete.rank} className={`${getRankBadge(athlete.rank)} border-[#FF6B00]/20`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-white w-8 text-center">
                          {athlete.rank}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={athlete.avatar} alt={athlete.name} />
                          <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{athlete.name}</h3>
                            {athlete.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                            {athlete.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                          </div>
                          <Badge variant="outline" className="text-xs border-[#FF6B00]/40 text-[#FF6B00]">
                            {athlete.sport}
                          </Badge>
                        </div>
                        <div className="text-right space-y-1 hidden md:block">
                          <div className="text-sm text-[#D0D0D0]">
                            <span className="text-white font-semibold">{athlete.improvement}%</span> improvement
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {athlete.points} pts • {athlete.consistency}% consistency
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {mockCoachLeaderboard.map((coach) => (
                  <Card key={coach.rank} className={`${getRankBadge(coach.rank)} border-[#FF6B00]/20`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-white w-8 text-center">
                          {coach.rank}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={coach.avatar} alt={coach.name} />
                          <AvatarFallback>{coach.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{coach.name}</h3>
                            {coach.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                            {coach.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                          </div>
                          <Badge variant="outline" className="text-xs border-[#FF6B00]/40 text-[#FF6B00]">
                            {coach.sport}
                          </Badge>
                        </div>
                        <div className="text-right space-y-1 hidden md:block">
                          <div className="text-sm text-[#D0D0D0]">
                            <span className="text-white font-semibold">⭐ {coach.rating}</span> rating
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {coach.sessions} sessions • {coach.engagement}% engagement
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-[#181818] border-[#FF6B00]/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-[#FF6B00]" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white mb-2">5 Days in a Row 🔥</p>
                <p className="text-[#D0D0D0] text-sm">Keep it up! 2 more days for Silver streak badge.</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`bg-[#181818] border-[#FF6B00]/20 ${!achievement.earned ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-5xl">{achievement.icon}</div>
                      <h3 className="text-white font-semibold">{achievement.title}</h3>
                      <Badge className={getBadgeColor(achievement.badge)}>
                        {achievement.badge}
                      </Badge>
                      {achievement.earned && achievement.date && (
                        <>
                          <p className="text-sm text-muted-foreground">Earned {achievement.date}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-[#FF6B00]/40 hover:bg-[#FF6B00]/10"
                          >
                            <Share2 className="h-3 w-3 mr-2" />
                            Share Achievement
                          </Button>
                        </>
                      )}
                      {!achievement.earned && (
                        <p className="text-sm text-muted-foreground">Not yet earned</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
