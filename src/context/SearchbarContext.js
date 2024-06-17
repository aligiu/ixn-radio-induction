import React, { createContext, useState } from "react";

const SearchbarContext = createContext({
    searchbarInFocus: false,
    setSearchbarInFocus: (inFocus) => {},
});

export const SearchbarProvider = ({ children }) => {
  const [searchbarInFocus, setSearchbarInFocusState] = useState(false);

  const setSearchbarInFocus = (inFocus) => {
    setSearchbarInFocusState(inFocus);
  };

  return (
    <SearchbarContext.Provider value={{ searchbarInFocus, setSearchbarInFocus }}>
      {children}
    </SearchbarContext.Provider>
  );
};

export default SearchbarContext;