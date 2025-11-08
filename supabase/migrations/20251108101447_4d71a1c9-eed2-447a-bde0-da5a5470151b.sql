-- Fix public data exposure by requiring authentication for coaches and offers tables
DROP POLICY IF EXISTS "Coaches can view all coach profiles" ON public.coaches;
DROP POLICY IF EXISTS "Coaches can view all offers" ON public.offers;

-- Restrict coaches table to authenticated users only
CREATE POLICY "Authenticated users can view coach profiles"
ON public.coaches
FOR SELECT
TO authenticated
USING (true);

-- Restrict offers table to authenticated users only
CREATE POLICY "Authenticated users can view offers"
ON public.offers
FOR SELECT
TO authenticated
USING (true);

-- Add UPDATE policy for athletes to modify their own sessions
CREATE POLICY "Athletes can update their own sessions"
ON public.sessions
FOR UPDATE
TO authenticated
USING (athlete_id = auth.uid())
WITH CHECK (athlete_id = auth.uid());

-- Add role-based validation for coach profile creation (prevent privilege escalation)
DROP POLICY IF EXISTS "Coaches can insert their own profile" ON public.coaches;
CREATE POLICY "Users with coach role can insert their profile"
ON public.coaches
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND public.has_role(auth.uid(), 'coach')
);

-- Add role-based validation for coach profile updates
DROP POLICY IF EXISTS "Coaches can update their own profile" ON public.coaches;
CREATE POLICY "Users with coach role can update their profile"
ON public.coaches
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  AND public.has_role(auth.uid(), 'coach')
)
WITH CHECK (
  auth.uid() = user_id 
  AND public.has_role(auth.uid(), 'coach')
);