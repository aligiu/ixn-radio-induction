import React, { createContext, useState } from "react";

const InputContext = createContext({
    inputInFocus: false,
    setInputInFocus: (inFocus) => {},
});

export const InputProvider = ({ children }) => {
  const [inputInFocus, setInputInFocusState] = useState(false);

  const setInputInFocus = (inFocus) => {
    setInputInFocusState(inFocus);
  };

  return (
    <InputContext.Provider value={{ inputInFocus, setInputInFocus }}>
      {children}
    </InputContext.Provider>
  );
};

export default InputContext;