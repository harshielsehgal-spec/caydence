import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Video, Cpu, Activity, Lightbulb, ArrowRight } from "lucide-react";

const AIInsights = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      icon: Video,
      title: "Video Input",
      description: "Upload or record your training video in any quality",
    },
    {
      number: "2",
      icon: Cpu,
      title: "Pose Keypoints",
      description: "AI extracts skeletal keypoints using computer vision",
    },
    {
      number: "3",
      icon: Activity,
      title: "Rhythm Efficiency",
      description: "Analyze movement tempo and consistency patterns",
    },
    {
      number: "4",
      icon: Lightbulb,
      title: "Feedback",
      description: "Receive actionable insights to improve your form",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 font-poppins"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-poppins">
            Powered by AI Technology
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            How Cadence analyzes your movement
          </p>
        </div>

        {/* Process Flow */}
        <div className="mb-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <Card className="shadow-card hover:shadow-card-hover transition-smooth animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-card">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-primary font-poppins">
                          {step.number}
                        </span>
                        <h3 className="text-xl font-semibold font-poppins">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground font-montserrat">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <ArrowRight className="h-6 w-6 text-primary animate-pulse-glow" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Technical Details */}
        <Card className="mb-8 shadow-card-hover bg-gradient-to-br from-charcoal to-charcoal/90 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 font-poppins">
              Computer Vision + AI Motion Analytics
            </h2>
            <p className="text-white/80 font-montserrat mb-6 leading-relaxed">
              Our proprietary algorithm evaluates body angles and rhythm tempo using 
              lightweight machine learning models optimized for low-quality video input. 
              The system can process any video format and extract meaningful insights 
              about your movement patterns, posture, and timing.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
                <div className="text-2xl font-bold mb-1 font-poppins">98%</div>
                <div className="text-sm text-white/70 font-montserrat">Accuracy Rate</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
                <div className="text-2xl font-bold mb-1 font-poppins">&lt;2s</div>
                <div className="text-sm text-white/70 font-montserrat">Processing Time</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
                <div className="text-2xl font-bold mb-1 font-poppins">24+</div>
                <div className="text-sm text-white/70 font-montserrat">Tracked Points</div>
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
            Try Analysis Again
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="flex-1 h-12 font-poppins font-semibold"
          >
            View Your Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
