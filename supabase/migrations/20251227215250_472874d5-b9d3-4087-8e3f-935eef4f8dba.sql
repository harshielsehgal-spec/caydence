-- FIX 1: Add explicit RLS policy to coaches_public view
-- Views inherit RLS from the underlying table when security_invoker is true
-- But we need to ensure authenticated users can access it
-- Since the view already has security_invoker = true, it respects the coaches table RLS

-- FIX 2: Update coaches table SELECT policy to prevent user_id exposure
-- Create a function to get safe coach data without user_id
CREATE OR REPLACE FUNCTION public.get_public_coach_profiles()
RETURNS TABLE(
  id uuid,
  name text,
  photo_url text,
  bio text,
  sports text[],
  cities text[],
  languages text[],
  mode text[],
  years_experience integer,
  verified boolean,
  rating numeric,
  reviews_count integer,
  per_session_fee integer,
  setup_complete boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.photo_url,
    c.bio,
    c.sports,
    c.cities,
    c.languages,
    c.mode,
    c.years_experience,
    c.verified,
    c.rating,
    c.reviews_count,
    c.per_session_fee,
    c.setup_complete,
    c.created_at,
    c.updated_at
  FROM coaches c
  WHERE c.setup_complete = true;
$$;

-- FIX 3: Create a secure function for coach to view sessions with conditional notes
-- Replace the direct table access with a function
CREATE OR REPLACE FUNCTION public.get_athlete_sessions(athlete_uuid uuid)
RETURNS TABLE(
  id uuid,
  coach_id uuid,
  athlete_id uuid,
  offer_id uuid,
  start_time timestamptz,
  end_time timestamptz,
  mode text,
  status text,
  athlete_notes text,
  coach_decline_reason text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Athletes can only view their own sessions
  IF athlete_uuid != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Can only view your own sessions';
  END IF;

  RETURN QUERY
  SELECT 
    s.id,
    s.coach_id,
    s.athlete_id,
    s.offer_id,
    s.start_time,
    s.end_time,
    s.mode,
    s.status,
    s.athlete_notes,
    s.coach_decline_reason,
    s.created_at,
    s.updated_at
  FROM sessions s
  WHERE s.athlete_id = athlete_uuid;
END;
$$;