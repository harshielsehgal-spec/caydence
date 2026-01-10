-- ============================================
-- FIX 1: Remove the setup_first_admin() race condition vulnerability
-- This function allows any authenticated user to become admin - CRITICAL SECURITY ISSUE
-- ============================================

-- Drop the dangerous function entirely
DROP FUNCTION IF EXISTS public.setup_first_admin();

-- Log the security change for audit purposes
INSERT INTO public.security_audit_log (user_id, action, resource_type, details)
SELECT 
  COALESCE((SELECT user_id FROM public.admin_users LIMIT 1), gen_random_uuid()),
  'SECURITY_FIX',
  'function',
  '{"action": "removed_setup_first_admin_function", "reason": "Race condition vulnerability - any authenticated user could claim admin"}'::jsonb
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_audit_log');

-- ============================================
-- FIX 2: Protect coach user_id from public exposure
-- Currently the RLS policy allows querying user_id for all coaches with setup_complete=true
-- ============================================

-- First, drop the current overly permissive policy
DROP POLICY IF EXISTS "View public coach profiles" ON coaches;

-- Create a new restrictive policy: Users can ONLY view their own full coach profile
-- (including user_id) through direct table access
CREATE POLICY "Coaches view own full profile only"
ON coaches 
FOR SELECT 
USING (user_id = auth.uid());

-- Update the get_public_coaches function to ensure it's the ONLY way to get public coach data
-- This function explicitly EXCLUDES user_id from the return type
CREATE OR REPLACE FUNCTION public.get_public_coaches(
  sport_filter text DEFAULT NULL,
  city_filter text DEFAULT NULL,
  verified_only boolean DEFAULT false
)
RETURNS TABLE(
  id uuid,
  name text,
  photo_url text,
  bio text,
  sports text[],
  cities text[],
  languages text[],
  mode text[],
  years_experience integer,
  verified boolean,
  rating numeric,
  reviews_count integer,
  per_session_fee integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.photo_url,
    c.bio,
    c.sports,
    c.cities,
    c.languages,
    c.mode,
    c.years_experience,
    c.verified,
    c.rating,
    c.reviews_count,
    c.per_session_fee
  -- Note: user_id is INTENTIONALLY excluded from this result set
  FROM public.coaches c
  WHERE c.setup_complete = true
    AND (sport_filter IS NULL OR sport_filter = ANY(c.sports))
    AND (city_filter IS NULL OR city_filter = ANY(c.cities))
    AND (NOT verified_only OR c.verified = true)
$$;

-- Add comment documenting the security requirement
COMMENT ON FUNCTION public.get_public_coaches IS 
'Returns public coach profiles with user_id EXCLUDED for privacy. 
This is the ONLY approved method for fetching coach data for non-coach users.
Direct table access to coaches is restricted to the coach themselves.';

-- Also update get_public_coach_profiles to ensure consistency
CREATE OR REPLACE FUNCTION public.get_public_coach_profiles()
RETURNS TABLE(
  id uuid,
  name text,
  photo_url text,
  bio text,
  sports text[],
  cities text[],
  languages text[],
  mode text[],
  years_experience integer,
  verified boolean,
  rating numeric,
  reviews_count integer,
  per_session_fee integer,
  setup_complete boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.photo_url,
    c.bio,
    c.sports,
    c.cities,
    c.languages,
    c.mode,
    c.years_experience,
    c.verified,
    c.rating,
    c.reviews_count,
    c.per_session_fee,
    c.setup_complete,
    c.created_at,
    c.updated_at
  -- Note: user_id is INTENTIONALLY excluded from this result set  
  FROM coaches c
  WHERE c.setup_complete = true
$$;

COMMENT ON FUNCTION public.get_public_coach_profiles IS 
'Returns public coach profiles with user_id EXCLUDED for privacy.';