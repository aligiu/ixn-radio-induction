import { mockedData } from "./mockedData";

export async function setup(db) {
  try {
    // Create each table if not exists and insert initial data
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Users (
                      email TEXT PRIMARY KEY NOT NULL,
                      hashed_password TEXT NOT NULL,
                      is_admin BOOLEAN
      )`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Information (
            json_string TEXT
    )`);

    // Delete all existing data
    await db.execAsync(`DELETE FROM Users`);
    await db.execAsync(`DELETE FROM Information`);

    await db.execAsync(`
                  INSERT INTO Users 
                  VALUES ('user1@example.com', '111', 1),
                         ('user2@example.com', '222', 0),
                         ('user3@example.com', '333', 0);
              `);

    const mockedDataString = JSON.stringify(mockedData)

     // Use parameterized query not possible
    //  await db.execAsync(`
    //     INSERT INTO Information(json_string)
    //     VALUES (${mockedDataString});
    // `);

     await db.execAsync(`
        INSERT INTO Information(json_string)
        VALUES ("hello world");
    `);
    

    console.log(`Inserting data into ${db.databaseName}`);

    // Optionally, retrieve data and console log it
    const allUsers = await db.getAllAsync("SELECT * FROM Users");
    for (const user of allUsers) {
      console.log(user.email, user.hashed_password, user.is_admin);
    }

    const allInformationString = await db.getAllAsync("SELECT json_string FROM Information");
    console.log(allInformationString)
    // allInformation = JSON.parse(allInformationString)
    // for (const info of allInformation) {
    //   console.log(info.toString());
    // }


  } catch (error) {
    console.error("Error executing SQL: ", error);
  }
}
