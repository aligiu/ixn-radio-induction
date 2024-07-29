import React, { createContext, useState } from "react";

const SearchbarContext = createContext({
    searchbarInFocus: false,
    setSearchbarInFocus: (inFocus) => {},
    searchbarText: "",
    setSearchbarText: (text) => {}
});

export const SearchbarProvider = ({ children }) => {
  const [searchbarInFocus, setSearchbarInFocusState] = useState(false);
  const [searchbarText, setSearchbarTextState] = useState("");

  const setSearchbarInFocus = (inFocus) => {
    setSearchbarInFocusState(inFocus);
  };

  const setSearchbarText = (text) => {
    setSearchbarTextState(text);
  };

  return (
    <SearchbarContext.Provider value={{ searchbarInFocus, setSearchbarInFocus, searchbarText, setSearchbarText }}>
      {children}
    </SearchbarContext.Provider>
  );
};

export default SearchbarContext;