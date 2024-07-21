import * as React from "react";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Modal,
  Portal,
  Text,
  IconButton,
  Icon,
  Button,
  Snackbar,
} from "react-native-paper";
import { TText } from "../app/_layout";

import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { fetchWithJWT } from "../utils/auth";
import { SERVER_API_BASE, PROTOCOL } from "../config/paths";
import { updateTimestamps } from "../utils/content";
import { getAllContent, overwriteTargetWithSource } from "../db/queries";
import { useSQLiteContext } from "expo-sqlite";

const ReviewModal = ({ visible, closeModal, data }) => {
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  };

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigation = useNavigation();
  const db = useSQLiteContext();

  // TODO: move to utils
  function getAddedContent(contentToEdit, content) {
    const contentMap = new Map(content.map((item) => [item.id, item]));
    return contentToEdit.filter((item) => !contentMap.has(item.id));
  }

  function getDeletedContent(contentToEdit, content) {
    const contentToEditMap = new Map(
      contentToEdit.map((item) => [item.id, item])
    );
    return content.filter((item) => !contentToEditMap.has(item.id));
  }

  function getModifiedContent(contentToEdit, content) {
    const contentMap = new Map(content.map((item) => [item.id, item]));
    return contentToEdit.filter((item) => {
      if (!contentMap.has(item.id)) {
        return false;
      }
      const originalItem = contentMap.get(item.id);
      console.log("title *", item.title, originalItem.title, item.title !== originalItem.title);
      console.log("description *", item.description, originalItem.description, item.description !== originalItem.description);
      console.log("content *", item.content, originalItem.content, item.content !== originalItem.content);
      console.log("secret *", item.secret, originalItem.secret, item.secret !== originalItem.secret);
      return (
        item.title !== originalItem.title ||
        item.description !== originalItem.description ||
        item.content !== originalItem.content ||
        item.secret !== originalItem.secret
      );
    });
  }

  function getRearrangedContent(contentToEdit, content) {
    const contentMap = new Map(content.map((item) => [item.id, item]));
    return contentToEdit.filter((item) => {
      if (!contentMap.has(item.id)) return false;
      const originalItem = contentMap.get(item.id);
      return (
        item.nextId !== originalItem.nextId ||
        item.prevId !== originalItem.prevId
      );
    });
  }

  function extractTitles(items) {
    return items.map((item) => item.title);
  }

  const [added, setAdded] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [modified, setModified] = useState([]);
  const [rearranged, setRearranged] = useState([]);

  const noChanges =
    added.length === 0 &&
    modified.length === 0 &&
    rearranged.length === 0 &&
    deleted.length === 0;

  useEffect(() => {
    async function setChanges(db) {
      const contentDataCopy = await getAllContent(db, "Content");
      const contentToEditDataCopy = await getAllContent(db, "ContentToEdit");

      const addedCopy = extractTitles(
        getAddedContent(contentToEditDataCopy, contentDataCopy)
      );
      const deletedCopy = extractTitles(
        getDeletedContent(contentToEditDataCopy, contentDataCopy)
      );
      const modifiedCopy = extractTitles(
        getModifiedContent(contentToEditDataCopy, contentDataCopy)
      );
      const rearrangedCopy = extractTitles(
        getRearrangedContent(contentToEditDataCopy, contentDataCopy)
      );

      setAdded(addedCopy);
      setDeleted(deletedCopy);
      setModified(modifiedCopy);
      setRearranged(rearrangedCopy);

      console.log(addedCopy);
      console.log(deletedCopy);
      console.log(modifiedCopy);
      console.log(rearrangedCopy);
    }
    setChanges(db);
  }, [visible]);

  const handleConfirm = async () => {
    console.log(`Confirm changes instruction received. Payload:`);
    const payload = JSON.stringify(updateTimestamps(data)); // set all timestamps to current (for versioning)
    console.log(payload);
    const route = "/content";
    // include JWT in fetch because the /content route (POST method) is only accessible by admins
    try {
      console.log(`${PROTOCOL}://${SERVER_API_BASE}${route}`);
      const response = await fetchWithJWT(
        `${PROTOCOL}://${SERVER_API_BASE}${route}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );
      console.log(response.status);
      console.log(response);
      if (response.ok) {
        closeModal();
        // Overwrite ContentToEdit to Content to save changes,
        overwriteTargetWithSource(db, "Content", "ContentToEdit");
        navigation.navigate(`index`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.log("cannot upload", error);
      setSnackbarMessage("Upload failed. Please try again.");
      setSnackbarVisible(true);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={containerStyle}
      >
        <TText
          style={{
            fontSize: fontSize.MEDIUM,
            fontFamily: "InterMedium",
            marginBottom: 10,
          }}
        >
          Confirm Changes?
        </TText>

        <TText
          style={{
            fontSize: fontSize.SMALL,
            fontFamily: "InterRegular",
            marginBottom: 10,
          }}
        >
          Your changes will be saved and shared with everyone.
        </TText>
        <TText
          style={{
            fontSize: fontSize.SMALL,
            fontFamily: "InterRegular",
            marginBottom: 10,
          }}
        >
          Once uploaded, you will be taken back to the home screen, where you'll
          see the updates.
        </TText>

        {added.length > 0 && (
          <>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterSemiBold",
                marginBottom: 10,
              }}
            >
              Added:
            </TText>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterRegular",
                marginBottom: 10,
              }}
            >
              {added.toString()}
            </TText>
          </>
        )}

        {modified.length > 0 && (
          <>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterSemiBold",
                marginBottom: 10,
              }}
            >
              Modified:
            </TText>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterRegular",
                marginBottom: 10,
              }}
            >
              {modified.toString()}
            </TText>
          </>
        )}

        {rearranged.length > 0 && (
          <>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterSemiBold",
                marginBottom: 10,
              }}
            >
              Rearranged:
            </TText>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterRegular",
                marginBottom: 10,
              }}
            >
              {rearranged.toString()}
            </TText>
          </>
        )}

        {deleted.length > 0 && (
          <>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterSemiBold",
                marginBottom: 10,
              }}
            >
              Deleted:
            </TText>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterRegular",
                marginBottom: 10,
              }}
            >
              {deleted.toString()}
            </TText>
          </>
        )}

        {noChanges && (
          <TText
            style={{
              fontSize: fontSize.SMALL,
              fontFamily: "InterSemiBold",
              marginBottom: 10,
            }}
          >
            No changes detected. Confirmation disabled.
          </TText>
        )}

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => closeModal()}>
            <Button mode="outlined">No</Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={handleConfirm}
            disabled={noChanges ? true : false}
          >
            <Button mode="contained" disabled={noChanges ? true : false}>
              Yes
            </Button>
          </TouchableOpacity>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={10000}
        action={{
          label: "Dismiss",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
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

export default ReviewModal;
