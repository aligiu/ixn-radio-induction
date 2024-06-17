import React, { useContext } from "react";

import { View, ScrollView } from "react-native";

import { useTheme } from "react-native-paper";

import { contentContainerStyles } from "src/styles/contentContainer";

import { fontSize } from "../styles/fontConfig";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import SearchbarContext from "../context/SearchbarContext";

export default function AutoScrollView({ children }) {
  const theme = useTheme();
  const { searchbarInFocus, setSearchbarInFocus } =
    useContext(SearchbarContext);

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ flexGrow: 1 }}
      style={contentContainerStyles.container}
    >
      {/* 
        If search bar is not in focus, then display children normally
        Otherwise, display the search bar results
        */}
      {!searchbarInFocus && children}
      {searchbarInFocus && (
        <ScrollView
          style={{
            backgroundColor: theme.colors.background,
          }}
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
              routerLink={"/dummy"}
              setSearchbarInFocus={setSearchbarInFocus}
            />

            <SearchAutocompleteElement
              autocompleteText={"Radiopaedia"}
              topic={"Conferences"}
              section={"Link"}
              routerLink={"/dummy"}
              setSearchbarInFocus={setSearchbarInFocus}
            />
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
}
