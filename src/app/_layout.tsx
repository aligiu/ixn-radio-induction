import { Stack } from "expo-router";
import React from "react";

import { useColorScheme, View, StyleSheet, Text } from "react-native";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";

import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
    const colorScheme = useColorScheme();


    const paperTheme =
        colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: customDarkColors.colors }
        : { ...MD3LightTheme, colors: customLightColors.colors };
    
    return (
        <PaperProvider theme={paperTheme}>
            <SafeAreaView style={[styles.safeArea, { 
                backgroundColor: paperTheme.colors.background
                 }]}>
                <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
                    
                    {/* The stack -> always light mode for some reason */}
                    <Stack />
                </View>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});
