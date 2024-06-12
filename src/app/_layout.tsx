import { Stack } from "expo-router";
import React from "react";

import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";
import { useColorScheme } from "react-native";

import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
    const colorScheme = useColorScheme();

    const paperTheme =
        colorScheme === 'dark'
        // true
        ? { ...MD3DarkTheme, colors: customDarkColors.colors }
        : { ...MD3LightTheme, colors: customLightColors.colors };
    
    return (
        <PaperProvider theme={paperTheme}>
            <Stack />
        </PaperProvider>
    );
}
