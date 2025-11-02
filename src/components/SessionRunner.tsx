import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle2, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Drill {
  id: string;
  title: string;
  timeSec?: number;
  reps?: number;
}

interface SessionRunnerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistTitle: string;
  drills: Drill[];
  onComplete: () => void;
}

export const SessionRunner = ({ open, onOpenChange, playlistTitle, drills, onComplete }: SessionRunnerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(drills[0]?.timeSec || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentDrill = drills[currentStep];

  useEffect(() => {
    if (open && currentDrill?.timeSec) {
      setTimeLeft(currentDrill.timeSec);
      setIsRunning(false);
    }
  }, [currentStep, open, currentDrill]);

  useEffect(() => {
    if (!isRunning || !currentDrill?.timeSec) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentDrill]);

  const handleNext = () => {
    if (currentStep < drills.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsRunning(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsRunning(false);
    }
  };

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
    setCurrentStep(0);
    setCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl">{playlistTitle}</DialogTitle>
        </DialogHeader>

        {!completed ? (
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 font-montserrat">
                <span>Drill {currentStep + 1} of {drills.length}</span>
                <span>{Math.round(((currentStep + 1) / drills.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentStep + 1) / drills.length) * 100} className="h-2" />
            </div>

            {/* Current Drill */}
            <Card className="bg-secondary/30 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 font-poppins">{currentDrill?.title}</h3>
                
                {currentDrill?.timeSec && (
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="text-6xl font-bold text-primary font-poppins">
                      {formatTime(timeLeft)}
                    </div>
                    <Button
                      size="lg"
                      onClick={() => setIsRunning(!isRunning)}
                      className="w-40"
                      disabled={timeLeft === 0}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          {timeLeft === 0 ? "Done" : "Start"}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {currentDrill?.reps && (
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-primary mb-2 font-poppins">
                      {currentDrill.reps}
                    </div>
                    <div className="text-muted-foreground font-montserrat">repetitions</div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-montserrat">
                  {currentDrill?.timeSec && <span>⏱️ Time-based</span>}
                  {currentDrill?.reps && <span>🔢 Rep-based</span>}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 shadow-orange-glow"
              >
                {currentStep === drills.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 font-poppins">Session Complete! 🎉</h3>
              <p className="text-muted-foreground font-montserrat">
                Great job completing {playlistTitle}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={handleComplete} className="shadow-orange-glow">
                Mark Complete
              </Button>
            </div>
            <Card className="bg-secondary/30 border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground font-montserrat">
                  💡 Run a quick form check to see your progress?
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  AI Form Check (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
