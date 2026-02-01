# 🚀 Supabase Quick Start - Table Already Exists!

## ✅ Good News!

Your table `mobile_plans_public` already exists in Supabase. You can skip the CREATE TABLE step.

## Option 1: Use Existing Table (Recommended)

### Step 1: Check What's in the Table

Run this in Supabase SQL Editor:

```sql
SELECT * FROM mobile_plans_public;
```

If you see data, you're all set! Just update your `.env` file and restart.

### Step 2: Update .env File

Update `/.env` in your project:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Get these from: Supabase Dashboard → Settings → API

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

Done! Your app should now load with data from Supabase.

---

## Option 2: Add Sample Data (If Table is Empty)

If the table exists but has no data, add some test plans:

```sql
-- Insert sample Swedish mobile plans
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
  -- Telia Plans
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
  
  -- Tele2 Plans
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
  
  -- Tre Plans
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
  
  -- Telenor Plans
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
  
  -- Hallon Plans (Budget)
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
  
  -- Comviq Plans (Budget)
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
  );
```

After inserting, verify:

```sql
SELECT COUNT(*) FROM mobile_plans_public WHERE is_active = true;
```

You should see 12 plans.

---

## Option 3: Start Fresh (If You Want to Recreate)

Only do this if you want to completely reset the table:

```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS mobile_plans_public;

-- Then create fresh
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

-- Add indexes
CREATE INDEX idx_mobile_plans_active ON mobile_plans_public(is_active);
CREATE INDEX idx_mobile_plans_price ON mobile_plans_public(regular_price);
```

---

## Verify Everything Works

### 1. Check Table Structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'mobile_plans_public'
ORDER BY ordinal_position;
```

### 2. View Sample Data

```sql
SELECT 
  operator,
  plan_name,
  data_gb,
  unlimited_data,
  COALESCE(campaign_price, regular_price) as price,
  esim,
  eu_roaming
FROM mobile_plans_public
WHERE is_active = true
ORDER BY COALESCE(campaign_price, regular_price) ASC
LIMIT 5;
```

### 3. Test Filtering

```sql
-- Test eSIM filter
SELECT COUNT(*) FROM mobile_plans_public WHERE esim = true;

-- Test no binding filter
SELECT COUNT(*) FROM mobile_plans_public WHERE binding_months = 0;

-- Test unlimited data
SELECT COUNT(*) FROM mobile_plans_public WHERE unlimited_data = true;
```

---

## Final Checklist

- [ ] Table `mobile_plans_public` exists
- [ ] Sample data inserted (or existing data verified)
- [ ] `.env` file updated with real credentials
- [ ] Dev server restarted
- [ ] App loads without setup guide
- [ ] Plans display in the UI

---

## Need Help?

### Table exists but app still shows setup guide?

Check your `.env` file:
```bash
# Make sure these are YOUR actual values, not placeholders
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Can't find your credentials?

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click Settings (gear icon) → API
4. Copy:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** key → VITE_SUPABASE_ANON_KEY

### App shows "Kunde inte hämta abonnemang"?

Check RLS (Row Level Security):

```sql
-- View RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'mobile_plans_public';

-- If RLS is enabled, add policy
ALTER TABLE mobile_plans_public ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON mobile_plans_public
FOR SELECT
TO public
USING (is_active = true);
```

---

## Quick Test

After setup, your app should:
- ✅ Show plans sorted by price
- ✅ Filter by clicking chips
- ✅ Sort using dropdown
- ✅ Display campaign badges
- ✅ Show "BÄSTA ERBJUDANDET" on cheapest plan

**That's it! You're all set!** 🎉
