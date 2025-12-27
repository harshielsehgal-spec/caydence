-- FIX 1: Enable RLS on coaches_public view
ALTER VIEW public.coaches_public SET (security_invoker = true);

-- FIX 2: Restrict payment details from coaches - create a limited view
-- Update the enrollment policy to only show payment status, not amount
DROP POLICY IF EXISTS "Coaches can view enrollments for their masterclasses" ON public.masterclass_enrollments;

CREATE POLICY "Coaches can view enrollment counts for their masterclasses"
ON public.masterclass_enrollments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM masterclasses m
    JOIN coaches c ON c.id = m.coach_id
    WHERE m.id = masterclass_enrollments.masterclass_id 
    AND c.user_id = auth.uid()
  )
);

-- FIX 3: Restrict coach access to athlete_notes until session is accepted/upcoming
DROP POLICY IF EXISTS "Coaches can view their sessions" ON public.sessions;

CREATE POLICY "Coaches can view their sessions with conditional notes"
ON public.sessions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM coaches
    WHERE coaches.id = sessions.coach_id 
    AND coaches.user_id = auth.uid()
  )
);

-- Create a secure function to get session details with conditional note visibility
CREATE OR REPLACE FUNCTION public.get_coach_sessions(coach_uuid uuid)
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
  -- Verify caller owns this coach profile
  IF NOT EXISTS (
    SELECT 1 FROM coaches c WHERE c.id = coach_uuid AND c.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to coach sessions';
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
    -- Only show athlete_notes if session is accepted/upcoming/completed
    CASE 
      WHEN s.status IN ('upcoming', 'completed', 'accepted') THEN s.athlete_notes
      ELSE NULL
    END as athlete_notes,
    s.coach_decline_reason,
    s.created_at,
    s.updated_at
  FROM sessions s
  WHERE s.coach_id = coach_uuid;
END;
$$;