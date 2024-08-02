import React, { useContext } from "react";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import * as fuzzySearch from "@m31coding/fuzzy-search";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";

function stripHtmlTags(html) {
  const noTags = html.replace(/<\/?[^>]+(>|$)/g, " ");
  const noTagsAndTrim = noTags.replace(/ +/g, " ").trim(); // convert multiple spaces to one space and trim start and ends
  return noTagsAndTrim;
}

// Function to add tagFreeContent field to each item in contentData
function addTagFreeContent(contentData) {
  return contentData.map((item) => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
  }));
}

const searcher = fuzzySearch.SearcherFactory.createDefaultSearcher();

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  const query = searchbarText;

  // Remove tags in content for better search results
  const tagfreeContentData = addTagFreeContent(contentData);

  // console.log(tagfreeContentData);

  const indexingMeta = searcher.indexEntities(
    tagfreeContentData,
    (c) => c.id,
    (c) => [c.tagFreeContent, c.description, c.secret, c.title]
  );
  console.dir(indexingMeta);

  // Sort search results by match score in descending order
  function sortSearchResults(results) {
    return results.sort((a, b) => b.score - a.score);
  }

  const result = searcher.getMatches(
    new fuzzySearch.Query((string = query), Infinity, 0.1)
  );
  console.log("result:", result);
  // const sortedResults = sortSearchResults(results);

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
          {/* {contentDataSearchRanked.length > 0 &&
            contentDataSearchRanked.map((c, index) => (
              <SearchAutocompleteElement
                key={index}
                id={c.item.id}
                content={c.item.content} // content necessary if using topics route
                title={c.item.title} // title necessary if using topics route
                secret={c.item.secret}
                contentData={contentData}
                section={c.item.title} // TODO: change to matching field
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
          )} */}
        </View>
        <View style={{ minHeight: 20 }}>{/* spacer */}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchAutocompleteContainer;
