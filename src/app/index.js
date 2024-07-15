import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useTheme } from "react-native-paper";

import { getAllContentSorted } from "../db/queries";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";
import AutoScrollView from "../components/AutoScrollView";

import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import SearchbarContext from "../context/SearchbarContext";
import { contentContainerStyles } from "../styles/contentContainer";


export default function RearrangableTopics() {
  const { searchbarInFocus, setSearchbarInFocus } =
  useContext(SearchbarContext); 

  const [contentData, setContentData] = useState([]);
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const theme = useTheme();

  useEffect(() => {
    async function setContentDataAsync(db) {
      const sortedContent = await getAllContentSorted(db, "Content");
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
            marginTop: 5,
            marginBottom: 5,
            paddingLeft: 19,
            paddingRight: 19,
          }}
        >
          <TouchableOpacity
            onLongPress={() => {
              const userIsAdmin = true; // TODO
              const isEditing = true; // TODO
              if (userIsAdmin && isEditing) {
                console.log("long press");
                // drag();  // commented out to disable dragging (since this is homepage)
              }
            }}
            onPress={() => {
              console.log("short press");
              navigation.navigate(`topicsReadOnly/[id]`, {
                id: item.id,
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
                backgroundColor: "white",
              },
            ]}
          >
            <View style={{ width: "100%" }}>
              <TopicBlock
                imageSource={require("assets/images/nhs-logo-square.png")}
                title={item.title}
                route={`/topics/${item.key}`} // route not really dynamic since passing content as prop already
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
    // setContentData(data);
    // console.log(data)
  };

  // Custom DraggableFlatList for each list
  const RearrangableList = () => (
    <DraggableFlatList
      data={contentData}
      keyExtractor={(item) => `key-${item.key}`}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      style={{
        backgroundColor: null,
      }}
    />
  );

  if (!searchbarInFocus) {
    return (
      <View style={styles.container}>
        <RearrangableList />
      </View>
    );
  } else {
    return (
      <ScrollView
      style={
        contentContainerStyles.container
        // {backgroundColor: theme.colors.background}
      }
      keyboardShouldPersistTaps="always"
    >
      <View
        style={{
          flexDirection: "column",
          gap: 10, // gap must be placed in <View> not <ScrollView>
        }}
      >
        <SearchAutocompleteElement
          autocompleteText={"Radiopaedia"}
          topic={"Educational Resources"}
          section={"Login"}
          routerLink={"topicsReadOnly/[id]"}
          title={"Title for topic x"}  // title necessary if using topics route
          content={"<p>Content of topic x</p>"}  // content necessary if using topics route
          setSearchbarInFocus={setSearchbarInFocus}
        />

        <SearchAutocompleteElement
          autocompleteText={"Radiopaedia"}
          topic={"Conferences"}
          section={"Link"}
          routerLink={"dummy"}
          setSearchbarInFocus={setSearchbarInFocus}
        />
      </View>
    </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  rowItem: {
    flex: 1,
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
  //   navigation.navigate(`topicsReadOnly/[id]`, { content: content, title: title });
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
