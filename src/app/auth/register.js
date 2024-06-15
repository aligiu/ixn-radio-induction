import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, Button, Searchbar, ProgressBar } from "react-native-paper";
import { Link } from "expo-router";
import { contentContainerStyles } from "../../styles/contentContainer";
import { TText } from "../_layout";


export default function Another() {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={contentContainerStyles.container}
    >
      <TText>Registration Page</TText>
      <Link href=""><TText>Continue as Guest</TText></Link>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   something: {
//     flex: 1,
//   },
// });
