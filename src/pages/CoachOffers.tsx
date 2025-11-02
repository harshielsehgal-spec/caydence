import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Edit, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OfferFormModal } from "@/components/OfferFormModal";
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

const CoachOffers = () => {
  const navigate = useNavigate();
  const [coachId, setCoachId] = useState<string | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
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

      const { data: offersData, error: offersError } = await supabase
        .from("offers")
        .select("*")
        .eq("coach_id", coach.id)
        .order("created_at", { ascending: false });

      if (offersError) throw offersError;
      setOffers(offersData || []);
    } catch (error: any) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingOffer(null);
    setModalOpen(true);
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setModalOpen(true);
  };

  const handleDuplicate = async (offer: any) => {
    if (!coachId) return;

    try {
      const { id, created_at, updated_at, ...offerData } = offer;
      const { error } = await supabase
        .from("offers")
        .insert({
          ...offerData,
          title: `${offer.title} (Copy)`,
          status: "draft",
        });

      if (error) throw error;
      toast.success("Offer duplicated");
      fetchOffers();
    } catch (error: any) {
      console.error("Error duplicating offer:", error);
      toast.error("Failed to duplicate offer");
    }
  };

  const handleToggleStatus = async (offer: any) => {
    try {
      const newStatus = offer.status === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("offers")
        .update({ status: newStatus })
        .eq("id", offer.id);

      if (error) throw error;
      toast.success(`Offer ${newStatus === "published" ? "published" : "unpublished"}`);
      fetchOffers();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (offerId: string) => {
    setOfferToDelete(offerId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;

    try {
      const { error } = await supabase
        .from("offers")
        .delete()
        .eq("id", offerToDelete);

      if (error) throw error;
      toast.success("Offer deleted");
      setDeleteDialogOpen(false);
      fetchOffers();
    } catch (error: any) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
              My Offers
            </h1>
            <p className="text-coolGray mt-2">Create and manage your coaching services</p>
          </div>
          <Button variant="glow" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Offer
          </Button>
        </div>

        {offers.length === 0 ? (
          <Card className="bg-charcoal/80 border-vibrantOrange/30">
            <CardContent className="pt-6">
              <p className="text-coolGray text-center">
                No offers yet. Create your first coaching offer to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="bg-charcoal/80 border-vibrantOrange/30 hover:border-vibrantOrange/60 transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-white font-heading text-lg mb-2">
                        {offer.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className={
                            offer.status === "published"
                              ? "border-vibrantOrange text-vibrantOrange"
                              : "border-gray-500 text-gray-400"
                          }
                        >
                          {offer.status}
                        </Badge>
                        <Badge variant="outline" className="border-border text-coolGray">
                          {offer.sport}
                        </Badge>
                        <Badge variant="outline" className="border-border text-coolGray">
                          {offer.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-coolGray">{offer.description || "No description"}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coolGray">Price:</span>
                    <span className="text-white font-medium">₹{offer.price_inr}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coolGray">Duration:</span>
                    <span className="text-white">{offer.duration_min} min</span>
                  </div>

                  <div className="flex flex-wrap gap-1 text-xs">
                    {offer.mode.map((m: string) => (
                      <Badge key={m} variant="outline" className="border-border text-coolGray">
                        {m}
                      </Badge>
                    ))}
                  </div>

                  {offer.includes_ai_check && (
                    <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                      ✓ AI Form Check
                    </Badge>
                  )}

                  <div className="pt-3 flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(offer)}
                    >
                      {offer.status === "published" ? (
                        <><EyeOff className="h-3 w-3 mr-1" /> Unpublish</>
                      ) : (
                        <><Eye className="h-3 w-3 mr-1" /> Publish</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(offer)}
                    >
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(offer)}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(offer.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {coachId && (
        <OfferFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          coachId={coachId}
          offer={editingOffer}
          onSuccess={fetchOffers}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-charcoal border-vibrantOrange/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Offer</AlertDialogTitle>
            <AlertDialogDescription className="text-coolGray">
              Are you sure you want to delete this offer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-charcoal/60 text-white border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoachOffers;
