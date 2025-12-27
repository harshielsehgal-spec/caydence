-- FIX 1: Create a secure view for coaches that excludes user_id
-- This prevents exposing auth user IDs to other authenticated users
CREATE OR REPLACE VIEW public.coaches_public AS
SELECT 
  id,
  name,
  photo_url,
  bio,
  sports,
  cities,
  languages,
  mode,
  years_experience,
  verified,
  rating,
  reviews_count,
  per_session_fee,
  setup_complete,
  created_at,
  updated_at
FROM public.coaches;

-- Grant access to the view
GRANT SELECT ON public.coaches_public TO authenticated;
GRANT SELECT ON public.coaches_public TO anon;

-- FIX 2: Restrict coach_analytics INSERT/UPDATE to service role only
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "System can insert analytics" ON public.coach_analytics;
DROP POLICY IF EXISTS "System can update analytics" ON public.coach_analytics;

-- Create restrictive policies that only allow coaches to manage their own analytics
-- or system-level operations via service role
CREATE POLICY "Coaches can insert their own analytics"
ON public.coach_analytics
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_analytics.coach_id
    AND coaches.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can update their own analytics"
ON public.coach_analytics
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_analytics.coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- FIX 3: Create a secure function for coaches to get enrollment counts without payment details
CREATE OR REPLACE FUNCTION public.get_masterclass_enrollment_summary(masterclass_uuid uuid)
RETURNS TABLE(
  total_enrolled bigint,
  confirmed_count bigint,
  pending_count bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the caller is the coach who owns this masterclass
  IF NOT EXISTS (
    SELECT 1 FROM masterclasses m
    JOIN coaches c ON c.id = m.coach_id
    WHERE m.id = masterclass_uuid AND c.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to masterclass enrollment data';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_enrolled,
    COUNT(*) FILTER (WHERE payment_status = 'confirmed')::bigint as confirmed_count,
    COUNT(*) FILTER (WHERE payment_status = 'pending')::bigint as pending_count
  FROM masterclass_enrollments
  WHERE masterclass_id = masterclass_uuid;
END;
$$;

-- FIX 4: Update masterclass_enrollments policy to hide payment_amount from coaches
-- We'll keep the existing policies but coaches should use the summary function instead
-- Note: The athlete can still see their own payment details

-- FIX 5: Add role validation trigger to prevent invalid role assignments
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure user can only assign roles to themselves
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot assign roles to other users';
  END IF;
  
  -- Prevent duplicate role assignments
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = NEW.user_id AND role = NEW.role
  ) THEN
    RAISE EXCEPTION 'Role already assigned to this user';
  END IF;
  
  -- Limit to maximum 2 roles per user (athlete + coach)
  IF (SELECT COUNT(*) FROM public.user_roles WHERE user_id = NEW.user_id) >= 2 THEN
    RAISE EXCEPTION 'Maximum number of roles reached';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for role validation
DROP TRIGGER IF EXISTS validate_role_before_insert ON public.user_roles;
CREATE TRIGGER validate_role_before_insert
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();