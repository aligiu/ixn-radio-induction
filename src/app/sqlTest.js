import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { TText } from "./_layout";
import { fontSize } from "../styles/fontConfig";
import AutoScrollView from "../components/AutoScrollView";
import * as SQLite from "expo-sqlite"; // Import SQLite from expo-sqlite (note the *)

import { useSQLiteContext } from "expo-sqlite";

import { setSchema } from "../db/setSchema";
// import { setDummyData } from "../db/setDummyData";
import { getAllContentSorted } from "../db/queries";

import { deleteFromTable, dropTable } from "../db/dropOrDelete";

export default function SQLTest() {
  const db = useSQLiteContext();

  return (
    <AutoScrollView keyboardDismissMode="on-drag" style={styles.container}>
      <TText style={styles.pageTitle}>SQLTest</TText>

      <View>
        <TText style={styles.sectionTitle}>DB Control Panel</TText>
        <TText style={styles.sectionContent}>Init DB</TText>
        <View style={{ gap: 10 }}>
        <Button mode="contained" onPress={() => setSchema(db)}>
            Init Schema only
          </Button>
          {/* <Button mode="contained" onPress={() => setDummyData(db)}>
            Init Schema and Dummy Data (Essential)
          </Button> */}
          <Button mode="contained" onPress={() => getAllContentSorted(db, "Content")}>
            Get all content (sorted)
          </Button>
          <Button
            mode="contained"
            onPress={() => deleteFromTable(db, "Content")}
          >
            Delete from content
          </Button>
          <Button mode="contained" onPress={() => dropTable(db, "Content")}>
            Drop content
          </Button>
        </View>
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
