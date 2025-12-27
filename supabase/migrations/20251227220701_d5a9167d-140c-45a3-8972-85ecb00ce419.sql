-- FINAL SECURITY HARDENING - Address error-level issues

-- 1. Fix security_audit_log - add explicit deny for non-admins
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.security_audit_log;

-- Only security definer functions can insert audit logs
-- No direct user access
CREATE POLICY "No direct audit log access"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 2. Update role insertion to only allow athlete/coach roles, not admin
DROP POLICY IF EXISTS "Users can insert their own roles on signup" ON public.user_roles;

CREATE POLICY "Users can insert athlete or coach role on signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role IN ('athlete'::app_role, 'coach'::app_role)
);

-- 3. Add explicit policies for masterclass_enrollment_stats view
-- Views with security_invoker inherit from base table, but we need to grant access
-- This is already handled by masterclass_enrollments table policies

-- 4. Drop coaches_public view since we have get_public_coaches function
DROP VIEW IF EXISTS public.coaches_public;

-- 5. Strengthen rate_limits - only via security definer function
-- No direct access policies

-- 6. Create index for performance on security audit log
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);