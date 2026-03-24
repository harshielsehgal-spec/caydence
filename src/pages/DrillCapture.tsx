import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Camera, Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { getDrillDisplayName } from "@/utils/drillReportTemplate";

const VALID_DRILLS = ["pushup", "bicep", "squat"];
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8001/api';

const DrillCapture = () => {
  const { drillKey } = useParams<{ drillKey: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    if (!drillKey || !VALID_DRILLS.includes(drillKey)) {
      navigate("/sport-selection", { replace: true });
    }
  }, [drillKey, navigate]);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(10);
    setStatusMessage("Uploading video...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to upload videos.");
        setUploading(false);
        return;
      }

      const exerciseType = drillKey === 'pushup' ? 'pushup' :
                          drillKey === 'bicep'  ? 'bicep_curl' :
                          drillKey === 'squat'  ? 'squat' :
                          null;

      if (!exerciseType) {
        setError("This drill is not yet supported for AI analysis.");
        setUploading(false);
        return;
      }

      setProgress(20);
      setStatusMessage("Sending to AI analysis...");

      const formData = new FormData();
      formData.append('file', file);
      formData.append('exercise_type', exerciseType);
      formData.append('user_id', user.id);

      const uploadResponse = await fetch(`${API_BASE_URL}/workout/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to analysis server');
      }

      const { workout_id } = await uploadResponse.json();
      setProgress(40);
      setStatusMessage("Analyzing form...");

      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const statusResponse = await fetch(`${API_BASE_URL}/workout/${workout_id}/status`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'complete') {
          setProgress(100);
          navigate(`/fitness/drills/${drillKey}/report/${workout_id}`);
          return;
        }

        if (statusData.status === 'failed') {
          throw new Error('Analysis failed. Please try again.');
        }

        setProgress(Math.min(40 + (attempts * 0.8), 85));

        if (statusData.status === 'processing') {
          setStatusMessage("Analyzing movement...");
        } else if (statusData.status === 'generating_summary') {
          setStatusMessage("Generating AI insights...");
        }

        attempts++;
      }

      throw new Error('Analysis timed out. Please try again.');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed. Please try again.");
      setUploading(false);
      setProgress(0);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Video must be under 100MB');
        return;
      }
      handleFile(file);
    }
  };

  if (!drillKey || !VALID_DRILLS.includes(drillKey)) return null;

  const drillName = getDrillDisplayName(drillKey || "");

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/sport-selection")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          disabled={uploading}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">
            Record your {drillName}
          </h1>
          <p className="text-lg text-muted-foreground font-montserrat">
            Use live webcam for real-time coaching, or upload a video for analysis.
          </p>
        </div>

        {error && (
          <p className="text-center text-destructive mb-6 font-montserrat text-sm">{error}</p>
        )}

        {uploading ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-poppins font-semibold">{statusMessage}</p>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground font-montserrat">
                This usually takes 30–60 seconds
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">

            {/* Record Video → navigates to live WebSocket session */}
            <Card
              className="cursor-pointer transition-smooth hover:shadow-card-hover group"
              onClick={() => navigate(`/fitness/drills/${drillKey}/live`)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg font-poppins">Record Video</h3>
                <p className="text-xs text-muted-foreground font-montserrat">Live webcam + AI coaching</p>
              </CardContent>
            </Card>

            {/* Upload Video → file picker, unchanged */}
            <Card
              className="cursor-pointer transition-smooth hover:shadow-card-hover group"
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg font-poppins">Upload Video</h3>
                <p className="text-xs text-muted-foreground font-montserrat">Analyse an existing video</p>
              </CardContent>
            </Card>
          </div>
        )}

        {!uploading && (
          <div className="mt-8 max-w-md mx-auto p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">📹 Tips for best results</p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 font-montserrat">
              <li>• Film from the side for best angle detection</li>
              <li>• Ensure your full body is visible in frame</li>
              <li>• Good lighting helps tracking accuracy</li>
              <li>• Do 5–10 reps for a meaningful analysis</li>
            </ul>
          </div>
        )}

        {/* Hidden file input — Upload Video only, no capture attribute */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

export default DrillCapture;