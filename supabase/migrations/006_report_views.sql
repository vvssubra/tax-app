-- =====================================================
-- ADVANCED REPORTING VIEWS
-- =====================================================

-- 1. Yearly Cashflow
CREATE OR REPLACE VIEW cashflow_yearly AS
SELECT 
  organization_id,
  DATE_TRUNC('year', month) as year,
  SUM(total_income) as total_income,
  SUM(total_expenses) as total_expenses,
  SUM(net_cashflow) as net_cashflow
FROM cashflow_monthly
GROUP BY organization_id, DATE_TRUNC('year', month);

-- 2. Quarterly Cashflow
CREATE OR REPLACE VIEW cashflow_quarterly AS
SELECT 
  organization_id,
  DATE_TRUNC('quarter', month) as quarter,
  SUM(total_income) as total_income,
  SUM(total_expenses) as total_expenses,
  SUM(net_cashflow) as net_cashflow
FROM cashflow_monthly
GROUP BY organization_id, DATE_TRUNC('quarter', month);
