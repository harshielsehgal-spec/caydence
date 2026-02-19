
-- CHECK constraints on offers table
ALTER TABLE public.offers
  ADD CONSTRAINT chk_offers_title_length CHECK (length(trim(title)) >= 5 AND length(title) <= 100),
  ADD CONSTRAINT chk_offers_description_length CHECK (description IS NULL OR length(description) <= 500),
  ADD CONSTRAINT chk_offers_price_inr CHECK (price_inr >= 0 AND price_inr <= 100000),
  ADD CONSTRAINT chk_offers_duration_min CHECK (duration_min >= 15 AND duration_min <= 480),
  ADD CONSTRAINT chk_offers_slots_per_week CHECK (slots_per_week >= 1 AND slots_per_week <= 50),
  ADD CONSTRAINT chk_offers_mode_not_empty CHECK (array_length(mode, 1) >= 1),
  ADD CONSTRAINT chk_offers_sport_not_empty CHECK (length(trim(sport)) >= 2),
  ADD CONSTRAINT chk_offers_level_not_empty CHECK (length(trim(level)) >= 2),
  ADD CONSTRAINT chk_offers_status_valid CHECK (status IN ('draft', 'published', 'archived'));

-- CHECK constraints on masterclasses table
ALTER TABLE public.masterclasses
  ADD CONSTRAINT chk_mc_title_length CHECK (length(trim(title)) >= 5 AND length(title) <= 200),
  ADD CONSTRAINT chk_mc_description_length CHECK (description IS NULL OR length(description) <= 1000),
  ADD CONSTRAINT chk_mc_price_inr CHECK (price_inr >= 0 AND price_inr <= 100000),
  ADD CONSTRAINT chk_mc_duration_min CHECK (duration_min >= 15 AND duration_min <= 480),
  ADD CONSTRAINT chk_mc_seats CHECK (seats >= 1 AND seats <= 1000),
  ADD CONSTRAINT chk_mc_enrolled_count CHECK (enrolled_count >= 0),
  ADD CONSTRAINT chk_mc_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  ADD CONSTRAINT chk_mc_sport_not_empty CHECK (length(trim(sport)) >= 2),
  ADD CONSTRAINT chk_mc_status_valid CHECK (status IN ('draft', 'published', 'completed', 'cancelled'));
