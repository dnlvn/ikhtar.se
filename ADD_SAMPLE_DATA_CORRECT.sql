-- ============================================
-- CORRECT SAMPLE DATA FOR YOUR TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Clear existing data (optional)
-- DELETE FROM mobile_plans_public;

-- Insert 12 sample Swedish mobile plans
-- Note: current_price is auto-calculated, so we don't insert it
INSERT INTO mobile_plans_public (
  plan_key, operator, plan_name, network, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url
) VALUES
  
  -- ===== TELIA =====
  ('telia-unlimited-5g', 'Telia', 'Obegränsad Surf 5G', '5G', NULL, TRUE, 399, 299, 'Kampanjpris i 12 månader', 12, 0, TRUE, TRUE, 'https://www.telia.se/privat/telefoni/abonnemang'),
  ('telia-100gb-5g', 'Telia', '100 GB 5G', '5G', 100, FALSE, 349, NULL, NULL, NULL, 0, TRUE, TRUE, 'https://www.telia.se/privat/telefoni/abonnemang'),
  
  -- ===== TELE2 =====
  ('tele2-50gb-4g', 'Tele2', '50 GB 4G', '4G', 50, FALSE, 299, 249, 'Halva priset i 6 månader', 6, 0, TRUE, TRUE, 'https://www.tele2.se/abonnemang'),
  ('tele2-unlimited-5g', 'Tele2', 'Obegränsad 5G', '5G', NULL, TRUE, 379, NULL, NULL, NULL, 12, TRUE, TRUE, 'https://www.tele2.se/abonnemang'),
  
  -- ===== TRE =====
  ('tre-100gb-5g', 'Tre', '100 GB 5G', '5G', 100, FALSE, 349, 249, 'Kampanj: 100 kr rabatt', 3, 12, FALSE, TRUE, 'https://www.tre.se/privat/abonnemang'),
  ('tre-30gb-4g', 'Tre', '30 GB 4G', '4G', 30, FALSE, 199, NULL, NULL, NULL, 0, FALSE, TRUE, 'https://www.tre.se/privat/abonnemang'),
  
  -- ===== TELENOR =====
  ('telenor-unlimited-5g', 'Telenor', 'Obegränsad 5G', '5G', NULL, TRUE, 389, 299, 'Extrapris i 3 månader', 3, 0, TRUE, TRUE, 'https://www.telenor.se/abonnemang'),
  ('telenor-20gb-4g', 'Telenor', '20 GB 4G', '4G', 20, FALSE, 249, NULL, NULL, NULL, 0, TRUE, TRUE, 'https://www.telenor.se/abonnemang'),
  
  -- ===== HALLON (Budget) =====
  ('hallon-unlimited-4g', 'Hallon', 'Obegränsad 4G', '4G', NULL, TRUE, 299, NULL, NULL, NULL, 0, TRUE, TRUE, 'https://www.hallon.se'),
  ('hallon-50gb-4g', 'Hallon', '50 GB 4G', '4G', 50, FALSE, 229, 199, 'Kampanjpris - begränsad tid', NULL, 0, TRUE, TRUE, 'https://www.hallon.se'),
  
  -- ===== COMVIQ (Budget) =====
  ('comviq-100gb-4g', 'Comviq', '100 GB 4G', '4G', 100, FALSE, 279, NULL, NULL, NULL, 0, TRUE, TRUE, 'https://www.comviq.se'),
  ('comviq-25gb-4g', 'Comviq', '25 GB 4G', '4G', 25, FALSE, 179, 149, 'Introduktionspris', NULL, 0, TRUE, TRUE, 'https://www.comviq.se');

-- Verify insertion
SELECT 
  COUNT(*) as total_plans,
  COUNT(*) FILTER (WHERE campaign_price IS NOT NULL) as plans_with_campaigns,
  COUNT(DISTINCT operator) as operators,
  MIN(current_price) as cheapest_price,
  MAX(current_price) as highest_price
FROM mobile_plans_public;

-- Show cheapest 5 plans
SELECT 
  plan_key,
  operator,
  plan_name,
  CASE 
    WHEN unlimited_data THEN 'Unlimited'
    ELSE data_gb || ' GB'
  END as data,
  network,
  current_price as price,
  CASE WHEN campaign_price IS NOT NULL THEN '🔥 KAMPANJ' ELSE '' END as badge
FROM mobile_plans_public
ORDER BY current_price ASC
LIMIT 5;