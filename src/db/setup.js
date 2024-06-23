import { mockedData } from "./mockedData";

// Users should not be stored locally!!!

export async function setup(db) {
  try {
    // Create each table if not exists and insert initial data
    // await db.execAsync(`CREATE TABLE IF NOT EXISTS Users (
    //                   email TEXT PRIMARY KEY NOT NULL,
    //                   hashed_password TEXT NOT NULL,
    //                   is_admin BOOLEAN
    //   )`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Content (
            json_string TEXT
    )`);

    // Delete all existing data
    // await db.execAsync(`DELETE FROM Users`);
    await db.execAsync(`DELETE FROM Content`);

    // // Insert data for Users
    // await db.execAsync(`
    //               INSERT INTO Users 
    //               VALUES ('user1@example.com', '111', 1),
    //                      ('user2@example.com', '222', 0),
    //                      ('user3@example.com', '333', 0);
    //           `);

    // Insert data for Content (prepared statement can take parameters)
    const statement = await db.prepareAsync(
      "INSERT INTO Content(json_string) VALUES ($json_string)"
    );
    const mockedDataString = JSON.stringify(mockedData);
    await statement.executeAsync({ $json_string: mockedDataString });

    // Confirm success
    console.log(`Inserted data into ${db.databaseName}`);

  } catch (error) {
    console.error("Error executing SQL: ", error);
  }
}
