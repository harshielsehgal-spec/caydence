-- FINAL SECURITY HARDENING

-- 1. Fix rate_limits - only allow system (security definer) to manage
CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- 2. Admin user management - only admins can add/remove admins
CREATE POLICY "Admins can insert new admins"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete admins"
ON public.admin_users
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 3. Prevent modification of audit logs (immutable)
CREATE POLICY "No one can update audit logs"
ON public.security_audit_log
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "No one can delete audit logs"
ON public.security_audit_log
FOR DELETE
TO authenticated
USING (false);

-- 4. Create a proper public coaches function that is the ONLY safe way to get coach data
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
  FROM public.coaches c
  WHERE c.setup_complete = true
    AND (sport_filter IS NULL OR sport_filter = ANY(c.sports))
    AND (city_filter IS NULL OR city_filter = ANY(c.cities))
    AND (NOT verified_only OR c.verified = true)
$$;

-- 5. Create first admin setup function (can only be used once)
CREATE OR REPLACE FUNCTION public.setup_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if no admins exist
  IF EXISTS (SELECT 1 FROM public.admin_users LIMIT 1) THEN
    RAISE EXCEPTION 'Admin already exists. Use admin interface to add more admins.';
  END IF;
  
  INSERT INTO public.admin_users (user_id, created_by)
  VALUES (auth.uid(), auth.uid());
  
  -- Log this security event
  INSERT INTO public.security_audit_log (user_id, action, resource_type, details)
  VALUES (auth.uid(), 'FIRST_ADMIN_SETUP', 'admin_users', 
    jsonb_build_object('note', 'First admin created'));
  
  RETURN true;
END;
$$;