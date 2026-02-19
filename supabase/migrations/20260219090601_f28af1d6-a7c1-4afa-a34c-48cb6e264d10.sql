
-- CHECK constraints on sessions table
ALTER TABLE public.sessions
  ADD CONSTRAINT chk_sessions_status_valid CHECK (status IN ('pending', 'upcoming', 'completed', 'declined', 'cancelled')),
  ADD CONSTRAINT chk_sessions_mode_not_empty CHECK (length(trim(mode)) >= 2),
  ADD CONSTRAINT chk_sessions_end_after_start CHECK (end_time > start_time),
  ADD CONSTRAINT chk_sessions_athlete_notes_length CHECK (athlete_notes IS NULL OR length(athlete_notes) <= 1000),
  ADD CONSTRAINT chk_sessions_decline_reason_length CHECK (coach_decline_reason IS NULL OR length(coach_decline_reason) <= 500);
