
-- Create drill_video_reports table
CREATE TABLE public.drill_video_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  drill_key text NOT NULL,
  video_path text NOT NULL,
  status text NOT NULL DEFAULT 'uploaded',
  report_json jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drill_video_reports ENABLE ROW LEVEL SECURITY;

-- Users can insert their own reports
CREATE POLICY "Users can insert own drill reports"
ON public.drill_video_reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can select their own reports
CREATE POLICY "Users can select own drill reports"
ON public.drill_video_reports FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update own drill reports"
ON public.drill_video_reports FOR UPDATE
USING (auth.uid() = user_id);

-- Create drill_videos storage bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('drill_videos', 'drill_videos', false);

-- Storage policy: authenticated users can upload to their own folder
CREATE POLICY "Users can upload drill videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'drill_videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: users can read their own videos
CREATE POLICY "Users can read own drill videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'drill_videos' AND auth.uid()::text = (storage.foldername(name))[1]);
