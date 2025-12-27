-- Fix the security definer view warning by using SECURITY INVOKER
DROP VIEW IF EXISTS public.coaches_public;

CREATE VIEW public.coaches_public
WITH (security_invoker = true)
AS
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