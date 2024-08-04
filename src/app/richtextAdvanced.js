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
} from "@10play/tentap-editor";

import { useEffect, useState, useCallback } from "react";
import { Keyboard } from "react-native";
import { debounce } from "lodash";

import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

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


export default function RichtextAdvanced() {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
  });

  const content = useEditorContent(editor, { type: "html" });

  const debouncedEffect = useCallback(
    debounce((content) => {
      content && console.log(content);
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
    <SafeAreaView style={styles.fullScreen}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
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

const styles = StyleSheet.create({
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
