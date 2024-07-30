import React, { useContext } from "react";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import Fuse from "fuse.js";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  // Initialize Fuse.js
  const options = {
    keys: ["description", "content", "secret", "title"],
    includeScore: true,
    threshold: 0.3, // Sensitivity Threshold
  };

  const fuse = new Fuse(contentData, options);

  function rankByScore(items) {
    return items.sort((a, b) => b.score - a.score); // higher score first
  }

  // Function to search and rank contentData
  function search(query) {
    const unsortedResult = fuse.search(query);
    const sortedResult = rankByScore(unsortedResult);
    return sortedResult;
  }

  const query = searchbarText;
  console.log("searchbarText:", searchbarText);
  console.log("searchbarText===null:", searchbarText === null);
  console.log("searchbarText===undefined:", searchbarText === undefined);

  console.log("contentData", contentData);

  const contentDataSearchRanked = search(query);
  console.log("contentDataSearchRanked", contentDataSearchRanked);

  const keyboardHeight = useKeyboardHeight();

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: keyboardHeight }}>
      <ScrollView
        style={{ ...contentContainerStyles.container, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: "column",
            gap: 10, // gap must be placed in <View> not <ScrollView>
          }}
        >
          {contentDataSearchRanked.length > 0 &&
            contentDataSearchRanked.map((c, index) => (
              <SearchAutocompleteElement
                key={index}
                autocompleteText={searchbarText}
                topic={c.item.title}
                section={c.item.description} // change to nearest header
                routerLink={"topicsReadOnly/[id]"}
                title={c.title} // title necessary if using topics route
                content={c.content} // content necessary if using topics route
                setSearchbarInFocus={setSearchbarInFocus}
              />
            ))}
          {!searchbarText && contentDataSearchRanked.length === 0 && (
            <View style={{ alignItems: "center" }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                }}
              >
                Please enter a search query
              </TText>
            </View>
          )}
          {searchbarText && contentDataSearchRanked.length === 0 && (
            <View style={{ alignItems: "center" }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                }}
              >
                No results found
              </TText>
            </View>
          )}
        </View>
        <View style={{ minHeight: 20 }}>{/* spacer */}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchAutocompleteContainer;
