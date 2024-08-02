import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useTheme, Snackbar } from "react-native-paper";

import { getAllContentSorted } from "../db/queries";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";

import SearchAutocompleteContainer from "../components/SearchAutocompleteContainer";
import SearchbarContext from "../context/SearchbarContext";

import { overwriteContentWithRemote } from "../utils/content";
import { getToken } from "../utils/auth";
import { setSchema } from "../db/setSchema";

export default function RearrangableTopics() {
  const { searchbarInFocus, setSearchbarInFocus, searchbarText } =
    useContext(SearchbarContext);

  const [contentData, setContentData] = useState([]);
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const theme = useTheme();
  const [numRefresh, setNumRefresh] = useState(0);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch content data function
  async function fetchContentDataLocally() {
    const sortedContent = await getAllContentSorted(db, "Content");
    // console.log("sortedContent: ", sortedContent);
    const sortedContentWithKey = sortedContent.map((obj, index) => ({
      ...obj,
      key: index.toString(), // Ensure key is a string
    }));
    setContentData(sortedContentWithKey);
  }

  useEffect(() => {
    async function updateContentAndRerender() {
      try {
        await overwriteContentWithRemote(db);
        setNumRefresh((prev) => prev + 1); // Increment numRefresh
      } catch {
        // Show error message if overwriteContentWithRemote fails
        setSnackbarMessage(
          "Unable to fetch data from the server. Showing local data instead."
        );
        setSnackbarVisible(true);
        setNumRefresh((prev) => prev + 1); // Increment numRefresh
      }
    }
    updateContentAndRerender();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Focus effect triggered with numRefresh:", numRefresh);
      if (snackbarVisible || numRefresh > 0) {
        async function initData() {
          await setSchema(db);
          await fetchContentDataLocally();
        }
        initData();
      }
    }, [numRefresh])
  );

  console.log("numRefresh", numRefresh);

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
              console.log("long press");
              // drag();  // commented out to disable dragging (since this is homepage)
            }}
            onPress={() => {
              console.log("short press");
              navigation.navigate(`topicsReadOnly/[id]`, {
                id: item.id,
                content: item.content,
                title: item.title,
                secret: item.secret,
                contentData: contentData,
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
      <>
        <View
          style={{
            ...styles.container,
            paddingBottom: 0,
            position: "relative",
          }}
        >
          <RearrangableList />
          <Snackbar
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={10000}
            action={{
              label: "Dismiss",
              onPress: () => {
                setSnackbarVisible(false);
              },
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </>
    );
  } else {
    return (
      <SearchAutocompleteContainer
        contentData={contentData}
        searchbarText={searchbarText}
        setSearchbarInFocus={setSearchbarInFocus}
      />
    );
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

function TopicBlock({ title, description, imageSource }) {
  return (
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
  );
}
