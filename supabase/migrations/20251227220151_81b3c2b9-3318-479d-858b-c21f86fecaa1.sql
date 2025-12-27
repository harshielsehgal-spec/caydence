-- COMPREHENSIVE SECURITY FOR PRODUCTION BUSINESS
-- All-in-one migration with proper dependency ordering

-- 1. Create admin_users table first
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Create is_admin function that uses admin_users table
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = _user_id
  )
$$;

-- 3. Admin policy for admin_users table
CREATE POLICY "Admins can view admin list"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR 
  public.is_admin(auth.uid())
);

-- 4. Admin policies for user_roles management
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any user role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete any user role"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 5. Session cancellation policies
CREATE POLICY "Athletes can cancel their pending sessions"
ON public.sessions
FOR DELETE
TO authenticated
USING (
  athlete_id = auth.uid() 
  AND status = 'pending'
);

CREATE POLICY "Coaches can remove declined sessions"
ON public.sessions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = sessions.coach_id
    AND coaches.user_id = auth.uid()
  )
  AND status = 'declined'
);

-- 6. Security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own audit logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 7. Rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, action)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 8. Security utility functions
CREATE OR REPLACE FUNCTION public.log_security_event(
  _action text,
  _resource_type text,
  _resource_id uuid DEFAULT NULL,
  _details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (user_id, action, resource_type, resource_id, details)
  VALUES (auth.uid(), _action, _resource_type, _resource_id, _details);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _action text,
  _max_requests integer DEFAULT 100,
  _window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_count integer;
BEGIN
  INSERT INTO public.rate_limits (user_id, action, count, window_start)
  VALUES (auth.uid(), _action, 1, now())
  ON CONFLICT (user_id, action) DO UPDATE
  SET 
    count = CASE 
      WHEN rate_limits.window_start < now() - make_interval(mins := _window_minutes)
      THEN 1
      ELSE rate_limits.count + 1
    END,
    window_start = CASE 
      WHEN rate_limits.window_start < now() - make_interval(mins := _window_minutes)
      THEN now()
      ELSE rate_limits.window_start
    END
  RETURNING count INTO _current_count;
  
  RETURN _current_count <= _max_requests;
END;
$$;

-- 9. Create enrollment stats view (aggregate data, no individual payments)
CREATE OR REPLACE VIEW public.masterclass_enrollment_stats
WITH (security_invoker = true)
AS
SELECT 
  me.masterclass_id,
  COUNT(*) as total_enrolled,
  COUNT(*) FILTER (WHERE me.payment_status = 'confirmed') as confirmed_count,
  COUNT(*) FILTER (WHERE me.payment_status = 'pending') as pending_count,
  MAX(me.enrolled_at) as latest_enrollment
FROM public.masterclass_enrollments me
GROUP BY me.masterclass_id;

GRANT SELECT ON public.masterclass_enrollment_stats TO authenticated;