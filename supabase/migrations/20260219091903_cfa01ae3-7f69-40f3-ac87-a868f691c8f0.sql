-- Fix: Draft offers should not be visible to all authenticated users
-- Only published offers should be publicly browsable; coaches see their own drafts

DROP POLICY "Authenticated users can view offers" ON public.offers;

CREATE POLICY "Users can view published offers or own offers"
ON public.offers
FOR SELECT
TO authenticated
USING (
  status = 'published' OR
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = offers.coach_id
    AND coaches.user_id = auth.uid()
  )
);
