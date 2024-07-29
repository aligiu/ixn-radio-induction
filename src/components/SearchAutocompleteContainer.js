import React, { useContext } from "react";

import { View, ScrollView } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { TText } from "../app/_layout";
import SearchbarContext from "../context/SearchbarContext";

import Fuse from "fuse.js";

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

  return (
    <View style={{ height: "100%" }}>
      <ScrollView
        style={{ ...contentContainerStyles.container, flex: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            flexDirection: "column",
            gap: 10, // gap must be placed in <View> not <ScrollView>
          }}
        >
          {contentDataSearchRanked.map((c, index) => (
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
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchAutocompleteContainer;
