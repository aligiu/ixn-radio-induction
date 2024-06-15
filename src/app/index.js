import * as React from "react";
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";

export default function Home() {
  return (
    <>
      <ScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
      >
        {/* Scroll view needed to dismiss search bar */}

        <TText style={styles.pageTitle}>Home</TText>
        <View>
          <Image
            resizeMethod="contain"
            source={require("assets/images/nhs-logo-square.png")}
            style={styles.nhsSquare}
          />
        </View>
        <Link href="/another">
          <TText>Go to another page{"\n"}</TText>
        </Link>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
