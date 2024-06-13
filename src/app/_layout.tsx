import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import React, { useState, useRef } from "react";

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

export default function Layout() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuVisible] = React.useState(false);
  const navigation = useNavigation();
  const searchInputRef = useRef(null);

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
    if (!navigation.canGoBack()) {
      return (
        <View style={[styles.headerLeftContainer]}>
          <IconButton
            // size={24}
            style={styles.iconButtonContent}
            icon="menu"
            onPress={() => {
              Keyboard.dismiss();
              // TODO: define navigation.openDrawer() or method to open hamburger menu
              setMenuVisible(true);
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
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
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
          ref={searchInputRef}
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
        <Portal>
          <Modal
            style={{ height: "100%", maxWidth: "80%" }}
            visible={menuVisible}
            onDismiss={() => {
              setMenuVisible(false);
            }}
            contentContainerStyle={{
              backgroundColor: paperTheme.colors.background,
              padding: 20,
            }}
          >
            <ScrollView style={{ height: "100%", maxWidth: "100%" }}>
              <View
              style={{marginBottom: 20}}
              >
                <Text style={{ color: paperTheme.colors.inverseSurface }}>
                  Example Modal. Click outside this area to dismiss.
                </Text>
              </View>
              <View
              style={{
                gap: 10
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
