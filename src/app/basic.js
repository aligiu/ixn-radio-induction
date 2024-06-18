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

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(e) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
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
  }, []);

  return keyboardHeight;
};

export default function Basic() {

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  const keyboardHeight = useKeyboard();
  console.log(keyboardHeight)

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={"height"}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={exampleStyles.keyboardAvoidingView}
        
      >
        {/* <Toolbar editor={editor} />
         */}
        <SafeAreaView
          style={{
            borderWidth: 1,
            borderColor: "red",
            marginBottom: Platform.OS === "ios" ? keyboardHeight : keyboardHeight,

            // marginBottom: 85,
            // marginBottom: {Platform.OS === "ios" ? 120 : keyboardHeight},
            // marginBottom: keyboardHeight,
            // marginBottom: {Platform.OS === "ios" ? keyboardHeight - 60 : keyboardHeight,
            // marginBottom: 0,
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
