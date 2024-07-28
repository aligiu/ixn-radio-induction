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
import {
  getAllContent,
  getFileOps,
  overwriteTargetWithSource,
} from "../db/queries";
import { useSQLiteContext } from "expo-sqlite";

import {
  getAddedContent,
  getDeletedContent,
  getModifiedContent,
  getRearrangedContent,
  extractTitles,
} from "../utils/compareContent";

import * as FileSystem from "expo-file-system";

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
      fileOps = await getFileOps(db);

      const addedCopy = extractTitles(
        getAddedContent(contentToEditDataCopy, contentDataCopy)
      );
      const deletedCopy = extractTitles(
        getDeletedContent(contentToEditDataCopy, contentDataCopy)
      );
      const modifiedCopy = extractTitles(
        getModifiedContent(contentToEditDataCopy, contentDataCopy, fileOps)
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

  const uploadContent = async () => {
    const contentRoute = "/content";

    try {
      console.log(`Confirm changes instruction received. Payload:`);
      const contentPayload = JSON.stringify(updateTimestamps(data)); // set all timestamps to current (for versioning)
      console.log(contentPayload);
      console.log(`${PROTOCOL}://${SERVER_API_BASE}${contentRoute}`);
      // include JWT because the POST routes are only accessible by ADMIN role
      const contentResponse = await fetchWithJWT(
        `${PROTOCOL}://${SERVER_API_BASE}${contentRoute}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: contentPayload,
        }
      );
      return contentResponse;
    } catch (error) {
      console.log("cannot upload", error);
      setSnackbarMessage("Upload failed. Please try again.");
      setSnackbarVisible(true);
    }
  };

  const uploadFiles = async () => {
    const fileRoutePrefix = "/files/upload";

    const uploadPromises = fileOps.map(async (op) => {
      const fileRoute = fileRoutePrefix + "/" + op.folderId;
      console.log(`${PROTOCOL}://${SERVER_API_BASE}${fileRoute}`);

      console.log();

      const fileInfo = await FileSystem.getInfoAsync(op.uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const file = await FileSystem.readAsStringAsync(op.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("op.uri", op.uri);

      const formData = new FormData();
        formData.append('file', {
          uri: op.uri,
          name: op.fileName,
        });

      const fileResponse = await fetchWithJWT(
        `${PROTOCOL}://${SERVER_API_BASE}${fileRoute}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      console.log("fileResponse.status", fileResponse.status);
      console.log("fileResponse", fileResponse);
      return fileResponse;
    });

    try {
      const responses = await Promise.all(uploadPromises);
      console.log("All files uploaded successfully", responses);
      return responses; // Return the array of responses
    } catch (error) {
      console.error("Error uploading files", error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    try {
      const [contentResponse, filesResponses] = await Promise.all([
        uploadContent(),
        uploadFiles(),
      ]);

      if (contentResponse.ok) {
        console.log("Content uploaded successfully");
        // Handle content response
        // closeModal();
        // overwriteTargetWithSource(db, "Content", "ContentToEdit");
        // navigation.navigate(`index`);
      } else {
        throw new Error("Content upload failed");
      }

      const allFilesOk = filesResponses.every(
        (fileResponse) => fileResponse.ok
      );
      if (allFilesOk) {
        console.log("All files uploaded successfully");
        // Handle files responses
      } else {
        throw new Error("One or more file uploads failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
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
              {added.join(", ")}
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
              {modified.join(", ")}
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
              {deleted.join(", ")}
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
              Rearranged (adjacently):
            </TText>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterRegular",
                marginBottom: 10,
              }}
            >
              {rearranged.join(", ")}
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
