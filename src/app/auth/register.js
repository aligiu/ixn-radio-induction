import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme, Button, Searchbar, ProgressBar } from "react-native-paper";
import { Link } from "expo-router";
import { contentContainerStyles } from "../../styles/contentContainer";

export default function Another() {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={contentContainerStyles.container}
    >
      <Text>Registration Page</Text>
      <Link href="">Continue as Guest</Link>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   something: {
//     flex: 1,
//   },
// });
