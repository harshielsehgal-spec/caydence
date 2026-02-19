
-- 1. Performance indexes on foreign key columns
CREATE INDEX IF NOT EXISTS idx_sessions_coach_id ON public.sessions (coach_id);
CREATE INDEX IF NOT EXISTS idx_sessions_athlete_id ON public.sessions (athlete_id);
CREATE INDEX IF NOT EXISTS idx_sessions_offer_id ON public.sessions (offer_id);
CREATE INDEX IF NOT EXISTS idx_offers_coach_id ON public.offers (coach_id);
CREATE INDEX IF NOT EXISTS idx_masterclasses_coach_id ON public.masterclasses (coach_id);
CREATE INDEX IF NOT EXISTS idx_drill_video_reports_user_id ON public.drill_video_reports (user_id);

-- 2. DELETE policy on drill_video_reports
CREATE POLICY "Users can delete own drill reports"
ON public.drill_video_reports
FOR DELETE
USING (auth.uid() = user_id);

-- 3. UPDATE policy on masterclass_enrollments (athlete can update their own)
CREATE POLICY "Athletes can update their own enrollments"
ON public.masterclass_enrollments
FOR UPDATE
USING (athlete_id = auth.uid())
WITH CHECK (athlete_id = auth.uid());

-- 4. DELETE policy on masterclass_enrollments (athlete can cancel)
CREATE POLICY "Athletes can delete their own enrollments"
ON public.masterclass_enrollments
FOR DELETE
USING (athlete_id = auth.uid());
