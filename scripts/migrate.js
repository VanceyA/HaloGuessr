import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Ensure you have KV_REST_API_URL, KV_REST_API_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in your .env or environment
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Use the service_role key for server-side operations/migrations - safer and bypasses RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Make sure this variable is set with your service role key
);

async function migrateLevels() {
  console.log('Starting levels data migration...');

  // --- Add Ping Check ---
  try {
      console.log('Pinging Redis...');
      const pong = await redis.ping();
      console.log('Redis Ping response:', pong); // Should log 'PONG' if successful
  } catch (pingError) {
      console.error('Failed to ping Redis. Check credentials and network:', pingError);
      // Exit or throw if ping fails
      throw new Error('Redis connection failed');
  }
  // --- End Ping Check ---

   // --- Test a simple GET to ensure basic data retrieval works ---
  try {
      console.log('Attempting a simple GET on a known key (if you have one)...');
      // Optional: replace 'screenshot:some_known_id' with a key you know exists
      // const testKey = 'screenshot:'; // If you know a specific ID, use that
      // const testValue = await redis.get(testKey);
      // console.log(`Simple GET on "${testKey}" result:`, testValue);
      // if (testValue) {
      //      console.log('--- Content of test key ---');
      //      console.log(JSON.stringify(testValue, null, 2)); // Stringify to see structure
      //      console.log('--- End content ---');
      // }
      console.log('Skipping simple GET test for now.'); // Keep this line if you don't have a known key
  } catch (getError) {
      console.error('Failed during simple GET (optional test):', getError);
      // Continue, as GET failing might just mean the key doesn't exist, not a core issue.
  }
  // --- End Test ---


  const pattern = 'screenshot:*';
  let totalMigrated = 0;

  try {
    console.log(`Fetching all keys matching pattern "${pattern}" using KEYS command...`);

    // Use KEYS instead of SCAN (as SCAN had deserialization issues)
    const keys = await redis.keys(pattern);

    console.log(`Found ${keys.length} keys matching pattern "${pattern}".`);

    if (keys.length === 0) {
      console.log(`No keys found matching pattern "${pattern}".`);
      console.log('Levels migration complete (no data to migrate).');
      return; // Exit function if no keys match the pattern
    }

    console.log(`Fetching values for ${keys.length} keys using MGET...`);

    // Fetch values for the keys
    const values = await redis.mget(...keys);

    const dataToInsert = values.map((value, index) => {
      const key = keys[index]; // Get the key associated with this value

      // --- Logging the value before processing ---
      console.log(`Processing key: ${key}`);
      if (value === null) {
          console.warn(`Skipping null value returned from MGET for key: ${key}.`);
          return null; // Skip if MGET returned null (key might have expired)
      }
      if (typeof value === 'object') {
           console.log('Value is already a JavaScript object.');
           // Log the object content as JSON string for inspection
           try {
               console.log('--- Value Content ---');
               console.log(JSON.stringify(value, null, 2));
               console.log('--- End Value Content ---');
           } catch (stringifyError) {
               console.error(`Failed to stringify value for key ${key}:`, stringifyError);
               // Continue even if stringifying for logging fails
           }
      } else {
           console.log(`Value is of type: ${typeof value}. Content: ${value}`);
           // If it's not an object, it might be a Redis list or something unexpected.
           // You could add more checks here based on what you expect.
           console.warn(`Unexpected value type for key ${key}. Skipping.`);
           return null;
      }
      // --- End Logging ---


      try {
        // *** REMOVE JSON.parse() ***
        // The value is already a JavaScript object returned by @upstash/redis MGET
        const obj = value; // Use the value directly

        // Make sure 'id' is included - CRITICAL for migration!
        // This is needed to match your existing Blob URLs and API usage.
        if (!obj || typeof obj !== 'object' || !obj.id) {
            console.warn(`Skipping key ${key} due to invalid or missing 'id' property after retrieval.`);
            return null;
        }
        return {
          id: obj.id, // <--- Use the ID from the already-parsed object!
          screenshotPath: obj.screenshotPath,
          mapPath: obj.mapPath,
          mapName: obj.mapName,
          levelName: obj.levelName,
          gameMode: obj.gameMode,
          haloGame: obj.haloGame,
          location: obj.location, // Storing the object directly in JSONB column
        };
      } catch (processingError) {
        console.error(`Failed to process object for key ${key}:`, processingError);
        return null; // Skip if any error occurs during processing
      }
    }).filter(item => item !== null); // Filter out any null entries

    console.log(`Prepared ${dataToInsert.length} valid records for insertion.`);

    if (dataToInsert.length > 0) {
      // Insert data into Supabase
      // If dataToInsert is large, break it into smaller chunks (e.g., 100-500 rows)
      // and perform multiple insert operations to avoid hitting Supabase payload limits.
      console.log(`Inserting ${dataToInsert.length} records into Supabase...`);
      const { data, error } = await supabase
        .from('levels') // Your Supabase table name
        .insert(dataToInsert)
        .select(); // Use .select() to get the inserted data and confirm count

      if (error) {
        console.error('Error inserting data into Supabase:', error);
        // Check for specific error codes, e.g., duplicate key violations if running again
        throw new Error(`Supabase insertion failed: ${error.message}`); // Propagate error
      } else {
        totalMigrated = data.length; // Count successfully inserted rows
        console.log(`Successfully inserted ${totalMigrated} levels into Supabase.`);
      }
    } else {
      console.log('No valid data to insert into Supabase.');
    }

    console.log(`Levels migration complete. Total migrated: ${totalMigrated}`);

  } catch (error) {
    console.error('An error occurred during levels migration:', error);
    // Re-throw the error after logging it for the outer catch block
    throw error;
  }
  // No finally block for closing redis connection with @upstash/redis as it's serverless
}

// Skipping recent views migration as planned

// Execute migrations
migrateLevels().catch(err => {
   console.error("Migration failed:", err);
   process.exit(1); // Exit with an error code to indicate failure
});
