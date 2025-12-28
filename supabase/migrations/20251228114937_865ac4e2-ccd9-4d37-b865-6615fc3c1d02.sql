-- Create a separate private notes table for sensitive athlete information
-- Only athletes can access their own private notes
CREATE TABLE public.athlete_private_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    athlete_id uuid NOT NULL,
    private_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(session_id)
);

-- Enable RLS
ALTER TABLE public.athlete_private_notes ENABLE ROW LEVEL SECURITY;

-- Only athletes can view their own private notes
CREATE POLICY "Athletes can view their own private notes"
ON public.athlete_private_notes
FOR SELECT
USING (athlete_id = auth.uid());

-- Only athletes can insert their own private notes
CREATE POLICY "Athletes can insert their own private notes"
ON public.athlete_private_notes
FOR INSERT
WITH CHECK (athlete_id = auth.uid());

-- Only athletes can update their own private notes
CREATE POLICY "Athletes can update their own private notes"
ON public.athlete_private_notes
FOR UPDATE
USING (athlete_id = auth.uid())
WITH CHECK (athlete_id = auth.uid());

-- Only athletes can delete their own private notes
CREATE POLICY "Athletes can delete their own private notes"
ON public.athlete_private_notes
FOR DELETE
USING (athlete_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_athlete_private_notes_updated_at
BEFORE UPDATE ON public.athlete_private_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing athlete_notes to the private notes table
INSERT INTO public.athlete_private_notes (session_id, athlete_id, private_notes)
SELECT id, athlete_id, athlete_notes
FROM public.sessions
WHERE athlete_notes IS NOT NULL AND athlete_notes != '';

-- Update get_coach_sessions function to return empty string for athlete_notes
-- Coaches should not see sensitive health information
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
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verify calling user is the coach
    IF NOT EXISTS (
        SELECT 1 FROM coaches c 
        WHERE c.id = coach_uuid AND c.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Unauthorized access';
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
        -- Return empty string instead of actual notes for privacy
        ''::text as athlete_notes,
        s.coach_decline_reason,
        s.created_at,
        s.updated_at
    FROM sessions s
    WHERE s.coach_id = coach_uuid
    ORDER BY s.start_time DESC;
END;
$$;

-- Create a function for athletes to get their sessions WITH private notes
CREATE OR REPLACE FUNCTION public.get_athlete_sessions_with_notes(athlete_uuid uuid)
RETURNS TABLE(
    id uuid,
    coach_id uuid,
    athlete_id uuid,
    offer_id uuid,
    start_time timestamptz,
    end_time timestamptz,
    mode text,
    status text,
    private_notes text,
    coach_decline_reason text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verify calling user is the athlete
    IF athlete_uuid != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized access';
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
        COALESCE(apn.private_notes, '')::text as private_notes,
        s.coach_decline_reason,
        s.created_at,
        s.updated_at
    FROM sessions s
    LEFT JOIN athlete_private_notes apn ON apn.session_id = s.id
    WHERE s.athlete_id = athlete_uuid
    ORDER BY s.start_time DESC;
END;
$$;

-- Clear the athlete_notes column in sessions table (data is now in private table)
-- Keep the column for backward compatibility but it will always be empty for new sessions
UPDATE public.sessions SET athlete_notes = NULL;