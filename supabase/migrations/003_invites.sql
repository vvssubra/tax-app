-- =====================================================
-- TEAM INVITES
-- =====================================================

CREATE TABLE organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  status TEXT DEFAULT 'pending', -- pending, accepted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_invites_email ON organization_invites(email);
CREATE INDEX idx_invites_org ON organization_invites(organization_id);

ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;

-- 1. Owners/Admins can insert invites for their org
CREATE POLICY "Admins can create invites" 
ON organization_invites FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- 2. Owners/Admins can view invites for their org
CREATE POLICY "Admins can view org invites" 
ON organization_invites FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- 3. Also allow the recipient to view their own invite (so we can check on login)
-- Note: auth.jwt() -> email requires custom setup sometimes, keeping it simple:
-- We will use a secure function or server-side check for acceptance.
