import React, { useContext } from "react";

import { Text, View, ScrollView } from "react-native";

import { useTheme } from "react-native-paper";

import { contentContainerStyles } from "src/styles/contentContainer";

import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import SearchbarContext from "../context/SearchbarContext";

export default function AutoScrollView({ children }) {
  const theme = useTheme();
  const { searchbarInFocus, setSearchbarInFocus } =
    useContext(SearchbarContext); 

  // If search bar is not in focus, then display children normally
  // Otherwise, display the search bar results
  if (!searchbarInFocus) {
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1 }}
        style={contentContainerStyles.container}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <ScrollView
      style={
        contentContainerStyles.container
        // {backgroundColor: theme.colors.background}
      }
      keyboardShouldPersistTaps="always"
    >
      <View
        style={{
          flexDirection: "column",
          gap: 10, // gap must be placed in <View> not <ScrollView>
        }}
      >
        <SearchAutocompleteElement
          autocompleteText={"Radiopaedia"}
          topic={"Educational Resources"}
          section={"Login"}
          routerLink={"topics/[id]"}
          title={"Title for topic x"}  // title necessary if using topics route
          content={"<p>Content of topic x</p>"}  // content necessary if using topics route
          setSearchbarInFocus={setSearchbarInFocus}
        />

        <SearchAutocompleteElement
          autocompleteText={"Radiopaedia"}
          topic={"Conferences"}
          section={"Link"}
          routerLink={"dummy"}
          setSearchbarInFocus={setSearchbarInFocus}
        />
      </View>
    </ScrollView>
  );
}
