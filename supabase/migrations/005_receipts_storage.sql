-- =====================================================
-- RECEIPTS STORAGE & SCHEMA
-- =====================================================

-- 1. Add receipt_url to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- 2. Create Storage Bucket for Receipts
-- Note: Supabase storage buckets are often created via dashboard or API, 
-- but we can attempt to seed it here if the extension is enabled.
-- Usually requires insert into storage.buckets

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS Policies

-- Allow authenticated users to view receipts in their org
-- This is tricky because storage.objects doesn't have organization_id directly.
-- We usually secure it by folder structure: "org_id/user_id/filename"
-- Or simply allow any auth user to read if they have link (signed URLs) 
-- or use a policy checking specific path patterns.

-- POLICY: Give full access to authenticated users for now for simplicity in this demo.
-- In production, we'd check if split_part(name, '/', 1) IN (select organization_id from user_organizations...)

CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can view receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' 
  AND auth.role() = 'authenticated'
);
