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
        nextId INTEGER UNIQUE,
        prevId INTEGER UNIQUE,
        secret TEXT,
        FOREIGN KEY (nextId) REFERENCES Content(id),
        FOREIGN KEY (prevId) REFERENCES Content(id)
      );
    `);

    await db.execAsync(`
      CREATE INDEX idx_prevId ON Content(prevId);
      CREATE INDEX idx_nextId ON Content(nextId);
    `);

    await db.execAsync(`
      CREATE TABLE ContentToEdit (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        timestamp DATETIME,
        nextId INTEGER UNIQUE,
        prevId INTEGER UNIQUE,
        secret TEXT,
        FOREIGN KEY (nextId) REFERENCES Content(id),
        FOREIGN KEY (prevId) REFERENCES Content(id)
      );
    `);


    console.log(`Schema has been set in ${db.databaseName}`);
  } catch (error) {
    console.error("Error setting schema: ", error);
  }
}
