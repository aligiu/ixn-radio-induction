import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TText } from "./_layout";
import { useTheme } from "react-native-paper";
import { contentContainerStyles } from "/src/styles/contentContainer";

export default function Another() {
  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={contentContainerStyles.container}
    >
      <TText>Hi</TText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
