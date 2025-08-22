# Database Migrations

This folder contains SQL migration files for the HaloGuessr database schema.

## Migration Files

- **`00-init.sql`** - Initial database schema representing the current state
- **`01-add-maps-table.sql`** - Adds maps table and normalizes levels structure

## Running Migrations

### Option 1: Supabase Dashboard
1. Copy the SQL content from each migration file
2. Run in your Supabase SQL Editor in order (00, 01, etc.)

### Option 2: Supabase CLI (if installed)
```bash
# Install Supabase CLI
npm install -g supabase

# Run migrations
supabase db reset --linked
```

## Migration 01: Maps Normalization

After running `01-add-maps-table.sql`:

1. **Populate maps table and update levels:**
   ```bash
   node scripts/normalize-maps.js
   ```

2. **Clean up old columns (after verification):**
   ```sql
   ALTER TABLE levels DROP COLUMN map_path;
   ALTER TABLE levels DROP COLUMN map_name; 
   ALTER TABLE levels DROP COLUMN halo_game;
   ALTER TABLE levels DROP COLUMN game_mode;
   ```

## Benefits of Migration 01

- **Eliminates redundant blob storage** - Each map image stored only once
- **Improves data consistency** - Single source of truth for map data
- **Enables better querying** - Efficient joins and filtering by map properties
- **Reduces storage costs** - No duplicate map images for multiple levels

## Schema Changes

### Before (Denormalized)
```
levels: id, screenshot_path, map_path, map_name, halo_game, game_mode, location, ...
```

### After (Normalized)
```
maps: id, name, image_path, halo_game, game_mode, description, ...
levels: id, map_id, screenshot_path, location, ...
```
