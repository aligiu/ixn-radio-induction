export async function dropTable(db, table) {
  try {
    await db.execAsync(`
        DROP TABLE IF EXISTS ${table} 
      `);

    console.log(`${db.databaseName}.${table} has been dropped`);
  } catch (error) {
    console.error(
      `Error deleting from table ${db.databaseName}.${table}`,
      error
    );
  }
}

export async function deleteFromTable(db, table) {
  try {
    await db.execAsync(`
          DELETE FROM ${table} 
        `);

    console.log(`${db.databaseName}.${table} has been cleared`);
  } catch (error) {
    console.error(`Error dropping table ${db.databaseName}.${table}`, error);
  }
}
