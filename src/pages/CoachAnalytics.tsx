import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, TrendingUp, TrendingDown, Users, Star, Activity, Lightbulb, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Mock data structure as per requirements
const MOCK_ANALYTICS = {
  athletes: [
    { id: "A01", name: "Riya Patel", sport: "Football", balance: 78, posture: 72, cadence: 85, accuracy: 88, trend: +6 },
    { id: "A02", name: "Aditya Mehra", sport: "Cricket", balance: 84, posture: 76, cadence: 82, accuracy: 90, trend: +3 },
    { id: "A03", name: "Priya Singh", sport: "Football", balance: 92, posture: 88, cadence: 90, accuracy: 94, trend: +12 },
    { id: "A04", name: "Rahul Kumar", sport: "Tennis", balance: 68, posture: 65, cadence: 70, accuracy: 72, trend: -2 },
    { id: "A05", name: "Ananya Verma", sport: "Cricket", balance: 75, posture: 80, cadence: 78, accuracy: 85, trend: +8 },
  ],
  sessionsDelivered: 42,
  activeAthletes: 8,
  avgRating: 4.6,
  monthlyRevenue: [
    { month: "Sep", amount: 16000 },
    { month: "Oct", amount: 22000 },
    { month: "Nov", amount: 26500 },
  ],
};

// Generate athlete progress data for charts
const generateAthleteProgressData = (athlete: any) => [
  { metric: "Balance", score: athlete.balance, previous: athlete.balance - 8 },
  { metric: "Posture", score: athlete.posture, previous: athlete.posture - 6 },
  { metric: "Cadence", score: athlete.cadence, previous: athlete.cadence - 5 },
  { metric: "Accuracy", score: athlete.accuracy, previous: athlete.accuracy - 4 },
];

const SPORTS = ["All Sports", "Football", "Cricket", "Tennis"];
const DATE_RANGES = ["Last 4 Weeks", "Last 8 Weeks", "Last 12 Weeks"];
const METRICS = ["All Metrics", "Balance", "Posture", "Cadence", "Accuracy"];

export default function CoachAnalytics() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [dateRange, setDateRange] = useState("Last 8 Weeks");
  const [selectedMetric, setSelectedMetric] = useState("All Metrics");
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [athleteModalOpen, setAthleteModalOpen] = useState(false);

  // Filter athletes by sport
  const filteredAthletes = selectedSport === "All Sports"
    ? MOCK_ANALYTICS.athletes
    : MOCK_ANALYTICS.athletes.filter((a) => a.sport === selectedSport);

  // AI Insights based on data
  const aiInsights = [
    { 
      text: "3 athletes improved >10% this month", 
      type: "positive",
      icon: TrendingUp,
      color: "text-green-500"
    },
    { 
      text: "2 athletes show form inconsistency", 
      type: "warning",
      icon: TrendingDown,
      color: "text-yellow-500"
    },
    { 
      text: "Balance training showing strongest impact", 
      type: "insight",
      icon: Lightbulb,
      color: "text-primary"
    },
  ];

  // Calculate average improvement across metrics
  const athleteProgressData = filteredAthletes.map((athlete) => ({
    name: athlete.name.split(" ")[0],
    balance: athlete.balance,
    posture: athlete.posture,
    cadence: athlete.cadence,
    accuracy: athlete.accuracy,
  }));

  const handleExportPDF = () => {
    toast.success("Exporting analytics as PDF...", {
      description: "Your analytics report will download shortly",
    });
  };

  const handleAthleteClick = (athlete: any) => {
    setSelectedAthlete(athlete);
    setAthleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-secondary to-charcoal">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/coach/home")}
            className="mb-3 text-coolGray hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 font-heading">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track athlete progress and coaching performance</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-40 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRICS.map((metric) => (
                    <SelectItem key={metric} value={metric}>{metric}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="border-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Engagement Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border hover:border-primary/50 transition-smooth shadow-card hover:shadow-card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-primary" />
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 font-heading">
                {MOCK_ANALYTICS.sessionsDelivered}
              </div>
              <div className="text-sm text-muted-foreground">Sessions Delivered</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-smooth shadow-card hover:shadow-card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 font-heading">
                {MOCK_ANALYTICS.activeAthletes}
              </div>
              <div className="text-sm text-muted-foreground">Active Athletes</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-smooth shadow-card hover:shadow-card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 font-heading">
                {MOCK_ANALYTICS.avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Session Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-smooth shadow-card hover:shadow-card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 font-heading">
                ₹{MOCK_ANALYTICS.monthlyRevenue[MOCK_ANALYTICS.monthlyRevenue.length - 1].amount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">This Month Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <Card className="bg-card border-border mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground font-heading flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-smooth"
                >
                  <div className="flex items-start gap-3">
                    <insight.icon className={`h-6 w-6 ${insight.color} mt-0.5`} />
                    <p className="text-sm text-foreground">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Athlete Progress Overview */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">Athlete Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={athleteProgressData}>
                  <defs>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(16, 100%, 50%)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="hsl(25, 100%, 50%)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="name" stroke="hsl(0, 0%, 75%)" />
                  <YAxis stroke="hsl(0, 0%, 75%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(0, 0%, 20%)",
                      borderRadius: "8px",
                      color: "hsl(0, 0%, 100%)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="balance" fill="url(#orangeGradient)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="posture" fill="hsl(16, 100%, 50%)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="cadence" fill="hsl(25, 100%, 50%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Snapshot */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">Revenue Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={MOCK_ANALYTICS.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(16, 100%, 50%)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="hsl(25, 100%, 50%)" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="month" stroke="hsl(0, 0%, 75%)" />
                  <YAxis stroke="hsl(0, 0%, 75%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(0, 0%, 20%)",
                      borderRadius: "8px",
                      color: "hsl(0, 0%, 100%)",
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(18, 100%, 50%)"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{ fill: "hsl(18, 100%, 50%)", r: 6, strokeWidth: 2, stroke: "hsl(0, 0%, 8%)" }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Athletes List */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground font-heading">Athletes Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAthletes.map((athlete) => (
                <div
                  key={athlete.id}
                  onClick={() => handleAthleteClick(athlete)}
                  className="p-4 rounded-lg bg-secondary border border-border hover:border-primary cursor-pointer transition-smooth group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-foreground font-semibold group-hover:text-primary transition-smooth">
                        {athlete.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{athlete.sport}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${athlete.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {athlete.trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {athlete.trend > 0 ? '+' : ''}{athlete.trend}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Balance</p>
                      <p className="text-foreground font-semibold">{athlete.balance}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Posture</p>
                      <p className="text-foreground font-semibold">{athlete.posture}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cadence</p>
                      <p className="text-foreground font-semibold">{athlete.cadence}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="text-foreground font-semibold">{athlete.accuracy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Athlete Detail Modal */}
        <Dialog open={athleteModalOpen} onOpenChange={setAthleteModalOpen}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground font-heading">
                {selectedAthlete?.name} - Personal Progress
              </DialogTitle>
            </DialogHeader>
            {selectedAthlete && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="text-muted-foreground text-sm">Sport</p>
                    <p className="text-foreground font-semibold">{selectedAthlete.sport}</p>
                  </div>
                  <div className={`flex items-center gap-2 text-lg font-bold ${selectedAthlete.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedAthlete.trend > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    {selectedAthlete.trend > 0 ? '+' : ''}{selectedAthlete.trend}% Overall
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateAthleteProgressData(selectedAthlete)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                    <XAxis dataKey="metric" stroke="hsl(0, 0%, 75%)" />
                    <YAxis stroke="hsl(0, 0%, 75%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 8%)",
                        border: "1px solid hsl(0, 0%, 20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="previous" fill="hsl(0, 0%, 40%)" name="Previous" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="score" fill="hsl(18, 100%, 50%)" name="Current" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="text-foreground font-semibold mb-2">Comments</h4>
                  <p className="text-muted-foreground text-sm">
                    {selectedAthlete.trend > 0 
                      ? `Excellent progress! ${selectedAthlete.name} has shown consistent improvement across all metrics, particularly in balance and form accuracy.`
                      : `Needs attention. ${selectedAthlete.name} shows signs of form inconsistency. Recommend additional focus on fundamentals.`
                    }
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
