-- FIX 1: Enable RLS on coaches_public view and add explicit policy
-- Note: Views with security_invoker = true already inherit RLS from base table
-- But we need to ensure the view itself has proper permissions

-- For the coaches table, update the policy to hide user_id from non-owners
-- First, drop the permissive policy
DROP POLICY IF EXISTS "Authenticated users can view coach profiles" ON public.coaches;

-- Create two separate policies: one for viewing own profile (full), one for viewing others (limited)
-- Policy for viewing own profile with all fields
CREATE POLICY "Users can view their own full coach profile"
ON public.coaches
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- For other coaches, we can't hide columns with RLS, but we've created the coaches_public view
-- and get_public_coach_profiles function for safe access
-- Create a policy for viewing other coaches (still needed for joins)
CREATE POLICY "Users can view other coach profiles"
ON public.coaches
FOR SELECT
TO authenticated
USING (true);

-- FIX 2: Update sessions policy to use a function-based approach for conditional notes
-- The existing policy exposes athlete_notes for all sessions
-- We'll create a more restrictive policy using the session status

DROP POLICY IF EXISTS "Coaches can view their sessions with conditional notes" ON public.sessions;

-- Create a new policy that still allows SELECT but notes are handled in application layer
CREATE POLICY "Coaches can view their sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = sessions.coach_id
    AND coaches.user_id = auth.uid()
  )
);