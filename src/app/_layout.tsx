import { Stack } from "expo-router";
import React from "react";

import {
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
  PaperProvider,
} from "react-native-paper";

import { customLightColors } from "../theme/colors";

const theme = {
  ...LightTheme,
  colors: customLightColors.colors,
};

const Layout = () => {
  return (
    <PaperProvider theme={theme}>
      <Stack />
    </PaperProvider>
  );
};

export default Layout;
