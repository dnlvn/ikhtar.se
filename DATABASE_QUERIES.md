# Database Queries Reference

## Table Creation

```sql
-- Create the main table
CREATE TABLE mobile_plans_public (
  plan_key TEXT PRIMARY KEY,
  operator TEXT NOT NULL,
  network TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  data_gb INTEGER,
  unlimited_data BOOLEAN DEFAULT FALSE,
  regular_price NUMERIC NOT NULL,
  campaign_price NUMERIC,
  campaign_text TEXT,
  campaign_months INTEGER,
  binding_months INTEGER DEFAULT 0,
  esim BOOLEAN DEFAULT FALSE,
  eu_roaming BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX idx_mobile_plans_active ON mobile_plans_public(is_active);
CREATE INDEX idx_mobile_plans_price ON mobile_plans_public(regular_price);
CREATE INDEX idx_mobile_plans_operator ON mobile_plans_public(operator);
CREATE INDEX idx_mobile_plans_updated ON mobile_plans_public(updated_at DESC);
```

## Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE mobile_plans_public ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active plans
CREATE POLICY "Allow public read access to active plans"
ON mobile_plans_public
FOR SELECT
TO public
USING (is_active = true);

-- For admin/backend updates, create authenticated policies
CREATE POLICY "Allow authenticated insert"
ON mobile_plans_public
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
ON mobile_plans_public
FOR UPDATE
TO authenticated
USING (true);
```

## Sample Data

```sql
-- Telia Plans
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
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
    'https://telia.se/privat/telefoni/abonnemang',
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
    'https://telia.se/privat/telefoni/abonnemang',
    TRUE
  );

-- Tele2 Plans
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
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
    'https://tele2.se/mobilabonnemang',
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
    'https://tele2.se/mobilabonnemang',
    TRUE
  );

-- Tre Plans
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
  (
    'tre-100gb-5g',
    'Tre',
    '5G',
    '100 GB',
    100,
    FALSE,
    349,
    249,
    'Kampanj: 100 kr rabatt i 12 månader',
    12,
    12,
    FALSE,
    TRUE,
    'https://tre.se/privat/abonnemang',
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
    'https://tre.se/privat/abonnemang',
    TRUE
  );

-- Telenor Plans
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
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
    'https://telenor.se/abonnemang',
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
    'https://telenor.se/abonnemang',
    TRUE
  );

-- Hallon Plans (budget operator)
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
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
  );
```

## Useful Queries

### Get all active plans sorted by price
```sql
SELECT * FROM mobile_plans_public
WHERE is_active = true
ORDER BY 
  COALESCE(campaign_price, regular_price) ASC;
```

### Get plans with campaigns
```sql
SELECT 
  operator,
  plan_name,
  regular_price,
  campaign_price,
  campaign_text,
  (regular_price - campaign_price) as savings
FROM mobile_plans_public
WHERE is_active = true
  AND campaign_price IS NOT NULL
ORDER BY savings DESC;
```

### Get cheapest plan per operator
```sql
SELECT DISTINCT ON (operator)
  operator,
  plan_name,
  COALESCE(campaign_price, regular_price) as effective_price,
  data_gb,
  unlimited_data
FROM mobile_plans_public
WHERE is_active = true
ORDER BY operator, effective_price ASC;
```

### Get plans with no binding
```sql
SELECT * FROM mobile_plans_public
WHERE is_active = true
  AND binding_months = 0
ORDER BY COALESCE(campaign_price, regular_price) ASC;
```

### Get eSIM plans
```sql
SELECT * FROM mobile_plans_public
WHERE is_active = true
  AND esim = true
ORDER BY COALESCE(campaign_price, regular_price) ASC;
```

### Get best value (price per GB)
```sql
SELECT 
  operator,
  plan_name,
  data_gb,
  COALESCE(campaign_price, regular_price) as effective_price,
  ROUND(COALESCE(campaign_price, regular_price)::numeric / data_gb, 2) as price_per_gb
FROM mobile_plans_public
WHERE is_active = true
  AND unlimited_data = false
  AND data_gb > 0
ORDER BY price_per_gb ASC
LIMIT 10;
```

### Update campaign status (for automation)
```sql
-- Mark expired campaigns
UPDATE mobile_plans_public
SET campaign_price = NULL,
    campaign_text = NULL,
    campaign_months = NULL
WHERE campaign_price IS NOT NULL
  AND updated_at < NOW() - INTERVAL '30 days';
```

### Deactivate old plans
```sql
UPDATE mobile_plans_public
SET is_active = false
WHERE updated_at < NOW() - INTERVAL '90 days';
```

## Maintenance Queries

### View plan statistics
```sql
SELECT 
  COUNT(*) as total_plans,
  COUNT(*) FILTER (WHERE is_active = true) as active_plans,
  COUNT(*) FILTER (WHERE campaign_price IS NOT NULL) as plans_with_campaigns,
  COUNT(DISTINCT operator) as total_operators,
  AVG(COALESCE(campaign_price, regular_price)) as avg_price,
  MIN(COALESCE(campaign_price, regular_price)) as min_price,
  MAX(COALESCE(campaign_price, regular_price)) as max_price
FROM mobile_plans_public;
```

### Plans by operator
```sql
SELECT 
  operator,
  COUNT(*) as plan_count,
  AVG(COALESCE(campaign_price, regular_price)) as avg_price,
  MIN(COALESCE(campaign_price, regular_price)) as min_price
FROM mobile_plans_public
WHERE is_active = true
GROUP BY operator
ORDER BY plan_count DESC;
```

### Recently updated plans
```sql
SELECT 
  operator,
  plan_name,
  updated_at,
  COALESCE(campaign_price, regular_price) as price
FROM mobile_plans_public
WHERE is_active = true
ORDER BY updated_at DESC
LIMIT 20;
```
