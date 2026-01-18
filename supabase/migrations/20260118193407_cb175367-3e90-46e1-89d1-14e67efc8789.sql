-- Create stores table
CREATE TABLE public.stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create discount codes table
CREATE TABLE public.discount_codes (
  id TEXT PRIMARY KEY,
  store_id TEXT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  probability INTEGER NOT NULL CHECK (probability >= 0 AND probability <= 100),
  trust_level TEXT NOT NULL CHECK (trust_level IN ('high', 'medium', 'low')),
  context TEXT[] DEFAULT '{}',
  valid_until TIMESTAMP WITH TIME ZONE,
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT now(),
  savings TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alternatives table
CREATE TABLE public.alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cheaper-store', 'newsletter', 'student', 'wait-for-sale', 'cashback')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_label TEXT,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create code reports table for user feedback
CREATE TABLE public.code_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id TEXT REFERENCES public.discount_codes(id) ON DELETE CASCADE NOT NULL,
  worked BOOLEAN NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_context JSONB
);

-- Enable RLS on all tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_reports ENABLE ROW LEVEL SECURITY;

-- Public read access for stores
CREATE POLICY "Anyone can view stores"
ON public.stores FOR SELECT
USING (true);

-- Public read access for active discount codes
CREATE POLICY "Anyone can view active discount codes"
ON public.discount_codes FOR SELECT
USING (is_active = true);

-- Public read access for alternatives
CREATE POLICY "Anyone can view alternatives"
ON public.alternatives FOR SELECT
USING (true);

-- Anyone can submit a code report (for user feedback)
CREATE POLICY "Anyone can submit code reports"
ON public.code_reports FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_discount_codes_store_id ON public.discount_codes(store_id);
CREATE INDEX idx_discount_codes_probability ON public.discount_codes(probability DESC);
CREATE INDEX idx_alternatives_store_id ON public.alternatives(store_id);
CREATE INDEX idx_code_reports_code_id ON public.code_reports(code_id);

-- Function to update store last_updated timestamp
CREATE OR REPLACE FUNCTION public.update_store_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.stores SET last_updated = now() WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update store timestamp when codes change
CREATE TRIGGER update_store_on_code_change
AFTER INSERT OR UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_store_timestamp();