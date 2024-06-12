import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import React, { useState, useRef } from "react";

import {
  useColorScheme,
  View,
  StyleSheet,
  Text,
  Keyboard,
} from "react-native";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";

import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

import { Searchbar, IconButton } from "react-native-paper";
import { ScrollView } from "react-native"; 

export default function Layout() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const searchInputRef = useRef(null);

  const paperTheme =
    colorScheme === "dark"
        ? { ...MD3DarkTheme }
        : { ...MD3LightTheme };
    //   ? { ...MD3DarkTheme, colors: customDarkColors.colors }
    //   : { ...MD3LightTheme, colors: customLightColors.colors };


const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    headerContainer: {
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
      overflow: "hidden"
    },
    searchBarInput: {
        minHeight: 0,  // important
        flex: 1,
        height: '100%',
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



  function renderHeaderLeft() {
    if (!navigation.canGoBack()) {
      
      return (
        <View style={[styles.headerLeftContainer]}>
          <IconButton
            // size={24}
            style={styles.iconButtonContent}
            icon="menu"
            onPress={() => {
                Keyboard.dismiss()
                // TODO: define navigation.openDrawer() or method to open hamburger menu
            }}
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
          onPress={() => 
            {Keyboard.dismiss()
            navigation.goBack()}
        }
        />
      </View>
    );
  }

  function renderHeaderRight() {
    return (
        <View style={[styles.headerRightContainer]}>
          <Searchbar
            placeholder=""
            ref={searchInputRef}
            onChangeText={(text) => setSearchText(text)}
            style={styles.searchBar}
            value={searchText}
            inputStyle={ styles.searchBarInput }
            onBlur={() => {
                Keyboard.dismiss()
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
        >
          <Stack
            screenOptions={{
              header: () => (
                <View style={styles.headerContainer}>
                  {renderHeaderLeft()}
                  {renderHeaderRight()}
                </View>
              ),
              headerTitle: "", // Remove header title
            }}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

