import * as React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "../_layout";
import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native-gesture-handler";
import AutoScrollView from "../../components/AutoScrollView";
import { Button } from "react-native-paper";

import { useSQLiteContext } from "expo-sqlite";
import { WebView } from "react-native-webview";
// import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { useRoute } from "@react-navigation/native";

import FileModalReadOnly from "../../components/FileModalReadOnly";
import SecretModal from "../../components/SecretModal";

export default function Topic() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();

  const [secretModalVisible, setSecretModalVisible] = React.useState(false);
  const [fileModalVisible, setFileModalVisible] = React.useState(false);

  const route = useRoute();
  const { content, title, secret, contentData } = route.params;

  // const editor = useEditorBridge({
  //   editable: false,
  //   autofocus: false,
  //   avoidIosKeyboard: true,
  //   initialContent: content ? content : "<p> No content yet. </p>",
  // });

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const onMessage = (event) => {
    const url = event.nativeEvent.data;
    handleLinkPress(url);
  };

  const injectedJavaScript = `
    document.addEventListener('click', function(event) {
      var target = event.target;
      if (target.tagName === 'A' && target.href) {
        event.preventDefault();
        window.ReactNativeWebView.postMessage(target.href);
      }
    });
  `;

  return (
    <>
      <AutoScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
        contentData={contentData}
      >
        {/* Scroll view needed to dismiss search bar */}
        <View style={{ flex: 1 }}>
          <TText style={styles.sectionTitle}>{title}</TText>

          <View
            style={{
              minHeight: 100,
              flex: 1,
            }}
          >
            {/* <RichText editor={editor} /> */}
            <WebView
              source={{
                html:
                  `<meta name="viewport" content="initial-scale=1.0" />` +
                    content || "<p>No content yet.</p>",
              }}
              injectedJavaScript={injectedJavaScript}
              onMessage={onMessage}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setSecretModalVisible(true)}>
                  <Button mode="outlined">Secrets</Button>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setFileModalVisible(true)}>
                  <Button mode="outlined">Files</Button>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </AutoScrollView>
      <View>
        <SecretModal
          visible={secretModalVisible}
          closeModal={() => {
            setSecretModalVisible(false);
          }}
          secret={secret}
          editable={false}
        />
        <FileModalReadOnly
          visible={fileModalVisible}
          closeModal={() => {
            setFileModalVisible(false);
          }}
          id={id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textArea: {
    flex: 1,
    borderWidth: 2,
    borderColor: "red",
  },
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterMedium",
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterRegular",
    paddingBottom: 8,
    textAlign: "justify",
  },
});
