import React, { useContext } from "react";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import Fuse from "fuse.js";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";


function stripHtmlTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

// Function to add tagFreeContent field to each item in contentData
function addTagFreeContent(contentData) {
  return contentData.map(item => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
  }));
}

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  // Initialize Fuse.js
  const options = {
    keys: ["description", "tagFreeContent", "secret", "title"],
    includeScore: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.3, // Sensitivity Threshold (0.0 = perfect match; 1.0 = match anything)
  };

  const fuse = new Fuse(addTagFreeContent(contentData), options);

  // Function to search and rank contentData
  function search(query) {
    const searchResults = fuse.search(query);
    console.log("searchResults", searchResults);
    return searchResults;
  }

  function getMatchStartEndIndices(searchResult) {
    const indices = searchResult["matches"][0]["indices"];
    const numPairs = indices.length;
    const lastIndexPair = indices[numPairs - 1];
    return lastIndexPair;
  }





  const query = searchbarText;
  const contentDataSearchRanked = search(query);
  contentDataSearchRanked.map((c) => {
    console.log("contentDataSearchRanked", c.matches);
    console.log("***", c.matches[0].indices);
  });

  const keyboardHeight = useKeyboardHeight();

  function getMatchStart(c) {
    return getMatchStartEndIndices(c)[0];
  }

  function getMatchEnd(c) {
    return getMatchStartEndIndices(c)[1] + 1;
  }

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
                id={c.item.id}
                content={c.item.content} // content necessary if using topics route
                title={c.item.title} // title necessary if using topics route
                secret={c.item.secret}
                contentData={contentData}
                beforeMatch={c.matches[0].value.slice(
                  Math.max(0, getMatchStart(c) - 10),
                  getMatchStart(c)
                )}
                match={c.matches[0].value.slice(
                  getMatchStart(c),
                  getMatchEnd(c)
                )}
                afterMatch={c.matches[0].value.slice(
                  getMatchEnd(c),
                  getMatchEnd(c) + 10
                )}
                section={c.matches[0].key} // change to nearest header
                routerLink={"topicsReadOnly/[id]"}
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
