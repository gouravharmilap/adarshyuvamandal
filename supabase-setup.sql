-- Supabase Setup for Adarsh Yuva Mandal
-- Run this in your Supabase SQL Editor

-- 1. Create the site_data table
CREATE TABLE IF NOT EXISTS site_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert default data
INSERT INTO site_data (id, data) VALUES ('main', '{
    "updates": [
        {"id": 1, "text": "🎉 Vishal Jagaran 2026 registrations now open!", "date": "2026-04-10", "active": true}
    ],
    "gallery": [],
    "memories": [],
    "thoughts": []
}') ON CONFLICT (id) DO NOTHING;

-- 3. Disable Row Level Security for now (public read/write)
ALTER TABLE site_data DISABLE ROW LEVEL SECURITY;

-- 4. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_data_id ON site_data(id);

-- 5. Function to update timestamp on data change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_site_data_updated_at ON site_data;
CREATE TRIGGER update_site_data_updated_at
    BEFORE UPDATE ON site_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
