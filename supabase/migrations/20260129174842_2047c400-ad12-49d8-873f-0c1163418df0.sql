-- Add AI personality column for admin-only prompts
ALTER TABLE public.jotshi_profiles 
ADD COLUMN IF NOT EXISTS ai_personality TEXT;

-- Create storage bucket for provider avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-avatars', 'provider-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view provider avatars (public bucket)
CREATE POLICY "Provider avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-avatars');

-- Allow admins to upload/update/delete provider avatars
CREATE POLICY "Admins can manage provider avatars"
ON storage.objects FOR ALL
USING (bucket_id = 'provider-avatars' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'provider-avatars' AND public.has_role(auth.uid(), 'admin'));