# ✅ Table Already Exists - Next Steps

## Good news! Your `mobile_plans_public` table is already created.

## 🚀 What to Do Now (3 Simple Steps):

### Step 1: Add Sample Data
Copy and paste the contents of `/ADD_SAMPLE_DATA.sql` into Supabase SQL Editor and click "Run".

This will add 12 Swedish mobile plans to test with.

### Step 2: Update .env File
Edit `/.env` in your project root:

```bash
VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** key → VITE_SUPABASE_ANON_KEY

### Step 3: Restart Dev Server
```bash
# Stop server (Ctrl+C or Cmd+C)
npm run dev
```

## ✨ That's It!

Your app should now:
- ✅ Load without the setup guide
- ✅ Display 12 mobile plans
- ✅ Show campaign badges on deals
- ✅ Filter and sort working perfectly

---

## 🧪 Quick Test

After setup, try:
1. Click "💰 Billigast" - should sort by lowest price
2. Click "📱 Mest data" - should show unlimited/high GB first
3. Click "🔓 Ingen bindning" - should filter to 0-month binding
4. Click "eSIM" - should show only eSIM-compatible plans
5. Use sort dropdown - should re-sort results

---

## 📊 Sample Data Included

The sample data includes:
- **Operators**: Telia, Tele2, Tre, Telenor, Hallon, Comviq
- **Price Range**: 149 kr - 399 kr/month
- **5 Plans with campaigns** (price reductions)
- **3 Unlimited data** plans
- **Various GB amounts**: 20GB, 25GB, 30GB, 50GB, 100GB
- **Mix of 4G and 5G**
- **All have EU roaming**
- **Most support eSIM**

---

## 🔍 Verify Data Was Added

Run this in Supabase SQL Editor:

```sql
SELECT * FROM mobile_plans_public WHERE is_active = true;
```

You should see 12 rows.

---

## ❓ Troubleshooting

### App still shows setup guide?
- Make sure `.env` has REAL credentials (not "your-project" placeholders)
- Restart dev server after editing `.env`

### "Kunde inte hämta abonnemang" error?
Run this to enable public read access:

```sql
ALTER TABLE mobile_plans_public ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON mobile_plans_public
FOR SELECT
TO public
USING (is_active = true);
```

### No plans showing?
Check if data exists:
```sql
SELECT COUNT(*) FROM mobile_plans_public WHERE is_active = true;
```

If returns 0, run `/ADD_SAMPLE_DATA.sql` again.

---

## 📚 Files Reference

- `/ADD_SAMPLE_DATA.sql` - Ready-to-run sample data
- `/SUPABASE_QUICK_START.md` - Detailed troubleshooting
- `/DATABASE_QUERIES.md` - More SQL examples
- `/SUPABASE_INTEGRATION.md` - Full technical docs

---

**Ready?** Follow the 3 steps above and you'll be running in 2 minutes! 🎉
