import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  onDragEnd,
} from "react-native-draggable-flatlist";

const NUM_ITEMS = 10;
function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const initialData = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: index,
    label: String(index) + "",
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
  };
});


export default function Rearrangablelist() {
  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive } ) => {
    return (
      <ScaleDecorator>
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
  rowItem: {
    height: 100,
    width: 100,
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
