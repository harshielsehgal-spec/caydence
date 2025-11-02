import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const currentChallenge = {
  id: "dribble-week45",
  sport: "Football",
  metric: "dribbleAccuracy",
  name: "Dribble Accuracy Challenge – Week 45",
  goal: "Complete 10 perfect dribbles in a row",
  leaderboard: [
    { rank: 1, name: "Aditi Sharma", score: 95, improvement: 12 },
    { rank: 2, name: "Arjun Patel", score: 89, improvement: 9 },
    { rank: 3, name: "Harshiel Sehgal", score: 87, improvement: 7 },
    { rank: 4, name: "Priya Reddy", score: 82, improvement: 5 },
    { rank: 5, name: "Rohan Kumar", score: 78, improvement: 3 },
    { rank: 6, name: "Neha Singh", score: 75, improvement: 2 },
    { rank: 7, name: "Vikram Shah", score: 72, improvement: 1 },
    { rank: 8, name: "Ananya Iyer", score: 68, improvement: -1 },
  ],
};

const pastChallenges = [
  { id: "sprint-week44", name: "Sprint Speed Challenge – Week 44", sport: "Athletics" },
  { id: "shooting-week43", name: "Free Throw Challenge – Week 43", sport: "Basketball" },
  { id: "serve-week42", name: "Serve Accuracy Challenge – Week 42", sport: "Tennis" },
];

const AthleteChallenges = () => {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  const handleJoinChallenge = () => {
    setJoined(true);
    toast({
      title: "Challenge Joined!",
      description: "You're now competing in this week's challenge. Good luck!",
    });
  };

  const getRankGlow = (rank: number) => {
    if (rank === 1) return "shadow-[0_0_20px_rgba(255,215,0,0.4)] bg-gradient-to-r from-yellow-500/10 to-yellow-600/10";
    if (rank === 2) return "shadow-[0_0_20px_rgba(192,192,192,0.4)] bg-gradient-to-r from-gray-400/10 to-gray-500/10";
    if (rank === 3) return "shadow-[0_0_20px_rgba(205,127,50,0.4)] bg-gradient-to-r from-amber-700/10 to-amber-800/10";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Challenge Mode</h1>
            <p className="text-[#D0D0D0] mt-1">Compete with athletes nationwide</p>
          </div>
        </div>

        {/* Current Challenge Card */}
        <Card className="bg-[#181818] border-none p-6 md:p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm text-[#D0D0D0]">{currentChallenge.sport}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentChallenge.name}</h2>
              <p className="text-[#D0D0D0] text-lg">Goal: {currentChallenge.goal}</p>
            </div>
          </div>

          <Button
            onClick={handleJoinChallenge}
            disabled={joined}
            className="w-full md:w-auto"
            variant={joined ? "secondary" : "glow"}
          >
            {joined ? "Challenge Joined ✓" : "Join Challenge"}
          </Button>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-[#181818] border-none p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold">Leaderboard</h3>
            <Select defaultValue="current">
              <SelectTrigger className="w-[200px] bg-[#0D0D0D] border-white/10">
                <SelectValue placeholder="Select challenge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">{currentChallenge.name}</SelectItem>
                {pastChallenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-[#D0D0D0]">Rank</TableHead>
                  <TableHead className="text-[#D0D0D0]">Athlete</TableHead>
                  <TableHead className="text-[#D0D0D0] text-right">Score</TableHead>
                  <TableHead className="text-[#D0D0D0] text-right">Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentChallenge.leaderboard.map((entry) => (
                  <TableRow
                    key={entry.rank}
                    className={`border-white/10 transition-all ${getRankGlow(entry.rank)}`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {entry.rank === 1 && <span className="text-yellow-500">🥇</span>}
                        {entry.rank === 2 && <span className="text-gray-400">🥈</span>}
                        {entry.rank === 3 && <span className="text-amber-700">🥉</span>}
                        <span className={entry.rank <= 3 ? "font-bold" : ""}>
                          #{entry.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={entry.rank <= 3 ? "font-semibold" : ""}>
                      {entry.name}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{entry.score}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {entry.improvement > 0 && (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">+{entry.improvement}%</span>
                          </>
                        )}
                        {entry.improvement === 0 && (
                          <span className="text-[#D0D0D0]">{entry.improvement}%</span>
                        )}
                        {entry.improvement < 0 && (
                          <span className="text-red-500">{entry.improvement}%</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AthleteChallenges;
