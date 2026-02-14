import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { getDrillDisplayName, generateDraftReport } from "@/utils/drillReportTemplate";

const VALID_DRILLS = ["pushup", "bicep", "squat"];

const DrillCapture = () => {
  const { drillKey } = useParams<{ drillKey: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const drillName = getDrillDisplayName(drillKey || "");

  useEffect(() => {
    if (!drillKey || !VALID_DRILLS.includes(drillKey)) {
      navigate("/sport-selection", { replace: true });
    }
  }, [drillKey, navigate]);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to upload videos.");
        setUploading(false);
        return;
      }

      const ext = file.name.split(".").pop() || "mp4";
      const ts = Date.now();
      const path = `${user.id}/${drillKey}/${ts}.${ext}`;

      setProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("drill_videos")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      setProgress(70);

      const report = generateDraftReport(drillKey!, file.name);

      const { data: row, error: insertError } = await supabase
        .from("drill_video_reports" as any)
        .insert({
          user_id: user.id,
          drill_key: drillKey,
          video_path: path,
          status: "complete",
          report_json: report,
        } as any)
        .select("id")
        .single();

      if (insertError) throw insertError;

      setProgress(100);
      navigate(`/fitness/drills/${drillKey}/report/${(row as any).id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (!drillKey || !VALID_DRILLS.includes(drillKey)) return null;

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
            Record or upload a clear side-angle video (10–30s).
          </p>
        </div>

        {error && (
          <p className="text-center text-destructive mb-6 font-montserrat text-sm">{error}</p>
        )}

        {uploading ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-poppins font-semibold">Uploading…</p>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Card
              className="cursor-pointer transition-smooth hover:shadow-card-hover group"
              onClick={() => cameraInputRef.current?.click()}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg font-poppins">Record Video</h3>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-smooth hover:shadow-card-hover group"
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg font-poppins">Upload Video</h3>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={onFileChange}
        />
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
