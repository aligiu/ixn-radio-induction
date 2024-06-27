import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
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
import { useNavigation } from "@react-navigation/native";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";

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
            minWidth: 100,
            minHeight: 100,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
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
            <View style={{ width: "100%" }}>
              <NavBlock
                imageSource={require("assets/images/nhs-logo-square.png")}
                title={item.title}
                route={`/topics/${item.key}`}
                description={item.description}
                content={item.content}
              />
              <Text>{item.title}</Text>
            </View>
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
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  nhsSquare: {
    height: 60,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 15,
  },
});

function NavBlock({ title, description, imageSource, content }) {
  const navigation = useNavigation();

  const goToTopics = (content) => {
    navigation.navigate(`topics/[id]`, { content: content, title: title });
    // pass parameters to pages https://reactnavigation.org/docs/params/#what-should-be-in-params
  };

  return (
    <TouchableOpacity
      onPress={() => {
        goToTopics(content);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Image
            resizeMethod="contain"
            source={imageSource}
            style={styles.nhsSquare}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TText
            style={{
              fontSize: fontSize.MEDIUM,
              fontFamily: "InterMedium",
            }}
          >
            {title}
          </TText>
          <TText
            style={{
              fontSize: fontSize.SMALL,
              fontFamily: "InterRegular",
            }}
            // numberOfLines="2"  // uncomment to abridge text
            // ellipsizeMode="tail"  // uncomment to abridge text
          >
            {description}
          </TText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
