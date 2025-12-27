-- FIX REMAINING ISSUES

-- 1. Fix rate_limits - drop the blocking policy, let security definer function handle it
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

-- Rate limits managed only via security definer function (check_rate_limit)
-- No direct table access allowed

-- 2. For coaches table - remove the broad policy that exposes user_id
-- Keep only the policy for viewing own profile
DROP POLICY IF EXISTS "Users can view other coach profiles" ON public.coaches;

-- 3. Create a policy that allows viewing coaches via joins (needed for sessions/offers)
-- but only through authorized queries
CREATE POLICY "Authorized coach data access for related records"
ON public.coaches
FOR SELECT
TO authenticated
USING (
  -- Can view coach if viewing a session with that coach
  EXISTS (
    SELECT 1 FROM public.sessions s
    WHERE s.coach_id = coaches.id
    AND (s.athlete_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.coaches c2 WHERE c2.id = s.coach_id AND c2.user_id = auth.uid()))
  )
  OR
  -- Can view coach if viewing their offers
  EXISTS (
    SELECT 1 FROM public.offers o
    WHERE o.coach_id = coaches.id
    AND o.status = 'published'
  )
  OR
  -- Can view coach via leaderboard function (which doesn't expose user_id)
  setup_complete = true
);

-- Actually, the above is still too broad. Let's use a simpler approach:
-- Drop that policy and create one that truly restricts access
DROP POLICY IF EXISTS "Authorized coach data access for related records" ON public.coaches;

-- Allow viewing coaches who have published offers (public marketplace)
CREATE POLICY "View coaches with published offers"
ON public.coaches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.offers o
    WHERE o.coach_id = coaches.id AND o.status = 'published'
  )
  OR
  EXISTS (
    SELECT 1 FROM public.masterclasses m
    WHERE m.coach_id = coaches.id AND m.status = 'published'
  )
  OR
  -- Athletes can see coaches they have sessions with
  EXISTS (
    SELECT 1 FROM public.sessions s
    WHERE s.coach_id = coaches.id AND s.athlete_id = auth.uid()
  )
);