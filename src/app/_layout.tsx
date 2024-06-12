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

  const renderHeaderLeft = () => {
    if (!navigation.canGoBack()) {
      // define navigation.openDrawer()
      return <IconButton icon="menu" onPress={() => {}} />;
    }
    return <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />;
  };

  const headerHeight = 60;

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
          style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
        >
          <Stack
            screenOptions={{
              headerStyle: {},
              headerLeft: renderHeaderLeft,
              headerRight: ({}) => (
                <View style={[styles.headerRightContainer]}>
                  <Searchbar
                    placeholder="Search"
                    onChangeText={(text) => setSearchText(text)}
                    style={styles.searchBar}
                    value={searchText}
                    inputStyle={{ minHeight: 0 }}
                  />
                </View>
              ),
            }}
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
  headerRightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "white",
    height: 30,
    borderColor: "lightblue",
    borderWidth: 1,
  },
});
