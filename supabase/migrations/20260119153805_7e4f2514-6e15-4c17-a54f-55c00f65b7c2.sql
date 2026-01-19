-- Add affiliate_url column to discount_codes table
-- This is nullable - codes work fine without affiliate links
ALTER TABLE public.discount_codes 
ADD COLUMN affiliate_url TEXT;

-- Add a comment explaining the ethical usage
COMMENT ON COLUMN public.discount_codes.affiliate_url IS 'Optional affiliate URL. Only used when code is already the best choice for the user. Never prioritized over user benefit.';