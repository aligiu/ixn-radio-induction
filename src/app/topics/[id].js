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
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "../_layout";
import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AutoScrollView from "../../components/AutoScrollView";



// function getObjectById(id) {
//   return dataJSON.find((item) => item.id === id);
// }

export default function Topic() {
  const { id } = useLocalSearchParams();
  
  // hard coded as local json for now, do useEffect to fetch data
  const allData = require("../mockedData.json");
  pageData = allData[id]
  
  return (
    <>
      <AutoScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
      >
        {/* Scroll view needed to dismiss search bar */}

        <TText style={styles.pageTitle}>{pageData.title}</TText>

        <View>
          <TText style={styles.sectionTitle}>Overview</TText>
          <TText style={styles.sectionContent}>{pageData.description}</TText>
        </View>

        <View>
          <TText style={styles.sectionTitle}>Details (TODO: read json of 10tap)</TText>
          <TText style={styles.sectionContent}>{pageData.content.toString()}</TText>
        </View>

      </AutoScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterMedium",
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterRegular",
    paddingBottom: 8,
    textAlign: "justify",
  },
});
