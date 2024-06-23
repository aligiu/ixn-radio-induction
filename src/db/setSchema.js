export async function setSchema(db) {
  try {
    // Initialize schema
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Content (
            json_string TEXT
    )`);

    console.log(`Schema has been set in ${db.databaseName}`);
  } catch (error) {
    console.error("Error setting schema: ", error);
  }
}