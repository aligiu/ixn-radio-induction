import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TText } from "./_layout";
import { fontSize } from "../styles/fontConfig";
import AutoScrollView from "../components/AutoScrollView";
import * as SQLite from "expo-sqlite"; // Import SQLite from expo-sqlite (note the *)

export default function SQLTest() {
  useEffect(() => {
    async function insertGrab() {
      try {
        const db = await SQLite.openDatabaseAsync("db_local"); // Open or create the SQLite database

        // Create Users table if not exists and insert initial data
        await db.execAsync(`CREATE TABLE IF NOT EXISTS Users (
                        email TEXT PRIMARY KEY NOT NULL,
                        hashed_password TEXT NOT NULL,
                        is_admin BOOLEAN
        )`);

        // Delete all existing users
        await db.execAsync(`DELETE FROM Users`);

        await db.execAsync(`
                    INSERT INTO Users (email, hashed_password, is_admin) 
                    VALUES ('user1@example.com', '111', 1),
                           ('user2@example.com', '222', 0),
                           ('user3@example.com', '333', 0);
                `);

        console.log("Data inserted successfully.");

        // Optionally, retrieve data and do something with it
        const allUsers = await db.getAllAsync("SELECT * FROM Users");
        for (const user of allUsers) {
          console.log(user.email, user.hashed_password, user.is_admin);
        }
      } catch (error) {
        console.error("Error executing SQL: ", error);
      }
    }

    // Call insertGrab to perform database operations
    insertGrab();
    
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <AutoScrollView keyboardDismissMode="on-drag" style={styles.container}>
      <TText style={styles.pageTitle}>SQLTest</TText>

      <View>
        <TText style={styles.sectionTitle}>Section Title</TText>
        <TText style={styles.sectionContent}>Section Content</TText>
        <TText style={styles.sectionContent}>More Section Content</TText>
      </View>
    </AutoScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterMedium",
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterRegular",
    paddingBottom: 8,
    textAlign: "justify",
  },
});
