-- Migration: Add Maps Table and Normalize Levels
-- This migration separates map data from levels to eliminate redundant blob storage

-- Step 1: Create the maps table
CREATE TABLE public.maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    image_path TEXT NOT NULL, -- Path to map image in blob storage
    halo_game TEXT NOT NULL,
    game_mode TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Add map_id column to existing levels table
ALTER TABLE public.levels ADD COLUMN map_id UUID REFERENCES public.maps(id) ON DELETE CASCADE;

-- Step 3: Create indexes for performance
CREATE INDEX idx_maps_name ON maps(name);
CREATE INDEX idx_maps_halo_game ON maps(halo_game);
CREATE INDEX idx_levels_map_id ON levels(map_id);

-- Step 4: Enable RLS on maps table
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policy for maps
CREATE POLICY "Allow public read access to maps" ON maps
    FOR SELECT USING (true);

-- Step 6: After running this migration, you'll need to:
-- 1. Run the data migration script: node scripts/normalize-maps.js
-- 2. Once verified, remove old columns from levels table:
--    ALTER TABLE public.levels DROP COLUMN "mapPath";
--    ALTER TABLE public.levels DROP COLUMN "mapName"; 
--    ALTER TABLE public.levels DROP COLUMN "haloGame";
--    ALTER TABLE public.levels DROP COLUMN "gameMode";
