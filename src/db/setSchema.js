export async function setSchema(db) {
  try {
    // Initialize schema
    await db.execAsync(`
      CREATE TABLE Content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,  -- New timestamp column
        next_id INTEGER UNIQUE,
        prev_id INTEGER UNIQUE,
        FOREIGN KEY (next_id) REFERENCES Content(id),
        FOREIGN KEY (prev_id) REFERENCES Content(id)
      );
    `);

    await db.execAsync(`
      CREATE INDEX idx_prev_id ON Content(prev_id);
      CREATE INDEX idx_next_id ON Content(next_id);
      `);

    console.log(`Schema has been set in ${db.databaseName}`);
  } catch (error) {
    console.error("Error setting schema: ", error);
  }
}

