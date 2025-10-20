import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Trophy } from "lucide-react";

const CompareView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 font-poppins"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-poppins">
            Compare with Coach Reference
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            Side-by-side motion analysis
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Your Form */}
          <Card className="shadow-card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold font-poppins">Your Form</h3>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  86% Match
                </Badge>
              </div>
              
              <div className="relative aspect-video bg-gradient-to-br from-charcoal to-charcoal/80 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  viewBox="0 0 400 600"
                  className="w-48 h-72"
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
                  
                  {/* Legs - slightly bent */}
                  <line x1="200" y1="280" x2="165" y2="400" stroke="#D32F2F" strokeWidth="3" />
                  <line x1="165" y1="400" x2="150" y2="500" stroke="#D32F2F" strokeWidth="3" />
                  <line x1="200" y1="280" x2="235" y2="400" stroke="#D32F2F" strokeWidth="3" />
                  <line x1="235" y1="400" x2="250" y2="500" stroke="#D32F2F" strokeWidth="3" />
                  
                  {/* Joints */}
                  <circle cx="200" cy="110" r="5" fill="#D32F2F" />
                  <circle cx="200" cy="150" r="5" fill="#D32F2F" />
                  <circle cx="140" cy="220" r="5" fill="#D32F2F" />
                  <circle cx="260" cy="220" r="5" fill="#D32F2F" />
                  <circle cx="120" cy="280" r="5" fill="#D32F2F" />
                  <circle cx="280" cy="280" r="5" fill="#D32F2F" />
                  <circle cx="200" cy="280" r="5" fill="#D32F2F" />
                  <circle cx="165" cy="400" r="5" fill="#D32F2F" />
                  <circle cx="235" cy="400" r="5" fill="#D32F2F" />
                  <circle cx="150" cy="500" r="5" fill="#D32F2F" />
                  <circle cx="250" cy="500" r="5" fill="#D32F2F" />
                </svg>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-montserrat">Back Angle</span>
                  <span className="font-semibold font-poppins">168°</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-montserrat">Knee Flexion</span>
                  <span className="font-semibold font-poppins">142°</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-montserrat">Hip Alignment</span>
                  <span className="font-semibold font-poppins">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coach Reference */}
          <Card className="shadow-card-hover border-primary/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold font-poppins">Coach Reference</h3>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  Optimal
                </Badge>
              </div>
              
              <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  viewBox="0 0 400 600"
                  className="w-48 h-72"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Head */}
                  <circle cx="200" cy="80" r="30" fill="none" stroke="#22c55e" strokeWidth="3" />
                  
                  {/* Body - straighter */}
                  <line x1="200" y1="110" x2="200" y2="280" stroke="#22c55e" strokeWidth="3" />
                  
                  {/* Arms */}
                  <line x1="200" y1="150" x2="140" y2="220" stroke="#22c55e" strokeWidth="3" />
                  <line x1="140" y1="220" x2="120" y2="280" stroke="#22c55e" strokeWidth="3" />
                  <line x1="200" y1="150" x2="260" y2="220" stroke="#22c55e" strokeWidth="3" />
                  <line x1="260" y1="220" x2="280" y2="280" stroke="#22c55e" strokeWidth="3" />
                  
                  {/* Legs - optimal position */}
                  <line x1="200" y1="280" x2="160" y2="400" stroke="#22c55e" strokeWidth="3" />
                  <line x1="160" y1="400" x2="150" y2="500" stroke="#22c55e" strokeWidth="3" />
                  <line x1="200" y1="280" x2="240" y2="400" stroke="#22c55e" strokeWidth="3" />
                  <line x1="240" y1="400" x2="250" y2="500" stroke="#22c55e" strokeWidth="3" />
                  
                  {/* Joints */}
                  <circle cx="200" cy="110" r="5" fill="#22c55e" />
                  <circle cx="200" cy="150" r="5" fill="#22c55e" />
                  <circle cx="140" cy="220" r="5" fill="#22c55e" />
                  <circle cx="260" cy="220" r="5" fill="#22c55e" />
                  <circle cx="120" cy="280" r="5" fill="#22c55e" />
                  <circle cx="280" cy="280" r="5" fill="#22c55e" />
                  <circle cx="200" cy="280" r="5" fill="#22c55e" />
                  <circle cx="160" cy="400" r="5" fill="#22c55e" />
                  <circle cx="240" cy="400" r="5" fill="#22c55e" />
                  <circle cx="150" cy="500" r="5" fill="#22c55e" />
                  <circle cx="250" cy="500" r="5" fill="#22c55e" />
                </svg>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-montserrat">Back Angle</span>
                  <span className="font-semibold font-poppins text-green-600">175°</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-montserrat">Knee Flexion</span>
                  <span className="font-semibold font-poppins text-green-600">135°</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-montserrat">Hip Alignment</span>
                  <span className="font-semibold font-poppins text-green-600">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Differences Card */}
        <Card className="mb-6 shadow-card bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 font-poppins">Key Differences</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold font-poppins">Back Angle: 7° difference</p>
                  <p className="text-sm text-muted-foreground font-montserrat">
                    Straighten your back slightly for better posture alignment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold font-poppins">Knee Flexion: 7° difference</p>
                  <p className="text-sm text-muted-foreground font-montserrat">
                    Adjust knee bend to match optimal form
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="font-semibold font-poppins">Hip Alignment: Excellent</p>
                  <p className="text-sm text-muted-foreground font-montserrat">
                    Your hip positioning is nearly perfect
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/motion-analysis")}
            className="flex-1 h-12 font-poppins"
          >
            Try Another Video
          </Button>
          <Button
            onClick={() => navigate("/ai-insights")}
            className="flex-1 h-12 font-poppins font-semibold"
          >
            Learn About the Technology
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareView;
