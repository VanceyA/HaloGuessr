import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Use the service_role key for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function normalizeMapsAndLevels() {
  console.log('Starting maps normalization migration...');

  try {
    // Step 1: Fetch all existing levels
    console.log('Fetching existing levels...');
    const { data: existingLevels, error: fetchError } = await supabase
      .from('levels')
      .select('*');

    if (fetchError) {
      throw new Error(`Failed to fetch levels: ${fetchError.message}`);
    }

    console.log(`Found ${existingLevels.length} existing levels`);

    // Step 2: Extract unique maps from levels
    const uniqueMaps = new Map();

    existingLevels.forEach(level => {
      const mapKey = `${level.mapName}_${level.haloGame}_${level.gameMode || 'default'}`;

      if (!uniqueMaps.has(mapKey)) {
        uniqueMaps.set(mapKey, {
          name: level.mapName,
          image_path: level.mapPath,
          halo_game: level.haloGame,
          game_mode: level.gameMode,
          description: null
        });
      }
    });

    console.log(`Identified ${uniqueMaps.size} unique maps`);

    // Step 3: Create new maps table and insert unique maps
    console.log('Creating maps table...');

    // First, create the new tables (you may need to run the schema manually first)
    const mapsToInsert = Array.from(uniqueMaps.values());

    const { data: insertedMaps, error: mapsInsertError } = await supabase
      .from('maps')
      .insert(mapsToInsert)
      .select('*');

    if (mapsInsertError) {
      throw new Error(`Failed to insert maps: ${mapsInsertError.message}`);
    }

    console.log(`Successfully inserted ${insertedMaps.length} maps`);

    // Step 4: Create a mapping from map name/game to map ID
    const mapNameToId = new Map();
    insertedMaps.forEach(map => {
      const mapKey = `${map.name}_${map.halo_game}_${map.game_mode || 'default'}`;
      mapNameToId.set(mapKey, map.id);
    });

    // Step 5: Prepare new levels data with map_id references
    console.log('Preparing normalized levels data...');
    const normalizedLevels = existingLevels.map(level => {
      const mapKey = `${level.mapName}_${level.haloGame}_${level.gameMode || 'default'}`;
      const mapId = mapNameToId.get(mapKey);

      if (!mapId) {
        throw new Error(`Could not find map ID for level ${level.id}`);
      }

      return {
        id: level.id, // Keep the same ID to maintain blob URL compatibility
        map_id: mapId,
        screenshotPath: level.screenshotPath,
        levelName: level.levelName,
        location: level.location
      };
    });

    // Step 6: Update existing levels with map_id references
    console.log('Updating existing levels with map_id references...');

    // Check if maps table exists and has data
    const { data: mapsCheck } = await supabase
      .from('maps')
      .select('id')
      .limit(1);

    if (!mapsCheck || mapsCheck.length === 0) {
      console.log('Maps table not found or empty. Please run the migration SQL first.');
      return;
    }

    // Update each level with its corresponding map_id
    let updatedCount = 0;
    for (const levelData of normalizedLevels) {
      const { error: updateError } = await supabase
        .from('levels')
        .update({ map_id: levelData.map_id })
        .eq('id', levelData.id);

      if (updateError) {
        console.error(`Failed to update level ${levelData.id}:`, updateError);
        throw new Error(`Failed to update level ${levelData.id}: ${updateError.message}`);
      }
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} levels with map_id references`);

    // Step 8: Verify the migration
    console.log('Verifying migration...');
    const { data: verifyLevels } = await supabase
      .from('levels')
      .select(`
        *,
        maps (
          name,
          image_path,
          halo_game
        )
      `)
      .limit(5);

    console.log('Sample normalized data:');
    console.log(JSON.stringify(verifyLevels, null, 2));

    console.log('✅ Migration completed successfully!');
    console.log('All existing levels have been preserved and updated with map references.');
    console.log('You can now safely remove the old columns from levels table:');
    console.log('  ALTER TABLE public.levels DROP COLUMN "mapPath";');
    console.log('  ALTER TABLE public.levels DROP COLUMN "mapName";');
    console.log('  ALTER TABLE public.levels DROP COLUMN "haloGame";');
    console.log('  ALTER TABLE public.levels DROP COLUMN "gameMode";');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Execute migration
normalizeMapsAndLevels().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
