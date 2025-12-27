-- Add a blocking policy to rate_limits to satisfy linter
-- All access is via security definer function check_rate_limit

CREATE POLICY "No direct access to rate limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);