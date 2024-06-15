import * as React from "react";
import { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TText } from "./_layout";
import { useTheme, Button } from "react-native-paper";
import { contentContainerStyles } from "/src/styles/contentContainer";
import SidemenuContext from "../context/SidemenuContext";

export default function Another() {
  const { sidemenuVisible, setSidemenuVisible } = useContext(SidemenuContext);

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={contentContainerStyles.container}
    >
      <TText>Hi</TText>
      <Button onPress={() => setSidemenuVisible(true)}>Open Sidemenu</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
