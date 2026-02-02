-- =====================================================
-- Database Functions and Triggers
-- =====================================================
-- This migration creates helper functions and triggers
-- for automatic calculations and timestamp updates.
--
-- Run this AFTER 002_rls_policies.sql
-- =====================================================

-- =====================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at timestamp';

-- Apply to organizations
CREATE TRIGGER update_organizations_updated_at 
BEFORE UPDATE ON organizations
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Apply to expenses
CREATE TRIGGER update_expenses_updated_at 
BEFORE UPDATE ON expenses
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Apply to income
CREATE TRIGGER update_income_updated_at 
BEFORE UPDATE ON income
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- AUTO-CALCULATE EXPENSE TOTAL
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_expense_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate total_amount from subtotal + service_charge + tax
  NEW.total_amount = NEW.subtotal_amount 
    + COALESCE(NEW.service_charge, 0) 
    + COALESCE(NEW.total_tax, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_expense_total() IS 'Automatically calculates total_amount for expenses';

CREATE TRIGGER calculate_expense_total_trigger 
BEFORE INSERT OR UPDATE ON expenses
FOR EACH ROW 
EXECUTE FUNCTION calculate_expense_total();

-- =====================================================
-- AUTO-CALCULATE INCOME TOTAL
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_income_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate total_amount from quantity × unit_price
  NEW.total_amount = NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_income_total() IS 'Automatically calculates total_amount for income';

CREATE TRIGGER calculate_income_total_trigger 
BEFORE INSERT OR UPDATE ON income
FOR EACH ROW 
EXECUTE FUNCTION calculate_income_total();

-- =====================================================
-- AUTO-SET CREATED_BY
-- =====================================================

CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_created_by() IS 'Automatically sets created_by to current user';

CREATE TRIGGER set_expense_created_by 
BEFORE INSERT ON expenses
FOR EACH ROW 
EXECUTE FUNCTION set_created_by();

CREATE TRIGGER set_income_created_by 
BEFORE INSERT ON income
FOR EACH ROW 
EXECUTE FUNCTION set_created_by();

-- =====================================================
-- HELPER FUNCTION: Get User's Organizations
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_organizations(user_uuid UUID)
RETURNS TABLE (
  organization_id UUID,
  organization_name TEXT,
  user_role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as organization_id,
    o.name as organization_name,
    uo.role as user_role
  FROM organizations o
  INNER JOIN user_organizations uo ON o.id = uo.organization_id
  WHERE uo.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_organizations(UUID) IS 'Returns all organizations for a given user';

-- =====================================================
-- HELPER FUNCTION: Get Cashflow Summary
-- =====================================================

CREATE OR REPLACE FUNCTION get_cashflow_summary(
  org_id UUID,
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  month TIMESTAMPTZ,
  income_total NUMERIC,
  expense_total NUMERIC,
  net_cashflow NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.month,
    cm.total_income as income_total,
    cm.total_expenses as expense_total,
    cm.net_cashflow
  FROM cashflow_monthly cm
  WHERE cm.organization_id = org_id
    AND (start_date IS NULL OR cm.month >= start_date)
    AND (end_date IS NULL OR cm.month <= end_date)
  ORDER BY cm.month DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_cashflow_summary(UUID, DATE, DATE) IS 'Returns cashflow summary for an organization within date range';

-- =====================================================
-- HELPER FUNCTION: Get Category Breakdown
-- =====================================================

CREATE OR REPLACE FUNCTION get_category_breakdown(
  org_id UUID,
  transaction_type TEXT, -- 'income' or 'expense'
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  category TEXT,
  total_amount NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  IF transaction_type = 'income' THEN
    RETURN QUERY
    SELECT 
      i.category,
      SUM(i.total_amount) as total_amount,
      COUNT(*) as transaction_count
    FROM income i
    WHERE i.organization_id = org_id
      AND (start_date IS NULL OR i.payment_date >= start_date)
      AND (end_date IS NULL OR i.payment_date <= end_date)
    GROUP BY i.category
    ORDER BY total_amount DESC;
  ELSIF transaction_type = 'expense' THEN
    RETURN QUERY
    SELECT 
      e.category,
      SUM(e.total_amount) as total_amount,
      COUNT(*) as transaction_count
    FROM expenses e
    WHERE e.organization_id = org_id
      AND (start_date IS NULL OR e.receipt_date >= start_date)
      AND (end_date IS NULL OR e.receipt_date <= end_date)
    GROUP BY e.category
    ORDER BY total_amount DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) IS 'Returns category breakdown for income or expenses';
