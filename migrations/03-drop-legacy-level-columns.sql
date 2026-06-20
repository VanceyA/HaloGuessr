-- Drop legacy denormalized columns from levels that were moved to the maps table
-- in migration 01. All code now reads via the map_id FK join. Safe to run after
-- normalize-maps.js has been executed (map_id is populated on every level).

ALTER TABLE public.levels DROP COLUMN IF EXISTS "mapPath";
ALTER TABLE public.levels DROP COLUMN IF EXISTS "mapName";
ALTER TABLE public.levels DROP COLUMN IF EXISTS "haloGame";
ALTER TABLE public.levels DROP COLUMN IF EXISTS "gameMode";

-- Drop the indexes that targeted the now-removed columns
DROP INDEX IF EXISTS idx_levels_halo_game;
DROP INDEX IF EXISTS idx_levels_map_name;
