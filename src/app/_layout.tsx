import { Stack, useNavigation, usePathname } from "expo-router";
import React, { useState, useCallback } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
  useColorScheme,
  View,
  StyleSheet,
  Text,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  Modal,
  Portal,
} from "react-native-paper";

import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

import { Searchbar, IconButton } from "react-native-paper";
import { ScrollView } from "react-native";

import useKeyboardVisible from "../hooks/keyboard/isVisible";
import { NO_HEADER_PATHS } from "../config/paths";

// themed text using custom color
export const TText = ({ children, style, ...props }) => {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark"
      ? // ? { ...MD3DarkTheme }
        // : { ...MD3LightTheme };
        { ...MD3DarkTheme, colors: customDarkColors.colors }
      : { ...MD3LightTheme, colors: customLightColors.colors };
  return (
    <Text style={[style, { color: paperTheme.colors.onBackground }]} {...props}>
      {children}
    </Text>
  );
};

export default function Layout() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuVisible] = React.useState(false);
  const navigation = useNavigation();
  const isKeyboardVisible = useKeyboardVisible();
  const currentPathName = usePathname();

  const [fontsLoaded, fontError] = useFonts({
    InterThin: require("assets/fonts/Inter-Thin.ttf"),
    InterExtraLight: require("assets/fonts/Inter-ExtraLight.ttf"),
    InterLight: require("assets/fonts/Inter-Light.ttf"),
    InterRegular: require("assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("assets/fonts/Inter-SemiBold.ttf"),
    InterBold: require("assets/fonts/Inter-Bold.ttf"),
    InterExtraBold: require("assets/fonts/Inter-ExtraBold.ttf"),
    InterBlack: require("assets/fonts/Inter-Black.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const paperTheme =
    colorScheme === "dark"
      ? // ? { ...MD3DarkTheme }
        // : { ...MD3LightTheme };
        { ...MD3DarkTheme, colors: customDarkColors.colors }
      : { ...MD3LightTheme, colors: customLightColors.colors };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    headerPaddedContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 10,
      backgroundColor: paperTheme.colors.background,
    },
    headerLeftContainer: {
      flex: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      borderColor: "grey",
      borderWidth: 1,
    },
    headerRightContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      borderColor: "grey",
      borderWidth: 1,
    },
    searchBar: {
      width: "100%",
      backgroundColor: paperTheme.colors.background,
      height: 40,
      overflow: "hidden",
    },
    searchBarInput: {
      minHeight: 0, // important
      flex: 1,
      height: "100%",
      fontSize: 16,
      paddingVertical: 1,
      margin: 0,
      borderWidth: 0,
    },
    iconButtonContent: {
      padding: 0,
      margin: 0,
    },
    menuItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "grey",
    },
    menuItemText: {
      color: paperTheme.colors.inverseSurface,
    },
  });

  function renderHeaderLeft() {
    return (
      <View style={[styles.headerLeftContainer]}>
        <IconButton
          style={styles.iconButtonContent}
          icon={
            !isKeyboardVisible && !navigation.canGoBack()
              ? "menu"
              : "arrow-left"
          }
          onPress={() => {
            if (isKeyboardVisible) {
              Keyboard.dismiss();
            } else if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              setMenuVisible(true); // open hamburger menu
            }
          }}
        />
      </View>
    );
  }

  function renderHeaderRight() {
    return (
      <View style={[styles.headerRightContainer]}>
        <Searchbar
          placeholder=""
          onChangeText={(text) => setSearchText(text)}
          style={styles.searchBar}
          value={searchText}
          inputStyle={styles.searchBarInput}
          onBlur={() => {
            Keyboard.dismiss();
          }}
        />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor: paperTheme.colors.background,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: paperTheme.colors.background,
          }}
          onLayout={onLayoutRootView}
        >
          <Stack
            screenOptions={{
              header: () => (
                <View>
                  {/* Hide header for paths like login and register */}
                  {!NO_HEADER_PATHS.includes(currentPathName) && (
                    <View style={styles.headerPaddedContainer}>
                      {renderHeaderLeft()}
                      {renderHeaderRight()}
                    </View>
                  )}
                </View>
              ),
              headerTitle: "", // Remove header title for clean layout
              contentStyle: {
                backgroundColor: paperTheme.colors.background,
              },
            }}
          />
        </View>
        <Portal>
          <Modal
            style={{ height: "100%", maxWidth: "80%" }}
            visible={menuVisible}
            onDismiss={() => {
              setMenuVisible(false);
            }}
            // This contentContainerStyle is a parameter of Modal from react-native-paper
            contentContainerStyle={{
              backgroundColor: paperTheme.colors.background,
              padding: 20,
            }}
          >
            <ScrollView style={{ height: "100%", maxWidth: "100%" }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: paperTheme.colors.inverseSurface }}>
                  Example Modal. Click outside this area to dismiss.
                </Text>
              </View>
              <View
                style={{
                  gap: 10,
                }}
              >
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Menu Item 1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Menu Item 2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Menu Item 3</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
}
