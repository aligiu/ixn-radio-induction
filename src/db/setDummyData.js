import { mockedData } from "./mockedData";
import { setSchema } from "./setSchema";

export async function setDummyData(db) {
  try {
    // Delete all existing data
    await db.execAsync(`DROP TABLE IF EXISTS Content`);

    // Initialize schema
    await setSchema(db); // wait for schema to be completely set

    // Insert data for Content (prepared statement can take parameters)
    const statement = await db.prepareAsync(`
      INSERT INTO Content (id, title, description, content, next_id, prev_id)
      VALUES ($id, $title, $description, $content, $next_id, $prev_id);
    `);

    await Promise.all(
      mockedData.map((datapoint, index) => {
        statement.executeAsync({
          $id: index + 1,
          $title: datapoint.title,
          $description: datapoint.description,
          $content: datapoint.content,
          $next_id: index !== mockedData.length - 1 ? index + 2 : null,
          $prev_id: index !== 0 ? index : null,
        });
      })
    );

    await statement.finalizeAsync();

    // Confirm success
    console.log(`Dummy data has been set in ${db.databaseName}`);

    // Iterate over the results and print fields in the same row
    const results = await db.getAllAsync("SELECT * FROM Content;");
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      console.log(
        `Row ${i + 1}: ID: ${row.id}, Title: ${row.title}, Description: ${
          row.description
        }, Content: ${row.content}, Next ID: ${row.next_id}, Previous ID: ${
          row.prev_id
        }`
      );
    }
    console.log("All content data printed.");
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
