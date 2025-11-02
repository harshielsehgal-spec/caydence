-- Create masterclasses table
CREATE TABLE public.masterclasses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('live', 'recorded')),
  price_inr INTEGER NOT NULL DEFAULT 0,
  duration_min INTEGER NOT NULL DEFAULT 60,
  seats INTEGER NOT NULL DEFAULT 30,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  video_url TEXT,
  trailer_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create masterclass_enrollments table
CREATE TABLE public.masterclass_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masterclass_id UUID NOT NULL REFERENCES public.masterclasses(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_amount INTEGER NOT NULL DEFAULT 0,
  UNIQUE(masterclass_id, athlete_id)
);

-- Create coach_analytics table
CREATE TABLE public.coach_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  week_start DATE NOT NULL,
  bookings_count INTEGER NOT NULL DEFAULT 0,
  avg_form_score NUMERIC DEFAULT 0,
  revenue_inr INTEGER NOT NULL DEFAULT 0,
  masterclass_views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coach_id, sport, week_start)
);

-- Enable RLS
ALTER TABLE public.masterclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masterclass_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for masterclasses
CREATE POLICY "Everyone can view published masterclasses"
ON public.masterclasses FOR SELECT
USING (status = 'published' OR EXISTS (
  SELECT 1 FROM public.coaches 
  WHERE coaches.id = masterclasses.coach_id 
  AND coaches.user_id = auth.uid()
));

CREATE POLICY "Coaches can insert their own masterclasses"
ON public.masterclasses FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.coaches 
  WHERE coaches.id = masterclasses.coach_id 
  AND coaches.user_id = auth.uid()
));

CREATE POLICY "Coaches can update their own masterclasses"
ON public.masterclasses FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.coaches 
  WHERE coaches.id = masterclasses.coach_id 
  AND coaches.user_id = auth.uid()
));

CREATE POLICY "Coaches can delete their own masterclasses"
ON public.masterclasses FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.coaches 
  WHERE coaches.id = masterclasses.coach_id 
  AND coaches.user_id = auth.uid()
));

-- RLS Policies for masterclass_enrollments
CREATE POLICY "Athletes can view their own enrollments"
ON public.masterclass_enrollments FOR SELECT
USING (athlete_id = auth.uid());

CREATE POLICY "Coaches can view enrollments for their masterclasses"
ON public.masterclass_enrollments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.masterclasses m
  JOIN public.coaches c ON c.id = m.coach_id
  WHERE m.id = masterclass_enrollments.masterclass_id
  AND c.user_id = auth.uid()
));

CREATE POLICY "Athletes can enroll in masterclasses"
ON public.masterclass_enrollments FOR INSERT
WITH CHECK (athlete_id = auth.uid());

-- RLS Policies for coach_analytics
CREATE POLICY "Coaches can view their own analytics"
ON public.coach_analytics FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.coaches 
  WHERE coaches.id = coach_analytics.coach_id 
  AND coaches.user_id = auth.uid()
));

CREATE POLICY "System can insert analytics"
ON public.coach_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update analytics"
ON public.coach_analytics FOR UPDATE
USING (true);

-- Create trigger for masterclasses updated_at
CREATE TRIGGER update_masterclasses_updated_at
BEFORE UPDATE ON public.masterclasses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate leaderboard
CREATE OR REPLACE FUNCTION public.calculate_coach_leaderboard(sport_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  coach_id UUID,
  coach_name TEXT,
  coach_photo_url TEXT,
  sport TEXT,
  rank BIGINT,
  total_bookings BIGINT,
  avg_rating NUMERIC,
  masterclass_views BIGINT,
  score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH coach_stats AS (
    SELECT 
      c.id,
      c.name,
      c.photo_url,
      UNNEST(c.sports) as coach_sport,
      COUNT(DISTINCT s.id) as bookings,
      COALESCE(c.rating, 0) as rating,
      COALESCE(SUM(ca.masterclass_views), 0) as views
    FROM public.coaches c
    LEFT JOIN public.sessions s ON s.coach_id = c.id AND s.status IN ('upcoming', 'completed')
    LEFT JOIN public.coach_analytics ca ON ca.coach_id = c.id
    WHERE sport_filter IS NULL OR coach_sport = sport_filter
    GROUP BY c.id, c.name, c.photo_url, coach_sport, c.rating
  )
  SELECT 
    cs.id as coach_id,
    cs.name as coach_name,
    cs.photo_url as coach_photo_url,
    cs.coach_sport as sport,
    ROW_NUMBER() OVER (ORDER BY (cs.bookings * 10 + cs.rating * 20 + cs.views * 5) DESC) as rank,
    cs.bookings as total_bookings,
    cs.rating as avg_rating,
    cs.views as masterclass_views,
    (cs.bookings * 10 + cs.rating * 20 + cs.views * 5) as score
  FROM coach_stats cs
  ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql STABLE;