
-- Server-side CHECK constraints on coaches table
ALTER TABLE public.coaches
  ADD CONSTRAINT chk_coaches_name_length CHECK (length(trim(name)) >= 2 AND length(name) <= 100),
  ADD CONSTRAINT chk_coaches_years_experience CHECK (years_experience >= 0 AND years_experience <= 80),
  ADD CONSTRAINT chk_coaches_per_session_fee CHECK (per_session_fee >= 0 AND per_session_fee <= 100000),
  ADD CONSTRAINT chk_coaches_sports_not_empty CHECK (array_length(sports, 1) >= 1),
  ADD CONSTRAINT chk_coaches_cities_not_empty CHECK (array_length(cities, 1) >= 1),
  ADD CONSTRAINT chk_coaches_languages_not_empty CHECK (array_length(languages, 1) >= 1),
  ADD CONSTRAINT chk_coaches_mode_not_empty CHECK (array_length(mode, 1) >= 1);
