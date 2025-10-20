import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, Video, Camera } from "lucide-react";
import { toast } from "sonner";

const VideoUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a valid video file");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      toast.error("Please select a video first");
      return;
    }
    navigate("/motion-analysis");
  };

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

        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-poppins">
            Upload Your Training Video
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            AI will analyze your form, posture, and rhythm
          </p>
        </div>

        <Card className="mb-6 shadow-card-hover">
          <CardContent className="p-8">
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:border-primary/60 transition-smooth hover-scale"
              >
                <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 font-poppins">
                  Choose Video File
                </h3>
                <p className="text-muted-foreground mb-4 font-montserrat">
                  Upload MP4, MOV, or any video format
                </p>
                <Button variant="outline" className="font-poppins">
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video bg-charcoal rounded-lg overflow-hidden">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                    className="flex-1 font-poppins"
                  >
                    Choose Different Video
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    className="flex-1 font-poppins font-semibold"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Video className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-poppins">Any Quality</h3>
              <p className="text-sm text-muted-foreground font-montserrat">
                Works with low-res phone videos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Camera className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-poppins">24+ Points</h3>
              <p className="text-sm text-muted-foreground font-montserrat">
                Full body skeletal tracking
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-poppins">Instant Results</h3>
              <p className="text-sm text-muted-foreground font-montserrat">
                Analysis in under 2 seconds
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 font-poppins">
              How it works
            </h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">1.</span>
                <span>Upload a video of your training session or practice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">2.</span>
                <span>AI extracts pose keypoints using computer vision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">3.</span>
                <span>Get instant feedback on form, posture, and rhythm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">4.</span>
                <span>Compare with coach reference videos (coming soon)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoUpload;
