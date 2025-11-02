import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, TrendingUp, DollarSign, Users, Target } from "lucide-react";
import { toast } from "sonner";
import { format, subWeeks, startOfWeek } from "date-fns";

const SPORTS = ["All Sports", "Football", "Cricket", "Tennis", "Basketball", "Badminton"];
const DATE_RANGES = ["Last 4 Weeks", "Last 8 Weeks", "Last 12 Weeks"];

export default function CoachAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [dateRange, setDateRange] = useState("Last 8 Weeks");
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    avgFormScore: 0,
    totalRevenue: 0,
    totalViews: 0,
  });

  useEffect(() => {
    fetchCoachProfile();
  }, []);

  useEffect(() => {
    if (coachId) {
      fetchAnalytics();
    }
  }, [coachId, selectedSport, dateRange]);

  const fetchCoachProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: coach, error } = await supabase
        .from("coaches")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (!coach) {
        navigate("/coach/onboarding");
        return;
      }

      setCoachId(coach.id);
    } catch (error) {
      console.error("Error fetching coach profile:", error);
      toast.error("Failed to load coach profile");
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const weeks = parseInt(dateRange.split(" ")[1]);
      const startDate = startOfWeek(subWeeks(new Date(), weeks));

      let query = supabase
        .from("coach_analytics")
        .select("*")
        .eq("coach_id", coachId)
        .gte("week_start", startDate.toISOString())
        .order("week_start", { ascending: true });

      if (selectedSport !== "All Sports") {
        query = query.eq("sport", selectedSport);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Format data for charts
      const formattedData = (data || []).map((item) => ({
        week: format(new Date(item.week_start), "MMM dd"),
        bookings: item.bookings_count,
        revenue: item.revenue_inr,
        formScore: Number(item.avg_form_score).toFixed(1),
        views: item.masterclass_views,
      }));

      setAnalytics(formattedData);

      // Calculate summary
      const summary = (data || []).reduce(
        (acc, item) => ({
          totalBookings: acc.totalBookings + item.bookings_count,
          avgFormScore: acc.avgFormScore + Number(item.avg_form_score),
          totalRevenue: acc.totalRevenue + item.revenue_inr,
          totalViews: acc.totalViews + item.masterclass_views,
        }),
        { totalBookings: 0, avgFormScore: 0, totalRevenue: 0, totalViews: 0 }
      );

      if (data && data.length > 0) {
        summary.avgFormScore = summary.avgFormScore / data.length;
      }

      setSummary(summary);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    toast.info("PDF export feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your coaching performance and growth</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-40 bg-card border-border text-foreground">
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
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="border-border hover:bg-accent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.totalBookings}
            </div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.avgFormScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Form Score</div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              ₹{summary.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.totalViews}
            </div>
            <div className="text-sm text-muted-foreground">Masterclass Views</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings Trend */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Booking Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#FF6B00"
                  strokeWidth={2}
                  dot={{ fill: "#FF6B00", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#FF6B00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {analytics.length === 0 && (
          <Card className="bg-card border-border p-12 text-center mt-6">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No analytics data yet</h3>
            <p className="text-muted-foreground">
              Start coaching sessions to see your performance metrics
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
