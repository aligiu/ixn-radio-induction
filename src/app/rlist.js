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

const initialDataLeft = [...Array(NUM_ITEMS / 2)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `left-item-${index}`,
    label: String(index) + "",
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
    listId: "left", // assign list ID
  };
});

const initialDataRight = [...Array(NUM_ITEMS / 2)].map((d, index) => {
  const backgroundColor = getColor(NUM_ITEMS / 2 + index);
  return {
    key: `right-item-${index}`,
    label: String(index) + "",
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
    listId: "right", // assign list ID
  };
});

export default function Rlist() {
  const [leftData, setLeftData] = useState(initialDataLeft);
  const [rightData, setRightData] = useState(initialDataRight);

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

  const handleDragEnd = (fromListId, toListId, item) => {
    const fromList = (fromListId === "left") ? leftData : rightData;
    const toList = (toListId === "left") ? setLeftData : setRightData;

    const updatedFromList = fromList.filter((i) => i.key !== item.key);
    toList((prevData) => [...prevData, item]);
  };

  // Custom DraggableFlatList for each list
  const LeftFlatList = () => (
    <DraggableFlatList
      data={leftData}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      onDragEnd={({ data }) => {
        handleDragEnd("left", "right", data[0]); // assuming only 1 item is dragged
        setLeftData(data);
      }}
    />
  );

  const RightFlatList = () => (
    <DraggableFlatList
      data={rightData}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      onDragEnd={({ data }) => {
        handleDragEnd("right", "left", data[0]); // assuming only 1 item is dragged
        setRightData(data);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <LeftFlatList />
      </View>
      <View style={styles.listContainer}>
        <RightFlatList />
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
