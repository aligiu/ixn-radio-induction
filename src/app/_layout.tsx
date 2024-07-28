import { useState, useCallback, useContext, useEffect } from "react";
import { Stack, useNavigation, usePathname } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  useColorScheme,
  View,
  StyleSheet,
  Text,
  Keyboard,
  Dimensions,
  StatusBar,
} from "react-native";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";

import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar, IconButton } from "react-native-paper";
import {
  NO_HEADER_PATHS,
  NO_LEFTSWIPE_PATHS,
  NO_SEARCHBAR_PATHS,
  NO_SEARCHBAR_PREFIXES,
} from "../config/paths";

import { SidemenuProvider } from "../context/SidemenuContext";
import SidemenuContext from "../context/SidemenuContext";

import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

import { fontSize } from "../styles/fontConfig";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { SearchbarProvider } from "../context/SearchbarContext";

import SearchbarContext from "../context/SearchbarContext";

import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { fetchWithJWT } from "../utils/auth";

import { PROTOCOL, SERVER_API_BASE } from "../config/paths";

import { overwriteContent } from "../db/queries";

import { setSchema } from "../db/setSchema";
import React from "react";

// themed text using custom color
export const TText = ({ children, style, ...props }) => {
  const colorScheme = useColorScheme();
  const paperTheme =
    // colorScheme === "dark"
    false
      ? { ...MD3DarkTheme, colors: customDarkColors.colors }
      : { ...MD3LightTheme, colors: customLightColors.colors };
  return (
    <Text style={[style, { color: paperTheme.colors.onBackground }]} {...props}>
      {children}
    </Text>
  );
};

// handle gestures
const PanGestureHandler = ({ children }) => {
  const { setSidemenuVisible } = useContext(SidemenuContext);
  const screenWidth = Dimensions.get("window").width;
  const currentPathName = usePathname();

  const DEBUG_MODE = false;

  const pan = Gesture.Pan()
    .onStart((event) => {
      if (DEBUG_MODE) {
        console.log(event.x, screenWidth);
      }
      if (NO_LEFTSWIPE_PATHS.includes(currentPathName)) {
        if (DEBUG_MODE) {
          console.log("swipe ignored");
        }
      } else if (event.x < screenWidth / 8) {
        if (DEBUG_MODE) {
          console.log("pan started within the first 1/8th of the screen width");
        }
      } else {
        if (DEBUG_MODE) {
          console.log(
            "pan started outside the first 1/8th of the screen width"
          );
        }
      }
    })
    .onUpdate((event) => {
      if (NO_LEFTSWIPE_PATHS.includes(currentPathName)) {
      } else if (event.x < screenWidth / 8) {
        if (DEBUG_MODE) {
          console.log(
            "swiping started within the first 1/8th of the screen width"
          );
        }
        if (event.translationX > 10) {
          setSidemenuVisible(true);
          if (DEBUG_MODE) {
            console.log("pan detected: left to right swipe");
          }
        }
      }
    });
  // .simultaneousWithExternalGesture(Gesture.Native());

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>{children}</GestureDetector>
    </GestureHandlerRootView>
  );
};

export default function Layout() {
  // SideMenu: use require instead of import to avoid circular dependency
  const SideMenu = require("../components/sidemenu").default;

  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const currentPathName = usePathname();

  // fetch data from content/latest -> login/ startup
  // if fetch successful, replace content with latest
  // also hide secrets anyway if user

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
    // colorScheme === "dark"
    false
      ? { ...MD3DarkTheme, colors: customDarkColors.colors }
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
  });

  const pan = Gesture.Pan().onStart(() => {
    const { setSidemenuVisible } = useContext(SidemenuContext);
    setSidemenuVisible(true);
    console.log("pan detected");
  });

  function renderHeaderLeft() {
    const { searchbarInFocus, setSearchbarInFocus } =
      useContext(SearchbarContext);
    const { setSidemenuVisible } = useContext(SidemenuContext);
    return (
      <View style={[styles.headerLeftContainer]}>
        <IconButton
          style={styles.iconButtonContent}
          icon={
            !searchbarInFocus && !navigation.canGoBack() ? "menu" : "arrow-left"
          }
          size={24}
          onPress={() => {
            if (searchbarInFocus) {
              Keyboard.dismiss();
            } else if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              setSidemenuVisible(true); // open hamburger menu
            }
          }}
        />
      </View>
    );
  }

  function renderHeaderRight() {
    const { searchbarInFocus, setSearchbarInFocus } =
      useContext(SearchbarContext);

    // setSearchbarInFocus
    return (
      <View style={[styles.headerRightContainer]}>
        <Searchbar
          placeholder=""
          onChangeText={(text) => setSearchText(text)}
          style={styles.searchBar}
          value={searchText}
          inputStyle={styles.searchBarInput}
          onFocus={() => {
            setSearchbarInFocus(true);
          }}
          onBlur={() => {
            Keyboard.dismiss();
            setSearchbarInFocus(false);
          }}
        />
      </View>
    );
  }

  function startsWithAnyPrefix(str: string, prefixList: string[]): boolean {
    return prefixList.some((prefix) => str.startsWith(prefix));
  }

  return (
    <SQLiteProvider databaseName="local.db">
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle="dark-content" />
        <SidemenuProvider>
          <SearchbarProvider>
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
                {/* Remove PanGestureHandler if there are bugs with scrolling (Android) */}
                {/* <PanGestureHandler> */}
                <GestureHandlerRootView>
                  <Stack
                    screenOptions={{
                      header: () => (
                        <View>
                          {!NO_HEADER_PATHS.includes(currentPathName) && (
                            <View style={styles.headerPaddedContainer}>
                              {renderHeaderLeft()}
                              {/* Only render search bar if not excluded in NO_SEARCHBAR_PATHS nor NO_SEARCHBAR_PREFIXES*/}
                              {!NO_SEARCHBAR_PATHS.includes(currentPathName) &&
                                !startsWithAnyPrefix(
                                  currentPathName,
                                  NO_SEARCHBAR_PREFIXES
                                ) &&
                                renderHeaderRight()}
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
                </GestureHandlerRootView>
                {/* </PanGestureHandler> */}
              </View>
              <SideMenu />
            </SafeAreaView>
          </SearchbarProvider>
        </SidemenuProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}
