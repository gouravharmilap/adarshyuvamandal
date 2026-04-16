# Supabase Setup Guide for Adarsh Yuva Mandal

## Problem
The Supabase backend wasn't working because:
1. The API key was invalid
2. The database table wasn't created
3. No proper error handling

## Solution
Updated `data.js` with proper Supabase integration and fallback to localStorage.

---

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: `Adarsh Yuva Mandal`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
4. Click **Create new project**
5. Wait for the project to be created (2-3 minutes)

### Step 2: Get Your API Credentials

1. In your Supabase project, go to **Settings** (gear icon)
2. Click **API**
3. Under **Project API credentials**, copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: The long string starting with `eyJ...`

### Step 3: Update data.js

Open `data.js` and replace the placeholder values:

```javascript
// Replace these lines:
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// With your actual values:
const SUPABASE_URL = 'https://abcxyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 4: Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run**

This creates:
- `site_data` table
- Default data
- Proper indexes

### Step 5: Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Test the admin panel

---

## Verification

After setup, open browser console (F12) and you should see:
```
Supabase client initialized
initializeData called, DATA_VERSION: 10
Loaded from Supabase cloud
Data ready
```

---

## How It Works

1. **localStorage** is the primary storage for immediate access
2. **Supabase** syncs data to the cloud for cross-browser access
3. If Supabase fails, it gracefully falls back to localStorage only
4. Admin changes are saved to both localStorage and Supabase

---

## Troubleshooting

### "Invalid API key" error
- Check that you copied the **anon public** key correctly
- Make sure there are no extra spaces or characters

### "Table site_data does not exist"
- Run the `supabase-setup.sql` in SQL Editor

### Changes not showing
- Check browser console for errors
- Clear localStorage: `localStorage.clear()` in console
- Reload the page

### Still not working?
The system will continue to work with localStorage only. All changes will persist in the browser but won't sync across devices.
