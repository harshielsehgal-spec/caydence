-- Fix search_path for calculate_coach_leaderboard function
DROP FUNCTION IF EXISTS public.calculate_coach_leaderboard(TEXT);

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
) 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;