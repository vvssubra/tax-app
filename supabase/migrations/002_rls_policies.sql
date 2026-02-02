-- =====================================================
-- Row-Level Security (RLS) Policies
-- =====================================================
-- This migration enables RLS and creates security policies
-- to ensure multi-tenant data isolation.
--
-- Run this AFTER 001_schema.sql
-- =====================================================

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORGANIZATIONS POLICIES
-- =====================================================

-- Users can view organizations they belong to
CREATE POLICY "Users can view own organizations" 
ON organizations FOR SELECT 
USING (
  id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Users can insert organizations (when creating new account)
CREATE POLICY "Users can create organizations" 
ON organizations FOR INSERT 
WITH CHECK (true);

-- Owners and admins can update their organizations
CREATE POLICY "Owners/admins can update organizations" 
ON organizations FOR UPDATE 
USING (
  id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Only owners can delete organizations
CREATE POLICY "Owners can delete organizations" 
ON organizations FOR DELETE 
USING (
  id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  )
);

-- =====================================================
-- USER_ORGANIZATIONS POLICIES
-- =====================================================

-- Users can view their own organization memberships
CREATE POLICY "Users can view own memberships" 
ON user_organizations FOR SELECT 
USING (
  user_id = auth.uid() 
  OR organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Users can join organizations (when invited)
CREATE POLICY "Users can join organizations" 
ON user_organizations FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Owners and admins can update memberships
CREATE POLICY "Owners/admins can update memberships" 
ON user_organizations FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Owners and admins can remove members
CREATE POLICY "Owners/admins can remove members" 
ON user_organizations FOR DELETE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- =====================================================
-- EXPENSES POLICIES
-- =====================================================

-- Users can view expenses from their organizations
CREATE POLICY "Users can view own org expenses" 
ON expenses FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Members and above can insert expenses
CREATE POLICY "Members can insert expenses" 
ON expenses FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'member')
  )
);

-- Members can update expenses (viewers cannot)
CREATE POLICY "Members can update expenses" 
ON expenses FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'member')
  )
);

-- Only owners and admins can delete expenses
CREATE POLICY "Admins can delete expenses" 
ON expenses FOR DELETE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- =====================================================
-- INCOME POLICIES
-- =====================================================

-- Users can view income from their organizations
CREATE POLICY "Users can view own org income" 
ON income FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Members and above can insert income
CREATE POLICY "Members can insert income" 
ON income FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'member')
  )
);

-- Members can update income (viewers cannot)
CREATE POLICY "Members can update income" 
ON income FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'member')
  )
);

-- Only owners and admins can delete income
CREATE POLICY "Admins can delete income" 
ON income FOR DELETE 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON income TO authenticated;

-- Grant view access
GRANT SELECT ON cashflow_monthly TO authenticated;
GRANT SELECT ON cashflow_detailed TO authenticated;
