import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  onDragEnd,
} from "react-native-draggable-flatlist";
import { Dimensions } from "react-native";

import { useRouter } from "expo-router";
import { getAllContentSorted } from "../db/queries";

const NUM_ITEMS = 10;
function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

import { useSQLiteContext } from "expo-sqlite";

export default function Rearrangablelist() {
  const screenWidth = Dimensions.get("window").width;
  const [contentData, setContentData] = useState([]);

  const router = useRouter();
  const db = useSQLiteContext();

  useEffect(() => {
    async function setContentDataAsync(db) {
      const sortedContent = await getAllContentSorted(db);
      const sortedContentWithKey = sortedContent.map((obj, index) => ({
        ...obj,
        key: index,
      }));
      setContentData(sortedContentWithKey);
    }
    setContentDataAsync(db);
  }, []);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View
          style={{
            borderWidth: 2,
            minWidth: 100,
            minHeight: 100,
            marginTop: 10,
            borderWidth: 2,
            marginLeft: 10,
            marginRight: 10,
            borderColor: "blue",
          }}
        >
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.rowItem,
              { backgroundColor: isActive ? "red" : item.backgroundColor },
            ]}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = ({ data }) => {
    setContentData(data);
  };

  // Custom DraggableFlatList for each list
  const RearrangableList = () => (
    <DraggableFlatList
      data={contentData}
      keyExtractor={(item) => `key-${item.key}`}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      style={{
        width: screenWidth,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <RearrangableList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  listContainer: {
    width: "100%",
    alignItems: "center",
  },
  rowItem: {
    height: 100,
    width: "100%",
    // borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
