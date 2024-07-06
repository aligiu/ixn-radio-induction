import * as React from "react";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Modal, Portal, Text, IconButton } from "react-native-paper";
import { TText } from "../app/_layout";

import { RichText, useEditorBridge } from "@10play/tentap-editor";

import { fontSize } from "src/styles/fontConfig";

// fetch content from naviation, see index.js and topics/[id].js
content = `<p> Username: user1</p>
           <p> Password: password1</p>
           <p> Username: user2</p>
           <p> Password: password2</p>`;

const SecretModal = ({ visible, closeModal }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: "90%",
  };

  const editorSecret = useEditorBridge({
    editable: false,
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: content ? content : "<p> No secret yet. </p>",
  });

  useEffect(() => {
    if (editorSecret) {
      setIsEditorReady(true);
    }
  }, [editorSecret]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={containerStyle}
      >
        <View style={{ ...styles.modalHeaderContainer, paddingRight: 10 }}>
          <IconButton
            icon="close"
            size={26}
            onPress={closeModal}
            style={styles.iconButtonContent}
          />
          <View style={{ justifyContent: "center" }}>
            <TText
              style={{
                fontSize: fontSize.MEDIUM,
                fontFamily: "InterMedium",
              }}
            >
              Secrets
            </TText>
          </View>

          <View>
            <IconButton
              size={26}
              style={{ ...styles.iconButtonContent, display: "none" }}
            />
          </View>
        </View>
        <View
          style={{
            minHeight: 100,
            flex: 1,
            paddingRight: 10,
          }}
        >
          {isEditorReady ? (
            <RichText editor={editorSecret} />
          ) : (
            <Text>Loading editor...</Text>
          )}
        </View>
        {/* If secrets found */}
        {/* <ScrollView style={{ paddingRight: 10 }}>
        </ScrollView> */}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalHeaderContainer: {
    justifyContent: "space-between",
    marginBottom: 10,
    flexDirection: "row",
  },
  iconButtonContent: {
    padding: 0,
    margin: 0,
    borderWidth: 1,
  },
});

export default SecretModal;
