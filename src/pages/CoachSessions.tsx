import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const CoachSessions = () => {
  const navigate = useNavigate();
  const [coachId, setCoachId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: coach, error: coachError } = await supabase
        .from("coaches")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (coachError) throw coachError;
      setCoachId(coach.id);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select(`
          *,
          offers (title, sport, mode)
        `)
        .eq("coach_id", coach.id)
        .order("start_time", { ascending: true });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ status: "upcoming" })
        .eq("id", sessionId);

      if (error) throw error;
      toast.success("Session accepted");
      fetchData();
    } catch (error: any) {
      console.error("Error accepting session:", error);
      toast.error("Failed to accept session");
    }
  };

  const handleDeclineClick = (session: any) => {
    setSelectedSession(session);
    setDeclineReason("");
    setDeclineDialogOpen(true);
  };

  const handleDeclineConfirm = async () => {
    if (!selectedSession) return;

    try {
      const { error } = await supabase
        .from("sessions")
        .update({
          status: "declined",
          coach_decline_reason: declineReason || "No reason provided",
        })
        .eq("id", selectedSession.id);

      if (error) throw error;
      toast.success("Session declined");
      setDeclineDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error declining session:", error);
      toast.error("Failed to decline session");
    }
  };

  const renderSessionCard = (session: any) => (
    <Card key={session.id} className="bg-charcoal/80 border-vibrantOrange/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-white font-heading text-lg">{session.offers.title}</h3>
              <p className="text-coolGray text-sm">{session.offers.sport}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-coolGray text-sm">
                <Calendar className="h-4 w-4 text-vibrantOrange" />
                {format(new Date(session.start_time), "PPP")}
              </div>
              <div className="flex items-center gap-2 text-coolGray text-sm">
                <Clock className="h-4 w-4 text-vibrantOrange" />
                {format(new Date(session.start_time), "p")} - {format(new Date(session.end_time), "p")}
              </div>
              <div className="flex items-center gap-2 text-coolGray text-sm">
                <MapPin className="h-4 w-4 text-vibrantOrange" />
                {session.mode}
              </div>
            </div>

            {session.athlete_notes && (
              <div className="mt-3 p-3 bg-charcoal/40 rounded border border-border">
                <p className="text-xs text-coolGray mb-1">Athlete Notes:</p>
                <p className="text-white text-sm">{session.athlete_notes}</p>
              </div>
            )}
          </div>

          {session.status === "pending" && (
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="glow"
                size="sm"
                onClick={() => handleAccept(session.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeclineClick(session)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const pendingSessions = sessions.filter(s => s.status === "pending");
  const upcomingSessions = sessions.filter(s => s.status === "upcoming");
  const completedSessions = sessions.filter(s => s.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/coach/home")}
          className="mb-6 text-coolGray hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
            My Sessions
          </h1>
          <p className="text-coolGray mt-2">Manage your coaching session requests</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-charcoal/80 border border-vibrantOrange/30">
            <TabsTrigger value="pending" className="data-[state=active]:bg-vibrantOrange">
              Pending ({pendingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-vibrantOrange">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-vibrantOrange">
              Completed ({completedSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingSessions.length === 0 ? (
              <Card className="bg-charcoal/80 border-vibrantOrange/30">
                <CardContent className="pt-6">
                  <p className="text-coolGray text-center">No pending session requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingSessions.map(renderSessionCard)
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card className="bg-charcoal/80 border-vibrantOrange/30">
                <CardContent className="pt-6">
                  <p className="text-coolGray text-center">No upcoming sessions</p>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map(renderSessionCard)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length === 0 ? (
              <Card className="bg-charcoal/80 border-vibrantOrange/30">
                <CardContent className="pt-6">
                  <p className="text-coolGray text-center">No completed sessions</p>
                </CardContent>
              </Card>
            ) : (
              completedSessions.map(renderSessionCard)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <AlertDialogContent className="bg-charcoal border-vibrantOrange/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Decline Session Request</AlertDialogTitle>
            <AlertDialogDescription className="text-coolGray">
              Would you like to provide a reason for declining? (Optional)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Reason for declining (optional)"
            className="bg-charcoal/60 border-vibrantOrange/30 text-white"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-charcoal/60 text-white border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeclineConfirm}
              className="bg-vibrantOrange text-white hover:bg-vibrantOrange/80"
            >
              Confirm Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoachSessions;
