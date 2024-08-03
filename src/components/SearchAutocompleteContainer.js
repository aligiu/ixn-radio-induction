import React, { useContext } from "react";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import lunr from "lunr";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";

// import levenshtein from "levenshtein-edit-distance";
import levenshtein from "fast-levenshtein";

// TODO: test
function stripHtmlTags(html) {
  const noTags = html.replace(/<\/?[^>]+(>|$)/g, " ");
  const noTagsAndTrim = noTags.replace(/ +/g, " ").trim(); // convert multiple spaces to one space and trim start and ends
  return noTagsAndTrim;
}

// TODO: test
// Function to add tagFreeContent field to each item in contentData
function addTagFreeContent(contentData) {
  return contentData.map((item) => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
  }));
}

function getSurroundingText(
  longString,
  query,
  maxDistance = 3,
  windowSize = 30
) {
  const lowerQuery = query.toLowerCase();
  const lowerLongString = longString.toLowerCase();

  for (let i = 0; i < lowerLongString.length; i++) {
    for (let j = i + 1; j <= lowerLongString.length; j++) {
      const substring = lowerLongString.slice(i, j);
      if (levenshtein.get(substring, lowerQuery) <= maxDistance) {
        // Calculate the surrounding text
        const start = Math.max(0, i - windowSize);
        const end = Math.min(longString.length, j + windowSize);

        return longString.substring(start, end);
      }
    }
  }

  return null; // No match found
}

function getHighlightedText(
  longString,
  query,
  maxDistance = 3,
  windowSize = 30
) {
  const lowerQuery = query.toLowerCase();
  const lowerLongString = longString.toLowerCase();

  for (let i = 0; i < lowerLongString.length; i++) {
    for (let j = i + 1; j <= lowerLongString.length; j++) {
      const substring = lowerLongString.slice(i, j);
      if (levenshtein.get(substring, lowerQuery) <= maxDistance) {
        // Calculate the surrounding text
        const start = Math.max(0, i - windowSize);
        const end = Math.min(longString.length, j + windowSize);
        const surroundingText = longString.substring(start, end);

        // Highlight the query in the surrounding text
        const highlightedText = surroundingText.replace(
          new RegExp(`(${query})`, "gi"),
          "<mark>$1</mark>"
        );

        return highlightedText;
      }
    }
  }

  return null; // No match found
}

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  const query = searchbarText;

  // contentDataX is an extension of contentData with one more field: tagFreeContent
  // tagFreeContent improves search accuracy for lunr
  const contentDataX = addTagFreeContent(contentData);

  // console.log("contentDataX:", contentDataX.map((c) => {c.tagFreeContent}))
  // console.log(contentDataX);

  // Create Lunr index
  const idx = lunr(function () {
    this.ref("id"); // Document unique identifier
    this.field("title");
    this.field("description");
    this.field("tagFreeContent");
    this.field("secret");

    contentDataX.forEach((doc) => {
      this.add(doc);
    });
  });

  // Sort search results by match score in descending order
  function sortSearchResults(results) {
    return results.sort((a, b) => b.score - a.score);
  }

  function getContentDataById(id, listOfContent) {
    return listOfContent.find((content) => content.id == id);
  }

  const results = idx.search(query);
  const sortedResults = sortSearchResults(results);

  // Example usage of levenshtein
  const longString =
    "This is a long string that we will search through. It might contain some interesting patterns.";
  const fakeQuery = "search through";

  // sortedResults.forEach((s) => {
  //   console.log("Document Ref:", s.ref);
  //   console.log("Metadata:", s.matchData.metadata);
  // });

  // // Log the results
  // console.log("sortedResults:", sortedResults);
  // sortedResults.forEach((s) => {
  //   console.log("metadata", s.matchData.metadata);
  //   c = getContentDataById(s.ref, contentData);
  //   console.log("c", c);
  // });

  function getNestedKey(obj) {
    // Iterate over the top-level keys of the object
    for (let topLevelKey in obj) {
      // Iterate over the nested keys
      for (let nestedKey in obj[topLevelKey]) {
        return nestedKey;
      }
    }
    // Return null if no such key is found
    return null;
  }

  // console.log("getNestedKey", getNestedKey({"ashford": {"title": {}}}))

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
          {!searchbarText.trim() && (
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
          {searchbarText.trim() &&
            sortedResults.length > 0 &&
            sortedResults.map((s, index) => {
              c = getContentDataById(s.ref, contentDataX);
              const key = getNestedKey(s.matchData.metadata);
              const keyToSection = {
                title: "Title",
                description: "Description",
                tagFreeContent: "Content",
                secret: "Secret",
              };
              const section = keyToSection[key];
              console.log("c: ", c);
              console.log("key: ", key);
              console.log("c[key]", c[key]);

              return (
                <SearchAutocompleteElement
                  key={index}
                  id={c.id}
                  content={c.content} // content necessary if using topics route
                  title={c.title} // title necessary if using topics route
                  secret={c.secret}
                  matchingString={getHighlightedText(longString, fakeQuery)} // TODO: matching string -> c[key]
                  contentData={contentData}
                  section={section} // section is one of: Title/Description/Content/Secret
                  routerLink={"topicsReadOnly/[id]"}
                  setSearchbarInFocus={setSearchbarInFocus}
                />
              );
            })}
          {searchbarText.trim() && sortedResults.length === 0 && (
            <View style={{ alignItems: "center", gap: 8 }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                  textAlign: "center",
                }}
              >
                {`No matching results.`}
              </TText>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                  textAlign: "center",
                }}
              >
                {`Continue typing or try a different query.`}
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
