-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  title TEXT NOT NULL,
  description TEXT,
  price_inr INTEGER NOT NULL DEFAULT 0,
  duration_min INTEGER NOT NULL DEFAULT 60,
  mode TEXT[] NOT NULL DEFAULT '{}',
  slots_per_week INTEGER NOT NULL DEFAULT 1,
  includes_ai_check BOOLEAN NOT NULL DEFAULT false,
  attachments TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Coaches can view all offers
CREATE POLICY "Coaches can view all offers"
ON public.offers
FOR SELECT
USING (true);

-- Coaches can insert their own offers
CREATE POLICY "Coaches can insert their own offers"
ON public.offers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- Coaches can update their own offers
CREATE POLICY "Coaches can update their own offers"
ON public.offers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- Coaches can delete their own offers
CREATE POLICY "Coaches can delete their own offers"
ON public.offers
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- Create coach_availability table
CREATE TABLE public.coach_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coach_id, weekday, start_time, end_time)
);

-- Enable RLS on coach_availability
ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;

-- Everyone can view coach availability
CREATE POLICY "Everyone can view coach availability"
ON public.coach_availability
FOR SELECT
USING (true);

-- Coaches can manage their own availability
CREATE POLICY "Coaches can insert their own availability"
ON public.coach_availability
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can update their own availability"
ON public.coach_availability
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can delete their own availability"
ON public.coach_availability
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'upcoming', 'declined', 'completed', 'cancelled')),
  athlete_notes TEXT,
  coach_decline_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Athletes can view their own sessions
CREATE POLICY "Athletes can view their own sessions"
ON public.sessions
FOR SELECT
USING (athlete_id = auth.uid());

-- Coaches can view sessions for their offers
CREATE POLICY "Coaches can view their sessions"
ON public.sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- Athletes can create session requests
CREATE POLICY "Athletes can create session requests"
ON public.sessions
FOR INSERT
WITH CHECK (athlete_id = auth.uid());

-- Coaches can update their sessions
CREATE POLICY "Coaches can update their sessions"
ON public.sessions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.coaches
    WHERE coaches.id = coach_id
    AND coaches.user_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coach_availability_updated_at
BEFORE UPDATE ON public.coach_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();