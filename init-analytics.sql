-- Query to create the analytics_visits table
-- Please run this query in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.analytics_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  path text NOT NULL,
  ip_address text,
  user_agent text,
  clicks integer DEFAULT 0
);

-- Optional: Set up Row Level Security (RLS) if you need public inserts but restricted reads
-- For this simple tracker, we can just disable RLS or allow insert for anon users.

ALTER TABLE public.analytics_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow public insert" ON public.analytics_visits 
FOR INSERT TO anon 
WITH CHECK (true);

-- Allow admins/service role to read (or everyone if you don't mind public analytics)
-- This policy allows public reads so your /analytics page can work without user authentication:
CREATE POLICY "Allow public select" ON public.analytics_visits
FOR SELECT TO anon
USING (true);
