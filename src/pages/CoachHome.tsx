import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Calendar, Star, DollarSign, 
  Plus, Clock, MessageSquare, ArrowLeft, TrendingUp, Video 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleSwitch } from "@/components/RoleSwitch";
import { TryAnalysisWidget } from "@/components/TryAnalysisWidget";

const CoachHome = () => {
  const navigate = useNavigate();
  const [coachData, setCoachData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { roles, currentRole, switchRole } = useUserRole(user);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("coaches")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            navigate("/coach/onboarding");
            return;
          }
          throw error;
        }

        setCoachData(data);
      } catch (error: any) {
        console.error("Error fetching coach data:", error);
        toast.error("Failed to load coach profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [navigate]);

  const handleRoleSwitch = (role: "athlete" | "coach") => {
    switchRole(role);
    if (role === "athlete") {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const kpis = [
    { 
      label: "New Leads", 
      value: "12", 
      icon: Users, 
      color: "text-vibrantOrange",
      subtitle: "This week" 
    },
    { 
      label: "Upcoming Sessions", 
      value: "8", 
      icon: Calendar, 
      color: "text-blue-400",
      subtitle: "Next 7 days" 
    },
    { 
      label: "Avg Rating", 
      value: coachData?.rating?.toFixed(1) || "0.0", 
      icon: Star, 
      color: "text-yellow-400",
      subtitle: `${coachData?.reviews_count || 0} reviews` 
    },
    { 
      label: "Earnings", 
      value: "₹24,500", 
      icon: DollarSign, 
      color: "text-green-400",
      subtitle: "This month" 
    },
  ];

  const quickActions = [
    { 
      label: "Create Offer", 
      icon: Plus, 
      onClick: () => navigate("/coach/offers"),
      variant: "glow" as const
    },
    { 
      label: "Set Availability", 
      icon: Clock, 
      onClick: () => navigate("/coach/calendar"),
      variant: "outline" as const
    },
    { 
      label: "View Sessions", 
      icon: MessageSquare, 
      onClick: () => navigate("/coach/sessions"),
      variant: "outline" as const
    },
    { 
      label: "Masterclasses", 
      icon: Video, 
      onClick: () => navigate("/coach/masterclasses"),
      variant: "outline" as const
    },
    { 
      label: "Leaderboard", 
      icon: TrendingUp, 
      onClick: () => navigate("/coach/leaderboard"),
      variant: "outline" as const
    },
    { 
      label: "Analytics", 
      icon: TrendingUp, 
      onClick: () => navigate("/coach/analytics"),
      variant: "outline" as const
    },
  ];

  const recentActivity = [
    { type: "booking", text: "New session booked by Rahul K.", time: "2 hours ago" },
    { type: "review", text: "Priya S. left a 5-star review", time: "5 hours ago" },
    { type: "payout", text: "₹5,000 payout processed", time: "1 day ago" },
    { type: "booking", text: "Session completed with Amit P.", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="mb-3 text-coolGray hover:text-white -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Welcome back, {coachData?.name || "Coach"}!
            </h1>
            <p className="text-coolGray mt-2">Here's what's happening with your coaching business</p>
          </div>
          <div className="flex items-center gap-4">
            {coachData?.verified && (
              <div className="flex items-center gap-2 px-4 py-2 bg-vibrantOrange/20 border border-vibrantOrange rounded-full">
                <div className="h-2 w-2 bg-vibrantOrange rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Verified Coach</span>
              </div>
            )}
            <RoleSwitch 
              roles={roles} 
              currentRole={currentRole} 
              onSwitch={handleRoleSwitch}
            />
          </div>
        </div>

        {/* Try Analysis Widget */}
        <TryAnalysisWidget userRole="coach" />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card 
              key={index} 
              className="bg-charcoal/80 border-vibrantOrange/30 hover:border-vibrantOrange/60 transition-smooth hover:shadow-orange-glow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-coolGray text-sm mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold text-white font-heading">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                  </div>
                  <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-charcoal/80 border-vibrantOrange/30">
          <CardHeader>
            <CardTitle className="text-white font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant}
                  className="h-auto py-4 flex-col gap-2"
                >
                  <action.icon className="h-6 w-6" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-charcoal/80 border-vibrantOrange/30">
          <CardHeader>
            <CardTitle className="text-white font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-charcoal/40 border border-border hover:border-vibrantOrange/30 transition-smooth"
                >
                  <div className="h-2 w-2 bg-vibrantOrange rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachHome;
