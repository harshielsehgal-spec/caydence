-- Fix: Require authentication to view coach availability
-- This aligns with the coaches table access control

DROP POLICY IF EXISTS "Everyone can view coach availability" ON public.coach_availability;

CREATE POLICY "Authenticated users can view coach availability"
ON public.coach_availability 
FOR SELECT
TO authenticated
USING (true);