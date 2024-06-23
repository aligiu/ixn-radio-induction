import { mockedData } from "./mockedData";
import { setSchema } from "./setSchema";

export async function setDummyData(db) {
  try {

    // Delete all existing data
    await db.execAsync(`DROP TABLE IF EXISTS Content`);

    // Initialize schema
    await setSchema(db);  // wait for schema to be completely set

    // Insert data for Content (prepared statement can take parameters)
    const statement = await db.prepareAsync(
      "INSERT INTO Content(json_string) VALUES ($json_string)"
    );
    const mockedDataString = JSON.stringify(mockedData);
    await statement.executeAsync({ $json_string: mockedDataString });

    // Confirm success
    console.log(`Dummy data has been set in ${db.databaseName}`);
  } catch (error) {
    console.error("Error setting dummy data: ", error);
  }
}

// Users should not be stored locally!!!

// Create each table if not exists and insert initial data
// await db.execAsync(`CREATE TABLE IF NOT EXISTS Users (
//                   email TEXT PRIMARY KEY NOT NULL,
//                   hashed_password TEXT NOT NULL,
//                   is_admin BOOLEAN
//   )`);

// // Insert data for Users
// await db.execAsync(`
//               INSERT INTO Users
//               VALUES ('user1@example.com', '111', 1),
//                      ('user2@example.com', '222', 0),
//                      ('user3@example.com', '333', 0);
//           `);
