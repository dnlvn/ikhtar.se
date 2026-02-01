-- ============================================
-- SAMPLE DATA FOR MOBILE PLANS
-- Run this in Supabase SQL Editor
-- ============================================

-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM mobile_plans_public;

-- Insert 12 sample Swedish mobile plans
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
  
  -- ===== TELIA =====
  (
    'telia-unlimited-5g',
    'Telia',
    '5G',
    'Obegränsad Surf',
    NULL,
    TRUE,
    399,
    299,
    'Kampanjpris i 12 månader',
    12,
    0,
    TRUE,
    TRUE,
    'https://telia.se',
    TRUE
  ),
  (
    'telia-100gb-5g',
    'Telia',
    '5G',
    '100 GB',
    100,
    FALSE,
    349,
    NULL,
    NULL,
    NULL,
    0,
    TRUE,
    TRUE,
    'https://telia.se',
    TRUE
  ),
  
  -- ===== TELE2 =====
  (
    'tele2-50gb-4g',
    'Tele2',
    '4G',
    '50 GB',
    50,
    FALSE,
    299,
    249,
    'Halva priset i 6 månader',
    6,
    0,
    TRUE,
    TRUE,
    'https://tele2.se',
    TRUE
  ),
  (
    'tele2-unlimited-5g',
    'Tele2',
    '5G',
    'Obegränsad',
    NULL,
    TRUE,
    379,
    NULL,
    NULL,
    NULL,
    12,
    TRUE,
    TRUE,
    'https://tele2.se',
    TRUE
  ),
  
  -- ===== TRE =====
  (
    'tre-100gb-5g',
    'Tre',
    '5G',
    '100 GB',
    100,
    FALSE,
    349,
    249,
    'Kampanj: 100 kr rabatt',
    12,
    12,
    FALSE,
    TRUE,
    'https://tre.se',
    TRUE
  ),
  (
    'tre-30gb-4g',
    'Tre',
    '4G',
    '30 GB',
    30,
    FALSE,
    199,
    NULL,
    NULL,
    NULL,
    0,
    FALSE,
    TRUE,
    'https://tre.se',
    TRUE
  ),
  
  -- ===== TELENOR =====
  (
    'telenor-unlimited-5g',
    'Telenor',
    '5G',
    'Obegränsad',
    NULL,
    TRUE,
    389,
    299,
    'Extrapris i 3 månader',
    3,
    0,
    TRUE,
    TRUE,
    'https://telenor.se',
    TRUE
  ),
  (
    'telenor-20gb-4g',
    'Telenor',
    '4G',
    '20 GB',
    20,
    FALSE,
    249,
    NULL,
    NULL,
    NULL,
    0,
    TRUE,
    TRUE,
    'https://telenor.se',
    TRUE
  ),
  
  -- ===== HALLON (Budget) =====
  (
    'hallon-unlimited-4g',
    'Hallon',
    '4G',
    'Obegränsad',
    NULL,
    TRUE,
    299,
    NULL,
    NULL,
    NULL,
    0,
    TRUE,
    TRUE,
    'https://hallon.se',
    TRUE
  ),
  (
    'hallon-50gb-4g',
    'Hallon',
    '4G',
    '50 GB',
    50,
    FALSE,
    229,
    199,
    'Kampanjpris - begränsad tid',
    0,
    0,
    TRUE,
    TRUE,
    'https://hallon.se',
    TRUE
  ),
  
  -- ===== COMVIQ (Budget) =====
  (
    'comviq-100gb-4g',
    'Comviq',
    '4G',
    '100 GB',
    100,
    FALSE,
    279,
    NULL,
    NULL,
    NULL,
    0,
    TRUE,
    TRUE,
    'https://comviq.se',
    TRUE
  ),
  (
    'comviq-25gb-4g',
    'Comviq',
    '4G',
    '25 GB',
    25,
    FALSE,
    179,
    149,
    'Introduktionspris',
    3,
    0,
    TRUE,
    TRUE,
    'https://comviq.se',
    TRUE
  )

ON CONFLICT (plan_key) DO NOTHING;

-- Verify insertion
SELECT 
  COUNT(*) as total_plans,
  COUNT(*) FILTER (WHERE campaign_price IS NOT NULL) as plans_with_campaigns,
  COUNT(DISTINCT operator) as operators,
  MIN(COALESCE(campaign_price, regular_price)) as cheapest_price,
  MAX(COALESCE(campaign_price, regular_price)) as highest_price
FROM mobile_plans_public
WHERE is_active = true;

-- Show cheapest 5 plans
SELECT 
  operator,
  plan_name,
  CASE 
    WHEN unlimited_data THEN 'Unlimited'
    ELSE data_gb || ' GB'
  END as data,
  COALESCE(campaign_price, regular_price) as price,
  CASE WHEN campaign_price IS NOT NULL THEN '🔥 KAMPANJ' ELSE '' END as badge
FROM mobile_plans_public
WHERE is_active = true
ORDER BY COALESCE(campaign_price, regular_price) ASC
LIMIT 5;
