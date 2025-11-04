import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Video, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TryAnalysisWidgetProps {
  userRole: "athlete" | "coach";
}

export const TryAnalysisWidget = ({ userRole }: TryAnalysisWidgetProps) => {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const navigate = useNavigate();

  const mockCoaches = [
    { id: "c1", name: "Rajesh Kumar", sport: "Cricket", rating: 4.8, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
    { id: "c2", name: "Priya Sharma", sport: "Football", rating: 4.9, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
    { id: "c3", name: "Amit Patel", sport: "Basketball", rating: 4.7, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  ];

  const mockMetrics = {
    posture: 72,
    balance: 68,
    cadence: 74,
  };

  const handleUpload = () => {
    toast.success("Upload feature coming soon!");
  };

  const handleRecord = () => {
    toast.success("Recording feature coming soon!");
  };

  const handleChooseCoach = () => {
    setSelectedCoach(mockCoaches[0]);
    setShowComparison(true);
  };

  const handleBookCoach = () => {
    if (selectedCoach) {
      navigate(`/coach/${selectedCoach.id}`);
    }
  };

  const handleSaveFeedback = () => {
    toast.success("Feedback saved to session notes!");
    setShowComparison(false);
  };

  return (
    <>
      <Card className="bg-charcoal border-vibrantOrange/20 shadow-orange-glow/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-poppins">
            <Video className="h-5 w-5 text-vibrantOrange" />
            Try Analysis (AI)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-coolGray">
            {userRole === "athlete" 
              ? "Compare your form with a coach's reference clip and get instant feedback."
              : "Upload an athlete's clip and compare it with your reference technique."}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleRecord}
              variant="outline"
              size="sm"
              className="flex-1 border-vibrantOrange/30 hover:bg-vibrantOrange/10"
            >
              <Video className="h-4 w-4 mr-2" />
              Record
            </Button>
            <Button
              onClick={handleUpload}
              variant="outline"
              size="sm"
              className="flex-1 border-vibrantOrange/30 hover:bg-vibrantOrange/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <Button
            onClick={handleChooseCoach}
            variant="default"
            size="sm"
            className="w-full bg-vibrantOrange hover:bg-vibrantOrange/90"
          >
            <Search className="h-4 w-4 mr-2" />
            {userRole === "athlete" ? "Choose Coach Reference" : "Choose Reference Clip"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl bg-charcoal border-vibrantOrange/30">
          <DialogHeader>
            <DialogTitle className="text-white font-poppins">Analysis Comparison</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Side-by-side video comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-coolGray">
                  {userRole === "athlete" ? "Your Form" : "Athlete Clip"}
                </p>
                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-vibrantOrange/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-16 w-16 text-vibrantOrange/30" />
                  </div>
                  {/* Pose overlay mock */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                    <circle cx="200" cy="80" r="15" fill="none" stroke="#FF6B00" strokeWidth="2" />
                    <line x1="200" y1="95" x2="200" y2="150" stroke="#FF6B00" strokeWidth="2" />
                    <line x1="200" y1="110" x2="170" y2="130" stroke="#FF6B00" strokeWidth="2" />
                    <line x1="200" y1="110" x2="230" y2="130" stroke="#FF6B00" strokeWidth="2" />
                    <line x1="200" y1="150" x2="170" y2="200" stroke="#FF6B00" strokeWidth="2" />
                    <line x1="200" y1="150" x2="230" y2="200" stroke="#FF6B00" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-coolGray">
                  {userRole === "athlete" ? "Coach Reference" : "Reference Technique"}
                </p>
                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-emerald-500/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500/30" />
                  </div>
                  {/* Reference pose overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                    <circle cx="200" cy="80" r="15" fill="none" stroke="#10b981" strokeWidth="2" />
                    <line x1="200" y1="95" x2="200" y2="150" stroke="#10b981" strokeWidth="2" />
                    <line x1="200" y1="110" x2="170" y2="135" stroke="#10b981" strokeWidth="2" />
                    <line x1="200" y1="110" x2="230" y2="135" stroke="#10b981" strokeWidth="2" />
                    <line x1="200" y1="150" x2="170" y2="210" stroke="#10b981" strokeWidth="2" />
                    <line x1="200" y1="150" x2="230" y2="210" stroke="#10b981" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Metrics comparison */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-charcoal to-black border-vibrantOrange/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-coolGray">Posture</p>
                    <p className="text-3xl font-bold text-white">{mockMetrics.posture}</p>
                    <p className="text-xs text-orange-400">-8 vs reference</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-charcoal to-black border-vibrantOrange/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-coolGray">Balance</p>
                    <p className="text-3xl font-bold text-white">{mockMetrics.balance}</p>
                    <p className="text-xs text-orange-400">-12 vs reference</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-charcoal to-black border-vibrantOrange/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-coolGray">Cadence</p>
                    <p className="text-3xl font-bold text-white">{mockMetrics.cadence}</p>
                    <p className="text-xs text-orange-400">-6 vs reference</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action button */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowComparison(false)}
                variant="outline"
                className="border-vibrantOrange/30"
              >
                Close
              </Button>
              {userRole === "athlete" ? (
                <Button
                  onClick={handleBookCoach}
                  className="bg-vibrantOrange hover:bg-vibrantOrange/90"
                >
                  Book this Coach
                </Button>
              ) : (
                <Button
                  onClick={handleSaveFeedback}
                  className="bg-vibrantOrange hover:bg-vibrantOrange/90"
                >
                  Save as Feedback
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
