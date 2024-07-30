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
    includeMatches: true,
    threshold: 0.3, // Sensitivity Threshold
  };

  const fuse = new Fuse(contentData, options);

  // TODO: test
  function rankByScore(items) {
    return items.sort((a, b) => b.score - a.score); // higher score first
  }

  // Function to search and rank contentData
  function search(query) {
    const unsortedResult = fuse.search(query);
    const sortedResult = rankByScore(unsortedResult);
    const explodedResult = explodeIndices(sortedResult);
    return explodedResult;
  }

  // TODO: test
  function explodeIndices(results) {
    // explode all the pairs of indices
    // eg [[1, 1], [4, 4], [8, 9], [17, 17], [21, 23]] is 5 pairs
    // explodeIndices produces 5 copies, each with 1 pair
    const explodedResults = [];

    results.forEach((result) => {
      if (result.matches) {
        result.matches.forEach((match) => {
          match.indices.forEach((indexPair) => {
            const explodedResult = {
              ...result,
              matches: [{ ...match, indices: indexPair }],
            };
            explodedResults.push(explodedResult);
          });
        });
      } else {
        explodedResults.push(result);
      }
    });

    return explodedResults;
  }

  const query = searchbarText;
  const contentDataSearchRanked = search(query);
  contentDataSearchRanked.map((c) => {
    console.log("contentDataSearchRanked", c.matches);
    console.log("***", c.matches[0].indices);
  });

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
                id={c.item.id}
                content={c.item.content} // content necessary if using topics route
                title={c.item.title} // title necessary if using topics route
                secret={c.item.secret}
                contentData={contentData}
                autocompleteText={searchbarText}
                section={c.item.description} // change to nearest header
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
