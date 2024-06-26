import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  onDragEnd,
} from "react-native-draggable-flatlist";
import { Dimensions } from "react-native";

const NUM_ITEMS = 10;
function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const initialData = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `list-${index}`,
    label: String(index) + "",
    height: 100,
    width: 100,
    backgroundColor,
  };
});


export default function Rearrangablelist() {
  const screenWidth = Dimensions.get("window").width;
  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive } ) => {
    return (
      <ScaleDecorator>
        <View style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
        }}>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? "red" : item.backgroundColor },
          ]}
        >
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = () => {

  };

  // Custom DraggableFlatList for each list
  const RearrangableList = () => (
    <DraggableFlatList
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      onDragEnd={({ data }) => {
        handleDragEnd();
        setData(data);
      }}
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
