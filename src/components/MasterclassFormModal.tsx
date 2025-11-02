import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MasterclassFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coachId: string;
  masterclass?: any;
  onSuccess: () => void;
}

const SPORTS = ["Football", "Cricket", "Tennis", "Basketball", "Badminton"];
const MODES = ["live", "recorded"];
const TAGS_OPTIONS = ["Pro Tips", "Fitness Drills", "Technique Breakdown", "Mental Game", "Strategy"];

export const MasterclassFormModal = ({ 
  open, 
  onOpenChange, 
  coachId,
  masterclass,
  onSuccess 
}: MasterclassFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: masterclass?.title || "",
    sport: masterclass?.sport || "",
    mode: masterclass?.mode || "live",
    price_inr: masterclass?.price_inr || 0,
    duration_min: masterclass?.duration_min || 60,
    seats: masterclass?.seats || 30,
    description: masterclass?.description || "",
    video_url: masterclass?.video_url || "",
    trailer_url: masterclass?.trailer_url || "",
    scheduled_at: masterclass?.scheduled_at?.split('T')[0] || "",
    tags: masterclass?.tags || [],
  });

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter((t: string) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        coach_id: coachId,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
      };

      if (masterclass) {
        const { error } = await supabase
          .from("masterclasses")
          .update(payload)
          .eq("id", masterclass.id);

        if (error) throw error;
        toast.success("Masterclass updated successfully");
      } else {
        const { error } = await supabase
          .from("masterclasses")
          .insert([payload]);

        if (error) throw error;
        toast.success("Masterclass created successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving masterclass:", error);
      toast.error("Failed to save masterclass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {masterclass ? "Edit Masterclass" : "Create New Masterclass"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Advanced Dribbling Techniques"
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sport" className="text-foreground">Sport</Label>
              <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode" className="text-foreground">Mode</Label>
              <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_inr" className="text-foreground">Price (₹)</Label>
              <Input
                id="price_inr"
                type="number"
                value={formData.price_inr}
                onChange={(e) => setFormData({ ...formData, price_inr: parseInt(e.target.value) })}
                min="0"
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_min" className="text-foreground">Duration (min)</Label>
              <Input
                id="duration_min"
                type="number"
                value={formData.duration_min}
                onChange={(e) => setFormData({ ...formData, duration_min: parseInt(e.target.value) })}
                min="15"
                step="15"
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats" className="text-foreground">Seats</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                min="1"
                required
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_at" className="text-foreground">Scheduled Date (optional)</Label>
            <Input
              id="scheduled_at"
              type="date"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn..."
              rows={3}
              className="bg-background border-border text-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {TAGS_OPTIONS.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.tags.includes(tag) 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "border-border text-foreground hover:border-primary"
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {formData.tags.includes(tag) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video_url" className="text-foreground">Video URL (optional)</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://..."
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailer_url" className="text-foreground">Trailer URL (optional)</Label>
              <Input
                id="trailer_url"
                type="url"
                value={formData.trailer_url}
                onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                placeholder="https://..."
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Saving..." : masterclass ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
