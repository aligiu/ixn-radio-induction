import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  useColorScheme,
} from "react-native";
import { Icon, MD3LightTheme, MD3DarkTheme } from "react-native-paper";

import { fontSize } from "../styles/fontConfig";

import React from "react";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

import { customLightColors } from "../theme/colors";
import { customDarkColors } from "../theme/colors";

export default function SearchAutocompleteElement({
  beforeMatch = "",
  match,
  afterMatch = "",
  id,
  section,
  routerLink,
  setSearchbarInFocus,
  content = "",
  title = "",
  secret,
  contentData,
}) {
  const theme = useTheme();
  const router = useRouter();

  const TText = ({ children, style, ...props }) => {
    const colorScheme = useColorScheme();
    const paperTheme =
      // colorScheme === "dark"
      false
        ? { ...MD3DarkTheme, colors: customDarkColors.colors }
        : { ...MD3LightTheme, colors: customLightColors.colors };
    return (
      <Text
        style={[style, { color: paperTheme.colors.onBackground }]}
        {...props}
      >
        {children}
      </Text>
    );
  };

  const navigation = useNavigation();

  console.log("SearchAutocompleteElement");
  console.log({
    id: id,
    content: content,
    title: title,
    secret: secret,
    // contentData: contentData,
  });
  console.log();

  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
        setSearchbarInFocus(false);
        navigation.navigate(routerLink, {
          id: id,
          content: content,
          title: title,
          secret: secret,
          contentData: contentData,
        });
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 20,
          padding: 10,
          flexDirection: "row",
          gap: 5,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            flex: 0,
          }}
        >
          <Icon source="magnify" color={theme.colors.primary} size={26} />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <View>
            <TText
              style={{
                fontSize: fontSize.MEDIUM,
                fontFamily: "InterRegular",
              }}
            >
              {beforeMatch}
            </TText>
            <TText
              style={{
                fontSize: fontSize.MEDIUM,
                fontFamily: "InterRegular",
              }}
            >
              {match}
            </TText>
            <TText
              style={{
                fontSize: fontSize.MEDIUM,
                fontFamily: "InterRegular",
              }}
            >
              {afterMatch}
            </TText>
          </View>
          <TText
            style={{
              fontSize: fontSize.SMALL,
              fontFamily: "InterRegular",
            }}
          >
            {title} - {section}
          </TText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
