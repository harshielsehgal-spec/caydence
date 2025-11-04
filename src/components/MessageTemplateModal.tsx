import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Check, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const messageTemplates = [
  {
    id: "form_dip",
    title: "Form Dip Detected",
    template: (name: string) => 
      `Hi ${name},\n\nI noticed a dip in your recent form metrics. I've assigned some targeted drills that should help you get back on track. Let's focus on quality over quantity this week!\n\nKeep pushing! 💪`,
  },
  {
    id: "inactive",
    title: "Inactivity Check-in",
    template: (name: string) =>
      `Hey ${name}!\n\nI haven't seen you active in a while. No worries – I've prepared a 10-minute reset routine to help you ease back in. Sometimes all we need is a quick refresh!\n\nLooking forward to seeing you back in action! 🔥`,
  },
  {
    id: "pre_session",
    title: "Pre-Session Checklist",
    template: (name: string) =>
      `Hi ${name},\n\nExcited for our session today! Here's a quick checklist:\n\n✓ Hydrate well\n✓ Do a 5-min warmup\n✓ Review the drills I assigned\n✓ Come ready to work!\n\nSee you soon! 🎯`,
  },
  {
    id: "progress",
    title: "Progress Recognition",
    template: (name: string) =>
      `Amazing work, ${name}! 🌟\n\nI've been tracking your progress and the improvement is clear. Your consistency is paying off. Keep up the great work – you're on the right path!\n\nLet's keep this momentum going!`,
  },
];

interface MessageTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  athlete: {
    id: string;
    name: string;
    sport: string;
  };
  badges: Array<{ text: string; variant: string }>;
}

export const MessageTemplateModal = ({ 
  open, 
  onOpenChange, 
  athlete,
  badges 
}: MessageTemplateModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.template(athlete.name));
    }
  };

  const handleSend = () => {
    // Store message (mock)
    const messageData = {
      athleteId: athlete.id,
      athleteName: athlete.name,
      timestamp: new Date().toISOString(),
      message,
      template: selectedTemplate,
    };
    
    // Store in localStorage
    const existingMessages = JSON.parse(localStorage.getItem("coachMessages") || "[]");
    localStorage.setItem("coachMessages", JSON.stringify([...existingMessages, messageData]));
    
    setSent(true);
    toast.success(`Message sent to ${athlete.name}`);
    
    // Reset and close after delay
    setTimeout(() => {
      setMessage("");
      setSelectedTemplate(null);
      setSent(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-charcoal border-vibrantOrange/30">
        <DialogHeader>
          <DialogTitle className="text-white font-heading text-2xl">
            Message {athlete.name}
          </DialogTitle>
          <DialogDescription className="text-coolGray">
            Choose a template or write your own message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Template Selection */}
          <div>
            <p className="text-sm text-coolGray mb-3 font-medium">Quick Templates</p>
            <div className="grid grid-cols-2 gap-3">
              {messageTemplates.map((template) => (
                <Card
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`p-4 cursor-pointer transition-smooth ${
                    selectedTemplate === template.id
                      ? "bg-vibrantOrange/20 border-vibrantOrange"
                      : "bg-charcoal/60 border-border hover:border-vibrantOrange/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{template.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.template(athlete.name).slice(0, 50)}...
                      </p>
                    </div>
                    {selectedTemplate === template.id && (
                      <Check className="h-4 w-4 text-vibrantOrange flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Message Editor */}
          <div>
            <p className="text-sm text-coolGray mb-2 font-medium">Message</p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className="bg-charcoal/60 border-border focus:border-vibrantOrange text-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sent}
            >
              Cancel
            </Button>
            <Button
              variant="glow"
              onClick={handleSend}
              disabled={!message.trim() || sent}
            >
              {sent ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Sent!
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
