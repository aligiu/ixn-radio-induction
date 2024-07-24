// Skip fetch for now, assume already have json data

// // Define the URL of the JSON endpoint
// const url = 'https://api.example.com/data';

// // Use the fetch API to get data from the endpoint
// fetch(url)
//   .then(response => {
//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error('Network response was not ok ' + response.statusText);
//     }
//     // Parse the JSON from the response
//     return response.json();
//   })
//   .then(data => {
//     // Handle the parsed JSON data
//     console.log(data);
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch
//     console.error('There has been a problem with your fetch operation:', error);
//   });

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "../_layout";
import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AutoScrollView from "../../components/AutoScrollView";
import { Button, Portal } from "react-native-paper";

import { getAllContentSorted } from "../../db/queries";
import { useSQLiteContext } from "expo-sqlite";

import {
  RichText,
  useEditorBridge,
} from "@10play/tentap-editor";

import { useRoute } from "@react-navigation/native";

import FileModal from "../../components/FileModal";
import SecretModal from "../../components/SecretModal";

export default function Topic() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();

  const route = useRoute();
  const { content, title, secret } = route.params;

  const editor = useEditorBridge({
    editable: false,
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: content ? content : "<p> No content yet. </p>",
  });

  const [secretModalVisible, setSecretModalVisible] = React.useState(false);
  const [fileModalVisible, setFileModalVisible] = React.useState(false);

  return (
    <>
      <AutoScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
      >
        {/* Scroll view needed to dismiss search bar */}
        <View style={{ flex: 1 }}>
          <TText style={styles.sectionTitle}>{title}</TText>

          <View
            style={{
              minHeight: 100,
              flex: 1,
            }}
          >
            <RichText editor={editor} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setSecretModalVisible(true)}>
                  <Button mode="outlined">Secrets</Button>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setFileModalVisible(true)}>
                  <Button mode="outlined">Files</Button>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </AutoScrollView>
      <View>
      <SecretModal
        visible={secretModalVisible}
        closeModal={() => {
          setSecretModalVisible(false);
        }}
        secret={secret}
        editable={false}
      />
      <FileModal
          visible={fileModalVisible}
          closeModal={() => {
            setFileModalVisible(false);
          }}
          id={id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textArea: {
    flex: 1,
    borderWidth: 2,
    borderColor: "red",
  },
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterMedium",
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterRegular",
    paddingBottom: 8,
    textAlign: "justify",
  },
});
