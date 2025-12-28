-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "View coaches with published offers" ON coaches;

-- Create a simpler non-recursive policy for public coach viewing
-- This allows viewing coaches who have setup_complete = true (public profiles)
CREATE POLICY "View public coach profiles" 
ON coaches 
FOR SELECT 
USING (setup_complete = true OR user_id = auth.uid());