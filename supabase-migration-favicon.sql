-- Add favicon column to bookmarks table
-- Run this in Supabase SQL Editor

ALTER TABLE public.bookmarks
ADD COLUMN IF NOT EXISTS favicon text;

-- Add comment to document the column
COMMENT ON COLUMN public.bookmarks.favicon IS 'URL to the website favicon (auto-fetched from Google favicon service)';
