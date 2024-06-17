import * as React from "react";
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AutoScrollView from "../components/AutoScrollView";

export default function Dummy() {
  return (
    <AutoScrollView
    keyboardDismissMode="on-drag"
    style={contentContainerStyles.container}
  >
      {/* Scroll view needed to dismiss search bar */}

      <TText style={styles.pageTitle}>Dummy</TText>

      <View>
        <TText style={styles.sectionTitle}>Section Title</TText>
        <TText style={styles.sectionContent}>Section Content</TText>
        <TText style={styles.sectionContent}>More Section Content</TText>
      </View>
    </AutoScrollView>
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
