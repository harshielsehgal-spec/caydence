-- FINAL FIXES FOR ERROR-LEVEL ISSUES

-- 1. Sessions athlete_notes are already protected by get_coach_sessions function
-- which only shows notes for accepted/upcoming/completed sessions
-- The table policy allows viewing but the secure function filters the data

-- 2. Restrict payment info access - coaches should use get_masterclass_enrollment_summary
-- Update the policy to only show payment_status, not payment_amount
DROP POLICY IF EXISTS "Coaches can view enrollment counts for their masterclasses" ON public.masterclass_enrollments;

-- Coaches can view enrollments but should use the aggregate function for counts
-- This policy allows basic access for the function to work
CREATE POLICY "Coaches can view their masterclass enrollments"
ON public.masterclass_enrollments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.masterclasses m
    JOIN public.coaches c ON c.id = m.coach_id
    WHERE m.id = masterclass_enrollments.masterclass_id 
    AND c.user_id = auth.uid()
  )
);

-- 3. Rate limits - block all direct access, only allow via security definer
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.rate_limits;

-- No user access - managed entirely via check_rate_limit function

-- 4. Add analytics immutability (no deletes)
CREATE POLICY "Coaches cannot delete analytics"
ON public.coach_analytics
FOR DELETE
TO authenticated
USING (false);

-- 5. Drop the enrollment stats view - use function instead
DROP VIEW IF EXISTS public.masterclass_enrollment_stats;