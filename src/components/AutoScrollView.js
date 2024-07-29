import React, { useContext } from "react";

import { Text, View, ScrollView } from "react-native";

import { useTheme } from "react-native-paper";

import { contentContainerStyles } from "src/styles/contentContainer";

import SearchAutocompleteContainer from "./SearchAutocompleteContainer";
import SearchbarContext from "../context/SearchbarContext";

export default function AutoScrollView({ children, contentData }) {
  const theme = useTheme();
  const { searchbarInFocus, setSearchbarInFocus, searchbarText } =
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
  } else {
    return (
      <SearchAutocompleteContainer
        contentData={contentData}
        searchbarText={searchbarText}
        setSearchbarInFocus={setSearchbarInFocus}
      />
    );
  }
}
