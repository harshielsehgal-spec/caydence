-- Add setup_complete flag to coaches table
ALTER TABLE public.coaches 
ADD COLUMN IF NOT EXISTS setup_complete BOOLEAN NOT NULL DEFAULT false;

-- Update existing coaches with complete profiles to true
-- (profiles with name, at least one sport, and fee set)
UPDATE public.coaches 
SET setup_complete = true 
WHERE name IS NOT NULL 
  AND array_length(sports, 1) > 0 
  AND per_session_fee > 0;