-- Add columns for provider display info
ALTER TABLE public.jotshi_profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'astrologer',
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['Hindi', 'English'];

-- Remove unique constraint on user_id to allow multiple providers
ALTER TABLE public.jotshi_profiles DROP CONSTRAINT IF EXISTS jotshi_profiles_user_id_key;

-- Make user_id nullable for static/demo providers
ALTER TABLE public.jotshi_profiles ALTER COLUMN user_id DROP NOT NULL;