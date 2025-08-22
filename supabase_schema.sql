-- HaloGuessr Database Migration: Add Maps Table and Normalize Levels
-- Run this migration to add the maps table and modify existing levels table

-- Step 1: Create the maps table
CREATE TABLE maps (
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
ALTER TABLE levels ADD COLUMN map_id UUID REFERENCES maps(id) ON DELETE CASCADE;

-- Step 3: Create indexes for performance
CREATE INDEX idx_maps_name ON maps(name);
CREATE INDEX idx_maps_halo_game ON maps(halo_game);
CREATE INDEX idx_levels_map_id ON levels(map_id);

-- Step 4: Enable RLS on maps table
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policy for maps
CREATE POLICY "Allow public read access to maps" ON maps
    FOR SELECT USING (true);

-- Step 6: Add trigger for maps table timestamp updates
CREATE TRIGGER update_maps_updated_at BEFORE UPDATE ON maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: After running this migration, you'll need to:
-- 1. Populate the maps table with unique map data from existing levels
-- 2. Update all levels to reference the appropriate map_id
-- 3. Remove the old columns: map_path, map_name, halo_game, game_mode from levels table

-- Sample data structure:
-- maps.name example: "Blood Gulch", "Lockout", "Guardian"
-- maps.image_path example: "https://blob.vercel-storage.com/maps/blood-gulch.jpg"
