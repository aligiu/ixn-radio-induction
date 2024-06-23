import React from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";

import { useEffect, useState, useCallback } from "react";
import { Keyboard } from "react-native";
import { debounce } from "lodash";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { contentContainerStyles } from "/src/styles/contentContainer";

// Node.js file system promises API (for client-side)
// For mocking, will not be needed

// existing bug: keyboard height doesn't update when change keyboard (eg text -> emoji) on Android
// can be solved using keyboardWillChangeFrame and keyboardDidChangeFrame, but they do not fire due to a bug on Android
// hence not implemented
// see more: https://github.com/facebook/react-native/issues/44200

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets(); // get rid of extra padding for ios devices with home indicator/bars

  useEffect(() => {
    function onKeyboardDidShow(e) {
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

export default function RichtextAdvanced() {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    // initialContent,
  });

  const content = useEditorContent(editor, { type: "html" });

  const debouncedEffect = useCallback(
    debounce((content) => {
      console.log("--- --- --- --- --- --- --- --- ");
      // content && console.log(content);
      // content && console.log(content.content[0].content)
      // content && console.log(content.content[0].content[1]);
      content && console.log(JSON.stringify(content, null, 2));
    }, 300), // Debounce delay in milliseconds
    []
  );

  useEffect(() => {
    debouncedEffect(content);
    return () => {
      debouncedEffect.cancel();
    };
  }, [content, debouncedEffect]);

  const keyboardHeight = useKeyboardHeight();

  return (
    <SafeAreaView style={exampleStyles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={exampleStyles.keyboardAvoidingView}
      >
        <SafeAreaView
          style={{
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
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

// const initialContent = `<p>This is a RichtextAdvanced example!</p>`;
