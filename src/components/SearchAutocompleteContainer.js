import React, { useContext } from "react";

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import lunr from "lunr";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";

// import levenshtein from "levenshtein-edit-distance";
// import levenshtein from "fast-levenshtein";
import fuzzysort from "fuzzysort";

// TODO: test
function stripHtmlTags(html) {
  if (!html) {
    return html;
  }
  const noTags = html.replace(/<\/?[^>]+(>|$)/g, " ");
  const noTagsAndTrim = noTags.replace(/ +/g, " ").trim(); // convert multiple spaces to one space and trim start and ends
  return noTagsAndTrim;
}

// TODO: test
// Function to add tagFreeContent field to each item in contentData
function addTagFreeContentAndSecret(contentData) {
  return contentData.map((item) => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
    tagFreeSecret: stripHtmlTags(item.secret),
  }));
}

function removeNonAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

// TODO: test
const getSurroundingText = (longString, query, boundaryWindowSize = 30) => {
  const cleanQuery = removeNonAlphanumeric(query)

  // Perform the fuzzy search using fuzzysort
  const result = fuzzysort.single(cleanQuery, longString);
  const matchIndices = result._indexes;

  // Calculate the surrounding text of the first pattern match
  const matchStart = Math.min(...matchIndices)
  const matchEnd = findLastConsecutive(matchIndices, matchStart)
  const surroundingStart = matchStart - boundaryWindowSize;
  const surroundingEnd = matchEnd + boundaryWindowSize;
  
  const prefixAtBorder = surroundingStart <= 0;
  const suffixAtBorder = surroundingEnd >= longString.length;

  const prefix = `${prefixAtBorder ? "": "..."}${longString.substring(surroundingStart, matchStart)}`
  const matchedText = `${longString.substring(matchStart, matchEnd + 1)}`;
  const suffix = `${longString.substring(matchEnd + 1, surroundingEnd + 1)}${suffixAtBorder ? "": "..."}`
  return { matchedText, prefix, suffix };
};

function findLastConsecutive(array, start) {
  if (!Array.isArray(array)) {
    throw new TypeError("Input must be an array");
  }
  // Find the index of the starting point
  const startIndex = array.indexOf(start);

  // If the starting point is not found, return null
  if (startIndex === -1) return null;

  // Traverse the array from the startIndex
  let lastConsecutive = start;
  for (let i = startIndex + 1; i < array.length; i++) {
    // Check if the current element is consecutive to the lastConsecutive
    if (array[i] === lastConsecutive + 1) {
      lastConsecutive = array[i];
    } else {
      // Break the loop if the sequence is broken
      break;
    }
  }

  return lastConsecutive;
}

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  const query = searchbarText;

  // contentDataX is an extension of contentData with two more fields: tagFreeContent, tagFreeSecret
  // removing tags improves search accuracy for lunr
  const contentDataX = addTagFreeContentAndSecret(contentData);

  // console.log("contentDataX:", contentDataX.map((c) => {c.tagFreeContent}))
  // console.log(contentDataX);

  // Create Lunr index
  const idx = lunr(function () {
    this.ref("id"); // Document unique identifier
    this.field("title");
    this.field("description");
    this.field("tagFreeContent");
    this.field("tagFreeSecret");

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
    // Return null if no such matchKey is found
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
              const matchKey = getNestedKey(s.matchData.metadata);
              const keyToSection = {
                title: "Title",
                description: "Description",
                tagFreeContent: "Content",
                tagFreeSecret: "Secret",
              };
              const section = keyToSection[matchKey];

              // console.log("c: ", c);
              console.log("matchKey: ", matchKey);
              // console.log("c[matchKey]", c[matchKey]);

              const { matchedText, prefix, suffix } = getSurroundingText(
                c[matchKey],
                query
              );

              console.log("matchedText", matchedText);
              function removeWhitespace(str) {
                return str.replace(/\s+/g, " ");
              }

              return (
                <SearchAutocompleteElement
                  matchKey={index}
                  id={c.id}
                  content={c.content} // content necessary if using topics route
                  title={c.title} // title necessary if using topics route
                  secret={c.secret}
                  matchedText={removeWhitespace(matchedText)}
                  prefix={removeWhitespace(prefix)}
                  suffix={removeWhitespace(suffix)}
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
