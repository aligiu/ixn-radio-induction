import * as React from "react";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Modal, Portal, Text, IconButton, Button } from "react-native-paper";
import { TText } from "../app/_layout";
import { useRouter } from "expo-router";

import { RichText, useEditorBridge } from "@10play/tentap-editor";

import { fontSize } from "src/styles/fontConfig";
import { getToken } from "../utils/auth";

import { updateFieldById_ContentToEdit } from "../db/queries";
import { useSQLiteContext } from "expo-sqlite";

const SecretModal = ({
  visible,
  closeModal,
  secret,
  editable,
  id,
  setSecretState,
}) => {
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: "85%",
    borderRadius: 10,
  };
  const db = useSQLiteContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function setIsLoggedInAsync() {
      const token = await getToken();
      if (token) {
        setIsLoggedIn(true);
      }
    }
    setIsLoggedInAsync();
  }, []);

  function getInitialContent() {
    if (!isLoggedIn) {
      return "<p> Please log in to view secrets </p>";
    }
    if (!editable) {
      return "<p>No secrets yet</p>"
    }
    return secret;
  }

  const editorSecret = useEditorBridge({
    editable: editable ? true : false,
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: getInitialContent(),
    onChange: () => {
      async function updateContent() {
        const newSecret = await editorSecret.getHTML()
        updateFieldById_ContentToEdit(db, id, "secret", newSecret) // used to save the new secret in ContentToEdit table
        setSecretState(newSecret) // used to trigger re-render
      }
      updateContent()
    }
  });

  return (
    <>
      <RichText
        editor={editorSecret}
        // hack to remove the editor isn't ready warning
      />
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
            <RichText editor={editorSecret} />

            {!isLoggedIn && (
              <TouchableOpacity
                onPress={() => {
                  router.push("/auth/login");
                  closeModal();
                }}
                style={{ width: "100%" }}
              >
                <Button
                  mode="contained"
                  style={{
                    height: 50,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: fontSize.LARGE,
                      color: "white",
                    }}
                  >
                    Log In
                  </Text>
                </Button>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </Portal>
    </>
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
