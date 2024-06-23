import { mockedData } from "./mockedData";

export async function setup(db) {
  try {
    // Create each table if not exists and insert initial data
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Users (
                      email TEXT PRIMARY KEY NOT NULL,
                      hashed_password TEXT NOT NULL,
                      is_admin BOOLEAN
      )`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Content (
            json_string TEXT
    )`);

    // Delete all existing data
    await db.execAsync(`DELETE FROM Users`);
    await db.execAsync(`DELETE FROM Content`);

    // Insert data for Users
    await db.execAsync(`
                  INSERT INTO Users 
                  VALUES ('user1@example.com', '111', 1),
                         ('user2@example.com', '222', 0),
                         ('user3@example.com', '333', 0);
              `);

    // Insert data for Content (prepared statement can take parameters)
    const statement = await db.prepareAsync(
      "INSERT INTO Content(json_string) VALUES ($json_string)"
    );
    
    const mockedDataString = JSON.stringify(mockedData);
    await statement.executeAsync({ $json_string: mockedDataString });

    console.log(`Inserting data into ${db.databaseName}`);

    // Optionally, retrieve data and console log it
    const allUsers = await db.getAllAsync("SELECT * FROM Users");
    for (const user of allUsers) {
      console.log(user.email, user.hashed_password, user.is_admin);
    }

    
    // only parse first json object (singleton)
    const allContentString = (await db.getFirstAsync(
      "SELECT json_string FROM Content"
    ))["json_string"];    
    allContent = JSON.parse(allContentString)
    console.log(allContent)

  } catch (error) {
    console.error("Error executing SQL: ", error);
  }
}
