-- =====================================================
-- Storage Configuration for Receipt Attachments
-- =====================================================
-- This migration creates storage buckets and policies
-- for secure file uploads.
--
-- Run this AFTER 003_functions_triggers.sql
-- =====================================================

-- =====================================================
-- CREATE STORAGE BUCKET
-- =====================================================

-- Create receipts bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE storage.buckets IS 'Storage bucket for receipt and invoice attachments';

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Users can upload receipts to their organization's folder
CREATE POLICY "Users can upload receipts to own org" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM user_organizations 
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin', 'member')
  )
);

-- Users can view receipts from their organizations
CREATE POLICY "Users can view own org receipts" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Users can update receipts in their organization
CREATE POLICY "Users can update own org receipts" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM user_organizations 
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin', 'member')
  )
);

-- Admins can delete receipts
CREATE POLICY "Admins can delete receipts" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM user_organizations 
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

-- =====================================================
-- STORAGE HELPER FUNCTION
-- =====================================================

-- Function to generate storage path for receipts
CREATE OR REPLACE FUNCTION generate_receipt_path(
  org_id UUID,
  transaction_type TEXT, -- 'expense' or 'income'
  transaction_date DATE,
  file_extension TEXT
)
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  month TEXT;
  filename TEXT;
BEGIN
  year := EXTRACT(YEAR FROM transaction_date)::TEXT;
  month := TO_CHAR(transaction_date, 'MM');
  filename := gen_random_uuid()::TEXT || '.' || file_extension;
  
  RETURN org_id::TEXT || '/' || transaction_type || 's/' || year || '/' || month || '/' || filename;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_receipt_path(UUID, TEXT, DATE, TEXT) IS 'Generates organized storage path for receipt files';

-- Example usage:
-- SELECT generate_receipt_path(
--   '123e4567-e89b-12d3-a456-426614174000'::UUID,
--   'expense',
--   '2026-02-15'::DATE,
--   'pdf'
-- );
-- Returns: '123e4567-e89b-12d3-a456-426614174000/expenses/2026/02/abc123.pdf'
