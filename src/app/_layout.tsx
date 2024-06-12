import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
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

import { Searchbar, IconButton } from "react-native-paper";



export default function Layout() {
    const colorScheme = useColorScheme();

    const paperTheme =
        colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: customDarkColors.colors }
        : { ...MD3LightTheme, colors: customLightColors.colors };
    
    const navigation = useNavigation();

    const renderHeaderLeft = () => {
        if (!navigation.canGoBack()) {
            return (
                <IconButton
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                />
            );
        } else {
            return (
                <IconButton
                    icon="arrow-left"
                    onPress={() => navigation.goBack()}
                />
            );
        }
    };

    const headerHeight = 60;
    
    return (
        <PaperProvider theme={paperTheme}>
            <SafeAreaView style={[styles.safeArea, { 
                backgroundColor: paperTheme.colors.background
                 }]}>
                <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
{/*                     
                    <Stack
                    screenOptions={{
                        headerStyle: {
                          backgroundColor: '#f4511e',
                        }}}
                    /> */}

                <Stack
                      screenOptions={{
                        headerStyle: {
                        },
                        headerLeft: renderHeaderLeft,
                        // headerLeft: () => (
                        //     <IconButton
                        //       icon="arrow-left"
                        //       onPress={() => navigation.goBack()}
                        //     />
                        //   ),
                        headerRight: ({ }) => (
                          <View style={[styles.headerRightContainer, {height: headerHeight}]}>
                            <Searchbar
                              placeholder="Search"
                              onChangeText={(text) => console.log(text)}
                              style={styles.searchBar}
                              value={""}
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
    container: {
        flex: 1,
    },
    // headerContainer: {
    //     justifyContent: "center",
    //     alignItems: "center",
    //     borderBottomWidth: 1,
    //     borderBottomColor: "gray",
    //     paddingHorizontal: 10,
    // },
    headerRightContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    searchBar: {
        width: "100%",
        borderRadius: 20,
        backgroundColor: "white",
    },
});
