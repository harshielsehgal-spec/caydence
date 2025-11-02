import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MasterclassFormModal } from "@/components/MasterclassFormModal";
import { Plus, Video, Calendar, Users, DollarSign, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CoachMasterclasses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [masterclasses, setMasterclasses] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMasterclass, setSelectedMasterclass] = useState<any>(null);

  useEffect(() => {
    fetchCoachProfile();
  }, []);

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
      fetchMasterclasses(coach.id);
    } catch (error) {
      console.error("Error fetching coach profile:", error);
      toast.error("Failed to load coach profile");
      setLoading(false);
    }
  };

  const fetchMasterclasses = async (coachId: string) => {
    try {
      const { data, error } = await supabase
        .from("masterclasses")
        .select("*, masterclass_enrollments(count)")
        .eq("coach_id", coachId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMasterclasses(data || []);
    } catch (error) {
      console.error("Error fetching masterclasses:", error);
      toast.error("Failed to load masterclasses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this masterclass?")) return;

    try {
      const { error } = await supabase
        .from("masterclasses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Masterclass deleted");
      if (coachId) fetchMasterclasses(coachId);
    } catch (error) {
      console.error("Error deleting masterclass:", error);
      toast.error("Failed to delete masterclass");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("masterclasses")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Masterclass ${newStatus === "published" ? "published" : "unpublished"}`);
      if (coachId) fetchMasterclasses(coachId);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (masterclass: any) => {
    setSelectedMasterclass(masterclass);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    if (coachId) fetchMasterclasses(coachId);
    setSelectedMasterclass(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Masterclasses</h1>
            <p className="text-muted-foreground">Create and manage your coaching masterclasses</p>
          </div>
          <Button
            onClick={() => {
              setSelectedMasterclass(null);
              setFormOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Masterclass
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterclasses.map((masterclass) => (
            <Card key={masterclass.id} className="bg-card border-border overflow-hidden group">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant={masterclass.status === "published" ? "default" : "outline"}
                    className={masterclass.status === "published" ? "bg-primary/20 text-primary border-primary" : ""}
                  >
                    {masterclass.status}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/20">
                    {masterclass.mode}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                    {masterclass.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {masterclass.description || "No description"}
                  </p>
                </div>

                {masterclass.tags && masterclass.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {masterclass.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs border-border">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    ₹{masterclass.price_inr}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Video className="h-4 w-4 mr-1 text-primary" />
                    {masterclass.duration_min}min
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1 text-primary" />
                    {masterclass.enrolled_count}/{masterclass.seats}
                  </div>
                  {masterclass.scheduled_at && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1 text-primary" />
                      {format(new Date(masterclass.scheduled_at), "MMM dd")}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(masterclass)}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={masterclass.status === "published" ? "outline" : "default"}
                    onClick={() => handleToggleStatus(masterclass.id, masterclass.status)}
                    className={masterclass.status === "published" ? "border-border hover:bg-accent" : "bg-primary text-primary-foreground"}
                  >
                    {masterclass.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(masterclass.id)}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {masterclasses.length === 0 && (
          <Card className="bg-card border-border p-12 text-center">
            <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No masterclasses yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first masterclass to start sharing your expertise
            </p>
            <Button
              onClick={() => setFormOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Masterclass
            </Button>
          </Card>
        )}
      </div>

      {coachId && (
        <MasterclassFormModal
          open={formOpen}
          onOpenChange={setFormOpen}
          coachId={coachId}
          masterclass={selectedMasterclass}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
