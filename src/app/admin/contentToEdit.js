import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Icon, useTheme, Button } from "react-native-paper";

import { getAllContentSorted } from "../../db/queries";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

import { TText } from "../_layout";
import { fontSize } from "src/styles/fontConfig";
import AutoScrollView from "../../components/AutoScrollView";

import SearchAutocompleteElement from "../../components/searchAutocompleteElement";
import SearchbarContext from "../../context/SearchbarContext";
import { contentContainerStyles } from "../../styles/contentContainer";
import CancelEditModal from "../../components/CancelEditModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function RearrangableTopics() {
  // const { searchbarInFocus, setSearchbarInFocus } =
  // useContext(SearchbarContext);

  const [contentData, setContentData] = useState([]);
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const theme = useTheme();
  const [cancelEditModalVisible, setCancelEditModalVisible] =
    React.useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
  React.useState(false);

  useEffect(() => {
    async function setContentDataAsync(db) {
      // fetch from ContentToEdit instead of Content
      const sortedContent = await getAllContentSorted(db, "ContentToEdit");
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
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onLongPress={() => {
              const userIsAdmin = true; // TODO
              const isEditing = true; // TODO
              if (userIsAdmin && isEditing) {
                console.log("long press");
                drag();
              }
            }}
            onPress={() => {
              console.log("short press");
              navigation.navigate(`admin/topicsWrite/[id]`, {
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
          <View
            style={{ justifyContent: "space-around", alignItems: "center" }}
          >
            <TouchableOpacity onPress={() => {

              setConfirmDeleteModalVisible(true)
            }}>
              <Icon source="delete" color={theme.colors.primary} size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = ({ data }) => {
    setContentData(data);
    // console.log("New firstElement:",  data[0])
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
        paddingBottom: 200,
      }}
    />
  );

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 10,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
      <TText
          style={{
            fontSize: fontSize.LARGE,
            fontFamily: "InterMedium",
          }}
        >
          Admin Content Editor
        </TText>
      </View>
      <View style={styles.container}>
        <RearrangableList />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 16,
          paddingLeft: 16,
          marginTop: 10,
        }}
      >
        <TouchableOpacity>
          <View
            style={{ borderRadius: 10, backgroundColor: theme.colors.primary }}
          >
            <Icon source="plus" color="white" size={36} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              setCancelEditModalVisible(true);
            }}
          >
            <Button mode="outlined">Cancel Edit</Button>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity>
            <Button mode="contained">Review</Button>
          </TouchableOpacity>
        </View>
      </View>
      <CancelEditModal
        visible={cancelEditModalVisible}
        closeModal={() => {
          setCancelEditModalVisible(false);
        }}
      />
      <ConfirmDeleteModal
        visible={confirmDeleteModalVisible}
        closeModal={() => {
          setConfirmDeleteModalVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
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
