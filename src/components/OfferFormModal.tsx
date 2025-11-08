import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface OfferFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coachId: string;
  offer?: any;
  onSuccess: () => void;
}

const SPORTS = ["Cricket", "Football", "Basketball", "Tennis", "Badminton", "Athletics"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MODES = ["Online", "Offline", "Hybrid"];

const offerSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  sport: z.string().min(1, "Sport is required"),
  level: z.string().min(1, "Level is required"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  price_inr: z.number().min(0, "Price must be positive").max(100000, "Price must be less than ₹1,00,000"),
  duration_min: z.number().min(15, "Duration must be at least 15 minutes").max(480, "Duration must be less than 8 hours"),
  slots_per_week: z.number().min(1, "At least 1 slot per week required").max(50, "Maximum 50 slots per week"),
  mode: z.array(z.string()).min(1, "At least one mode must be selected"),
});

export function OfferFormModal({ open, onOpenChange, coachId, offer, onSuccess }: OfferFormModalProps) {
  const [title, setTitle] = useState(offer?.title || "");
  const [sport, setSport] = useState(offer?.sport || "");
  const [level, setLevel] = useState(offer?.level || "");
  const [description, setDescription] = useState(offer?.description || "");
  const [priceInr, setPriceInr] = useState(offer?.price_inr || "");
  const [durationMin, setDurationMin] = useState(offer?.duration_min || 60);
  const [slotsPerWeek, setSlotsPerWeek] = useState(offer?.slots_per_week || 1);
  const [selectedModes, setSelectedModes] = useState<string[]>(offer?.mode || []);
  const [includesAiCheck, setIncludesAiCheck] = useState(offer?.includes_ai_check || false);
  const [loading, setLoading] = useState(false);

  const handleModeToggle = (mode: string) => {
    setSelectedModes(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setLoading(true);
    try {
      // Validate input data
      const validationResult = offerSchema.safeParse({
        title,
        sport,
        level,
        description,
        price_inr: parseInt(priceInr),
        duration_min: durationMin,
        slots_per_week: slotsPerWeek,
        mode: selectedModes,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      const offerData = {
        coach_id: coachId,
        title: validationResult.data.title,
        sport: validationResult.data.sport,
        level: validationResult.data.level,
        description: validationResult.data.description || "",
        price_inr: validationResult.data.price_inr,
        duration_min: validationResult.data.duration_min,
        slots_per_week: validationResult.data.slots_per_week,
        mode: validationResult.data.mode,
        includes_ai_check: includesAiCheck,
        status,
      };

      if (offer) {
        const { error } = await supabase
          .from("offers")
          .update(offerData)
          .eq("id", offer.id);
        
        if (error) throw error;
        toast.success("Offer updated successfully");
      } else {
        const { error } = await supabase
          .from("offers")
          .insert([offerData]);
        
        if (error) throw error;
        toast.success(`Offer ${status === "published" ? "published" : "saved as draft"} successfully`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Error saving offer:", error);
      toast.error("Failed to save offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-charcoal border-vibrantOrange/30">
        <DialogHeader>
          <DialogTitle className="text-white font-heading text-2xl">
            {offer ? "Edit Offer" : "Create New Offer"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dribbling Control – 45 min"
              className="bg-charcoal/60 border-vibrantOrange/30 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sport" className="text-white">Sport *</Label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className="bg-charcoal/60 border-vibrantOrange/30 text-white">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-white">Level *</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="bg-charcoal/60 border-vibrantOrange/30 text-white">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Mode *</Label>
            <div className="flex gap-4">
              {MODES.map((mode) => (
                <div key={mode} className="flex items-center space-x-2">
                  <Checkbox
                    id={mode}
                    checked={selectedModes.includes(mode)}
                    onCheckedChange={() => handleModeToggle(mode)}
                  />
                  <Label htmlFor={mode} className="text-coolGray cursor-pointer">
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={priceInr}
                onChange={(e) => setPriceInr(e.target.value)}
                className="bg-charcoal/60 border-vibrantOrange/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration (min) *</Label>
              <Input
                id="duration"
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value))}
                className="bg-charcoal/60 border-vibrantOrange/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slots" className="text-white">Slots/Week *</Label>
              <Input
                id="slots"
                type="number"
                value={slotsPerWeek}
                onChange={(e) => setSlotsPerWeek(parseInt(e.target.value))}
                className="bg-charcoal/60 border-vibrantOrange/30 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (2 lines)"
              rows={2}
              className="bg-charcoal/60 border-vibrantOrange/30 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ai-check"
              checked={includesAiCheck}
              onCheckedChange={setIncludesAiCheck}
            />
            <Label htmlFor="ai-check" className="text-coolGray cursor-pointer">
              Includes AI form check
            </Label>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button
            variant="glow"
            onClick={() => handleSubmit("published")}
            disabled={loading}
          >
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
