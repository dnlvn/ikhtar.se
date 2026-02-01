# Supabase Integration Guide

## 🎉 Complete Supabase Integration

Your mobile subscription comparison app is now fully integrated with Supabase!

## 📊 Database Schema

### Table: `mobile_plans_public` (preferred) or `mobile_plans` (fallback)

```sql
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

CREATE INDEX idx_mobile_plans_active ON mobile_plans_public(is_active);
CREATE INDEX idx_mobile_plans_price ON mobile_plans_public(regular_price);
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
- Supabase Dashboard → Project Settings → API

### 2. Database Setup

Run the SQL schema above in your Supabase SQL editor to create the table.

### 3. Sample Data (Optional)

```sql
INSERT INTO mobile_plans_public (
  plan_key, operator, network, plan_name, data_gb, unlimited_data,
  regular_price, campaign_price, campaign_text, campaign_months,
  binding_months, esim, eu_roaming, source_url, is_active
) VALUES
  ('telia-unlimited-5g', 'Telia', '5G', 'Obegränsad Surf', NULL, TRUE, 399, 299, 'Kampanjpris i 12 månader', 12, 0, TRUE, TRUE, 'https://telia.se', TRUE),
  ('tele2-50gb', 'Tele2', '4G', '50 GB Surf', 50, FALSE, 299, NULL, NULL, NULL, 0, TRUE, TRUE, 'https://tele2.se', TRUE),
  ('tre-100gb-5g', 'Tre', '5G', '100 GB', 100, FALSE, 349, 249, 'Halva priset i 6 månader', 6, 12, FALSE, TRUE, 'https://tre.se', TRUE);
```

## 📁 File Structure

```
/src
├── lib/
│   └── supabase.ts          # Supabase client
├── hooks/
│   ├── usePlans.ts          # Fetch plans from DB
│   └── useFilteredPlans.ts  # Client-side filtering/sorting
└── app/
    ├── App.tsx              # Main app with integration
    └── components/
        ├── PlanCard.tsx     # Display plan data
        ├── PlanCardSkeleton.tsx
        ├── QuickFilters.tsx # Combinable filters
        └── FilterBar.tsx    # Sort options
```

## 🎯 Features Implemented

### ✅ Data Fetching
- Single fetch on mount via `usePlans()` hook
- Auto-fallback from `mobile_plans_public` to `mobile_plans`
- Only fetches active plans (`is_active = true`)
- Loading states with skeletons
- Error handling with retry button

### ✅ Filtering (Combinable)
- **Cheapest**: Sorts by price ascending
- **Most Data**: Sorts by data descending (unlimited treated as highest)
- **No Binding**: Filters `binding_months = 0`
- **eSIM**: Filters `esim = true`
- **EU Roaming**: Filters `eu_roaming = true`

All filters can be combined and toggled on/off!

### ✅ Sorting Options
- **Price: Lowest First** - Ascending by effective price
- **Price: Highest First** - Descending by effective price
- **Most Data** - Descending by GB (unlimited first)
- **Best Value** - Price per GB (excludes unlimited)

### ✅ UI Components
- **Results Counter**: Shows filtered count
- **Sort Label**: Displays current sort in results header
- **Effective Price**: Shows `campaign_price` if exists, else `regular_price`
- **Campaign Display**: Shows campaign text and months conditionally
- **Empty State**: "No matches" with clear filters button
- **Loading Skeletons**: Separate for mobile/desktop
- **Error State**: With retry functionality

## 🔄 Data Flow

```
Supabase Database
    ↓
usePlans() hook
    ├─ Fetch plans (is_active = true)
    ├─ Transform to UI format
    └─ Return { plans, loading, error }
    ↓
useFilteredPlans() hook
    ├─ Apply combinable filters
    ├─ Apply sort (or override from quick filter)
    └─ Return filtered array (memoized)
    ↓
UI Components
    └─ Render PlanCard for each result
```

## 💡 Key Implementation Details

### Effective Price Calculation
```typescript
effectivePrice = campaign_price ?? regular_price
```

### Unlimited Data Handling
- Stored as `unlimited_data: true` + `data_gb: null`
- Displayed as "Unlimited" label
- Sorted as highest value in data sorts
- Excluded from best value calculation

### Campaign Conditionals
```typescript
if (plan.campaign) {
  // Show campaign badge
  // Show savings calculation
  // Show campaign text + months
  // Show urgency indicator
}
```

### Filter Combination
- Uses `Set<QuickFilter>` for active filters
- Filters applied as AND conditions
- Sort overridden by cheapest/most-data chips
- All other filters maintain current sort

## 🚀 Performance

- **Single Fetch**: All data fetched once on mount
- **Client-Side Filtering**: No re-fetches when filtering
- **Memoization**: `useFilteredPlans` uses `useMemo`
- **Optimized Sorts**: Efficient comparison functions
- **Type Safety**: Full TypeScript coverage

## 🐛 Error Handling

### Database Errors
- Caught and displayed with user-friendly message
- Retry button triggers page reload
- Error state prevents showing stale data

### Missing Environment Variables
- Supabase client handles gracefully
- Empty URL/key will cause fetch to fail
- Error message guides user to check setup

## 📝 Type Definitions

### Database Type
```typescript
interface MobilePlanDB {
  plan_key: string;
  operator: string;
  network: string;
  plan_name: string;
  data_gb: number | null;
  unlimited_data: boolean;
  regular_price: number;
  campaign_price: number | null;
  campaign_text: string | null;
  campaign_months: number | null;
  binding_months: number;
  esim: boolean;
  eu_roaming: boolean;
  source_url: string;
  updated_at: string;
  is_active: boolean;
}
```

### UI Type
```typescript
interface Plan {
  id: string;
  operator: string;
  network: string;
  name: string;
  dataLabel: string;
  dataGb: number | null;
  isUnlimited: boolean;
  effectivePrice: number;
  regularPrice: number;
  bindingMonths: number;
  esim: boolean;
  euRoaming: boolean;
  campaign: {
    price: number;
    text: string;
    months: number;
  } | null;
  sourceUrl: string;
}
```

## ✨ Next Steps

1. **Add Row-Level Security (RLS)** in Supabase
2. **Set up scheduled updates** for plan data
3. **Add analytics tracking** for popular filters
4. **Implement plan comparison** (side-by-side)
5. **Add real-time updates** with Supabase subscriptions
6. **Create admin panel** for plan management

## 🎨 Styling Notes

- Cards adapt to campaign/top deal status
- Loading skeletons match card layouts
- Empty state is friendly and actionable
- Error state is clear with recovery option
- Maintains existing green/gold theme
