import React from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";

import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets(); // get rid of extra padding for ios devices, especially those with home indicator/bars


  useEffect(() => {
    function onKeyboardDidShow(e) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height - insets.bottom);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

  return keyboardHeight;
};

export default function Basic() {

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  const keyboardHeight = useKeyboardHeight();
  console.log(keyboardHeight)

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        // behavior={"height"}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={exampleStyles.keyboardAvoidingView}
        
      >
        {/* <Toolbar editor={editor} /> */}
        <SafeAreaView
          style={{
            borderWidth: 1,
            borderColor: "red",
            position: "absolute",
            bottom: keyboardHeight,
          }}
        >
          <Toolbar editor={editor} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}




const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

const initialContent = `<p>This is a basic example!</p>`;
