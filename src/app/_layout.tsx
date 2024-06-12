import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import React, { useState } from "react";

import { useColorScheme, View, StyleSheet, Text } from "react-native";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";

import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

import { Searchbar, IconButton } from "react-native-paper";

export default function Layout() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState("");

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: customDarkColors.colors }
      : { ...MD3LightTheme, colors: customLightColors.colors };

  const navigation = useNavigation();

  function renderHeaderLeft() {
    if (!navigation.canGoBack()) {
      // TODO: define navigation.openDrawer() or method to open hamburger menu
      return (
        <View style={[styles.headerLeftContainer]}>
          <IconButton
            // size={24}
            style={styles.iconButtonContent}
            icon="menu"
            onPress={() => {}}
          />
        </View>
      );
    }
    return (
      <View style={[styles.headerLeftContainer]}>
        <IconButton
          // size={24}
          style={styles.iconButtonContent}
          icon="arrow-left"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  function renderHeaderRight() {
    return (
      <View style={[styles.headerRightContainer]}>
        <Searchbar
          placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
          style={styles.searchBar}
          value={searchText}
          inputStyle={{ minHeight: 0 }}
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
        >
          <Stack
            screenOptions={{
              header: () => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    gap: 10,
                  }}
                >
                  {renderHeaderLeft()}
                  {renderHeaderRight()}
                </View>
              ),
              headerTitle: "", // Remove header title
            }}

            //   headerLeft: renderHeaderLeft,
            // //   headerRight: renderHeaderLeft,
            //   headerRight: ({}) => (
            //     <View style={[styles.headerRightContainer]}>
            //       <Searchbar
            //         placeholder="Search"
            //         onChangeText={(text) => setSearchText(text)}
            //         style={styles.searchBar}
            //         value={searchText}
            //         inputStyle={{ minHeight: 0 }}
            //       />
            //     </View>
            //   ),
            //   headerTitle: "", // Remove header title
            // }}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerLeftContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "lightblue",
    borderWidth: 1,
  },
  headerRightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "green",
    // borderWidth: 1,
  },
  searchBar: {
    width: "100%",
    backgroundColor: "white",
    height: 40,
    borderRadius: 20,
    borderColor: "lightblue",
    borderWidth: 1,
  },
  iconButtonContent: {
    padding: 0,
    margin: 0,
  },
});
