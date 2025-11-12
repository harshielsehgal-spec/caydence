import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, TrendingUp, Activity, User } from "lucide-react";
import HeaderCoin from "@/components/HeaderCoin";

const MotionAnalysis = () => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setAnalyzing(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [analyzing]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="font-poppins"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <HeaderCoin />
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/profile")}
              className="font-poppins"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-poppins">
            AI Motion Analysis
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            Analyzing your form using Computer Vision
          </p>
        </div>

        {/* Video Frame Simulation */}
        <Card className="mb-6 shadow-card-hover overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-charcoal to-charcoal/80 flex items-center justify-center">
              {analyzing ? (
                <div className="text-center p-8">
                  <Camera className="h-16 w-16 text-white/50 mx-auto mb-4 animate-pulse-glow" />
                  <p className="text-white text-lg font-poppins mb-4">
                    Analyzing posture with Computer Vision...
                  </p>
                  <Progress value={progress} className="w-full max-w-md mx-auto" />
                  <p className="text-white/70 text-sm mt-2 font-montserrat">{progress}%</p>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  {/* Skeletal Overlay Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 600"
                      className="w-64 h-96"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Head */}
                      <circle cx="200" cy="80" r="30" fill="none" stroke="#D32F2F" strokeWidth="3" />
                      
                      {/* Body */}
                      <line x1="200" y1="110" x2="200" y2="280" stroke="#D32F2F" strokeWidth="3" />
                      
                      {/* Arms */}
                      <line x1="200" y1="150" x2="140" y2="220" stroke="#D32F2F" strokeWidth="3" />
                      <line x1="140" y1="220" x2="120" y2="280" stroke="#D32F2F" strokeWidth="3" />
                      <line x1="200" y1="150" x2="260" y2="220" stroke="#D32F2F" strokeWidth="3" />
                      <line x1="260" y1="220" x2="280" y2="280" stroke="#D32F2F" strokeWidth="3" />
                      
                      {/* Legs */}
                      <line x1="200" y1="280" x2="160" y2="400" stroke="#D32F2F" strokeWidth="3" />
                      <line x1="160" y1="400" x2="150" y2="500" stroke="#D32F2F" strokeWidth="3" />
                      <line x1="200" y1="280" x2="240" y2="400" stroke="#D32F2F" strokeWidth="3" />
                      <line x1="240" y1="400" x2="250" y2="500" stroke="#D32F2F" strokeWidth="3" />
                      
                      {/* Joints */}
                      <circle cx="200" cy="110" r="5" fill="#D32F2F" />
                      <circle cx="200" cy="150" r="5" fill="#D32F2F" />
                      <circle cx="140" cy="220" r="5" fill="#D32F2F" />
                      <circle cx="260" cy="220" r="5" fill="#D32F2F" />
                      <circle cx="120" cy="280" r="5" fill="#D32F2F" />
                      <circle cx="280" cy="280" r="5" fill="#D32F2F" />
                      <circle cx="200" cy="280" r="5" fill="#D32F2F" />
                      <circle cx="160" cy="400" r="5" fill="#D32F2F" />
                      <circle cx="240" cy="400" r="5" fill="#D32F2F" />
                      <circle cx="150" cy="500" r="5" fill="#D32F2F" />
                      <circle cx="250" cy="500" r="5" fill="#D32F2F" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {!analyzing && (
          <div className="space-y-6 animate-slide-up">
            {/* Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-poppins">Form Accuracy</h3>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Good
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2 font-poppins">86%</div>
                  <Progress value={86} className="mb-2" />
                  <p className="text-sm text-muted-foreground font-montserrat">
                    Above average for your skill level
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-poppins">Rhythm Efficiency</h3>
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      Fair
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2 font-poppins">78%</div>
                  <Progress value={78} className="mb-2" />
                  <p className="text-sm text-muted-foreground font-montserrat">
                    Room for improvement in timing
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Tips */}
            <Card className="shadow-card bg-gradient-to-br from-primary/5 to-background border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold font-poppins">Improvement Tips</h3>
                </div>
                <ul className="space-y-3 font-montserrat">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Straighten your back to improve posture alignment by 12%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Adjust stance width for better balance and stability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Work on rhythm consistency in your movements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Rhythm Graph */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold font-poppins">Motion Frequency</h3>
                </div>
                <div className="h-32 flex items-end justify-around gap-1">
                  {[65, 78, 82, 75, 88, 92, 85, 79, 84, 90, 87, 82].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/80 rounded-t animate-rhythm"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/compare-view")}
                className="flex-1 h-12 font-poppins"
              >
                Compare with Coach
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/ai-insights")}
                className="flex-1 h-12 font-poppins"
              >
                View Technology
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="flex-1 h-12 font-poppins font-semibold"
              >
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotionAnalysis;
