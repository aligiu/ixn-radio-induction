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

import { getAllContent } from "../../db/queries";
import { useSQLiteContext } from "expo-sqlite";

import {
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";

import { useRoute } from '@react-navigation/native';

export default function Topic() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();


  const route = useRoute();
  const { content, title } = route.params;

  const editor = useEditorBridge({
    editable: false,
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: content,
  });


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
          </View>
        </View>
      </AutoScrollView>
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
