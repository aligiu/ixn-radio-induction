import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  onDragEnd,
} from "react-native-draggable-flatlist";
import { Dimensions } from "react-native";
import { useTheme } from "react-native-paper";

import { useRouter } from "expo-router";
import { getAllContentSorted } from "../db/queries";

import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";

export default function Rearrangablelist() {
  const screenWidth = Dimensions.get("window").width;
  const [contentData, setContentData] = useState([]);
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const theme = useTheme();

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
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <TouchableOpacity
            onLongPress={() => {
              const userIsAdmin = true;  // TODO
              if (userIsAdmin) {
                console.log("long press");
                drag();
              }
            }}
            onPress={() => {
              console.log("short press");
              navigation.navigate(`topics/[id]`, {
                content: item.content,
                title: item.title,
              });
              // pass parameters to pages https://reactnavigation.org/docs/params/#what-should-be-in-params
            }}
            disabled={isActive}
            style={[
              styles.rowItem,
              {
                borderRadius: 20,
                borderColor: isActive ? theme.colors.primary : "grey",
                borderWidth: isActive ? 3 : 1,
                backgroundColor: "white"
              },
            ]}
          >
            <View style={{ width: "100%" }}>
              <TopicBlock
                imageSource={require("assets/images/nhs-logo-square.png")}
                title={item.title}
                route={`/topics/${item.key}`} // not really used, since passing content as prop already
                description={item.description}
                content={item.content}
              />
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
    width: "100%",
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

function TopicBlock({ title, description, imageSource, content }) {
  // const navigation = useNavigation();

  // const goToTopics = (content) => {
  //   navigation.navigate(`topics/[id]`, { content: content, title: title });
  //   // pass parameters to pages https://reactnavigation.org/docs/params/#what-should-be-in-params
  // };

  return (
    // <TouchableOpacity
    //   onPress={() => {
    //     goToTopics(content);
    //   }}
    // >
    <View
      style={{
        flexDirection: "row",
        gap: 10,
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
    // </TouchableOpacity>
  );
}
