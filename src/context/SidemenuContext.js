import React, { createContext, useState } from "react";

const SidemenuContext = createContext({
  sidemenuVisible: false,
  setSidemenuVisible: (isVisible) => {},
});

export const SidemenuProvider = ({ children }) => {
  const [sidemenuVisible, setSidemenuVisibleState] = useState(false);

  const setSidemenuVisible = (isVisible) => {
    setSidemenuVisibleState(isVisible);
  };

  return (
    <SidemenuContext.Provider value={{ sidemenuVisible, setSidemenuVisible }}>
      {children}
    </SidemenuContext.Provider>
  );
};

export default SidemenuContext;