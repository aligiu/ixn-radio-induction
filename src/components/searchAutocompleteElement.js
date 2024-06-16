import { View, TouchableOpacity, Keyboard } from "react-native";
import { Icon } from "react-native-paper";

import { fontSize } from "../styles/fontConfig";

import React from "react";
import { TText } from "../app/_layout";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SearchAutocompleteElement({
  autocompleteText,
  topic,
  section,
  routerLink,
  setSearchbarInFocus,
}) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss()
        setSearchbarInFocus(false);
        router.push(routerLink);
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 20,
          padding: 10,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Icon source="magnify" color={theme.colors.primary} size={26} />
        </View>
        <View>
          <TText
            style={{
              fontSize: fontSize.MEDIUM,
              fontFamily: "InterRegular",
            }}
          >
            {autocompleteText}
          </TText>
          <TText
            style={{
              fontSize: fontSize.SMALL,
              fontFamily: "InterRegular",
            }}
          >
            {topic} - {section}
          </TText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
