-- =====================================================
-- Supabase Database Schema - Tax Application
-- =====================================================
-- This migration creates the complete database schema for the tax application
-- including tables, indexes, and relationships.
--
-- Run this in Supabase SQL Editor after creating your project.
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_registration_number TEXT,
  tax_identification_number TEXT,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_created_at ON organizations(created_at);

COMMENT ON TABLE organizations IS 'Multi-tenant organizations (customers/companies)';

-- =====================================================
-- USER-ORGANIZATION RELATIONSHIP TABLE
-- =====================================================
CREATE TABLE user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_user_orgs_user_id ON user_organizations(user_id);
CREATE INDEX idx_user_orgs_org_id ON user_organizations(organization_id);

COMMENT ON TABLE user_organizations IS 'Links users to organizations with role-based access';
COMMENT ON COLUMN user_organizations.role IS 'owner: full control, admin: manage data, member: add/edit, viewer: read-only';

-- =====================================================
-- EXPENSES TABLE
-- =====================================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Transaction details
  status TEXT CHECK (status IN ('pending', 'paid', 'approved', 'rejected')),
  receipt_date DATE NOT NULL,
  receipt_id TEXT,
  vendor_merchant TEXT NOT NULL,
  
  -- Amounts
  quantity NUMERIC(10,2) DEFAULT 1,
  subtotal_amount NUMERIC(12,2) NOT NULL,
  service_charge NUMERIC(12,2) DEFAULT 0,
  total_tax NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  
  -- Additional info
  description TEXT,
  payment_method TEXT,
  receipt_attachment TEXT,
  
  -- Category for cashflow aggregation
  category TEXT NOT NULL CHECK (category IN (
    'rental', 
    'books_uniform', 
    'marketing', 
    'human_resource', 
    'utilities', 
    'maintenance', 
    'food_beverage', 
    'other_expenses'
  )),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_expenses_org_id ON expenses(organization_id);
CREATE INDEX idx_expenses_receipt_date ON expenses(receipt_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_org_date ON expenses(organization_id, receipt_date);
CREATE INDEX idx_expenses_status ON expenses(status);

COMMENT ON TABLE expenses IS 'Expense transactions (maps to Expenses_Astra sheet)';

-- =====================================================
-- INCOME TABLE
-- =====================================================
CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Transaction details
  status TEXT CHECK (status IN ('pending', 'received', 'invoiced', 'cancelled')),
  invoice_number TEXT,
  payment_date DATE NOT NULL,
  
  -- Amounts
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  
  -- Additional info
  description TEXT,
  payment_method TEXT,
  receipt_attachment TEXT,
  
  -- Category for cashflow aggregation
  category TEXT NOT NULL CHECK (category IN (
    'school_fees', 
    'new_enrolment_fees', 
    'activity_event_revenue', 
    'other_revenue'
  )),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_income_org_id ON income(organization_id);
CREATE INDEX idx_income_payment_date ON income(payment_date);
CREATE INDEX idx_income_category ON income(category);
CREATE INDEX idx_income_org_date ON income(organization_id, payment_date);
CREATE INDEX idx_income_status ON income(status);

COMMENT ON TABLE income IS 'Income transactions (maps to Income_Astra sheet)';

-- =====================================================
-- CASHFLOW VIEW
-- =====================================================
-- This view replaces the manual Cashflow sheet calculations
CREATE OR REPLACE VIEW cashflow_monthly AS
WITH monthly_income AS (
  SELECT 
    organization_id,
    category,
    DATE_TRUNC('month', payment_date) as month,
    SUM(total_amount) as amount
  FROM income
  GROUP BY organization_id, category, DATE_TRUNC('month', payment_date)
),
monthly_expenses AS (
  SELECT 
    organization_id,
    category,
    DATE_TRUNC('month', receipt_date) as month,
    SUM(total_amount) as amount
  FROM expenses
  GROUP BY organization_id, category, DATE_TRUNC('month', receipt_date)
)
SELECT 
  COALESCE(i.organization_id, e.organization_id) as organization_id,
  COALESCE(i.month, e.month) as month,
  COALESCE(SUM(i.amount), 0) as total_income,
  COALESCE(SUM(e.amount), 0) as total_expenses,
  COALESCE(SUM(i.amount), 0) - COALESCE(SUM(e.amount), 0) as net_cashflow
FROM monthly_income i
FULL OUTER JOIN monthly_expenses e 
  ON i.organization_id = e.organization_id AND i.month = e.month
GROUP BY COALESCE(i.organization_id, e.organization_id), COALESCE(i.month, e.month);

COMMENT ON VIEW cashflow_monthly IS 'Monthly cashflow summary (replaces Cashflow sheet)';

-- =====================================================
-- DETAILED CASHFLOW VIEW (by category)
-- =====================================================
CREATE OR REPLACE VIEW cashflow_detailed AS
SELECT 
  organization_id,
  DATE_TRUNC('month', payment_date) as month,
  'income' as transaction_type,
  category,
  SUM(total_amount) as amount
FROM income
GROUP BY organization_id, DATE_TRUNC('month', payment_date), category
UNION ALL
SELECT 
  organization_id,
  DATE_TRUNC('month', receipt_date) as month,
  'expense' as transaction_type,
  category,
  SUM(total_amount) as amount
FROM expenses
GROUP BY organization_id, DATE_TRUNC('month', receipt_date), category
ORDER BY organization_id, month, transaction_type, category;

COMMENT ON VIEW cashflow_detailed IS 'Detailed cashflow breakdown by category (for dashboard)';
