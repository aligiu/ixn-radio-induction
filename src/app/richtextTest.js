import * as React from "react";
import { ScrollView, Text, View, Image, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView } from "react-native";
import { Link } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AutoScrollView from "../components/AutoScrollView";

import { useEditorBridge, RichText, Toolbar } from "@10play/tentap-editor";

export default function RichtextTest() {

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: 'Start editing!',
  });
  
  console.log(editor)

  return (
    <AutoScrollView
    keyboardDismissMode="on-drag"
    style={contentContainerStyles.container}
  >
      {/* Scroll view needed to dismiss search bar */}

      <TText style={styles.pageTitle}>RichtextTest</TText>

      <View style={{borderWidth: 1, flex: 1}}>
        <TText style={styles.sectionTitle}>Section Title</TText>
        <TText style={styles.sectionContent}>Section Content</TText>
        <SafeAreaView style={{ flex: 1, borderWidth: 1 }}>
          <RichText editor={editor} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
            }}
          >
            <Toolbar editor={editor} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </AutoScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterMedium",
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterRegular",
    paddingBottom: 8,
    textAlign: "justify",
  },
});
