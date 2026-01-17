-- Update the default avatar path to .webp format
-- Run this in your Supabase SQL editor

-- Update existing profiles that have the old default avatar
UPDATE profiles 
SET avatar_url = '/images/default-avatar.webp' 
WHERE avatar_url = '/images/default-avatar.jpg' 
   OR avatar_url IS NULL;

-- Update the function to use the new default avatar path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '/images/default-avatar.webp'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
