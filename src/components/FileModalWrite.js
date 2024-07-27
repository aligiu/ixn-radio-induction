import * as React from "react";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Alert, Platform } from "react-native";
import { Modal, Portal, IconButton, Icon, Snackbar } from "react-native-paper";
import { TText } from "../app/_layout";
import { shareAsync } from "expo-sharing";

import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native";

import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";

import { useTheme } from "react-native-paper";

import { PROTOCOL, SERVER_API_BASE } from "../config/paths";
import * as DocumentPicker from "expo-document-picker";

import {
  getFileOps,
  includeOpInFileOps,
  addOpAlreadyExists,
} from "../db/queries";

import { useSQLiteContext } from "expo-sqlite";

const save = async (uri, filename, mimetype) => {
  if (Platform.OS === "android") {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        mimetype
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => console.log(e));
    } else {
      shareAsync(uri);
    }
  } else {
    shareAsync(uri);
  }
};

const FileModalWrite = ({ visible, closeModal, id }) => {
  const db = useSQLiteContext();

  // const [toDelete, setToDelete] = useState([])
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: "85%",
    borderRadius: 10,
  };

  const theme = useTheme();

  function filterByFolderId(list, folderId) {
    return list.filter((item) => item.folderId == folderId);
  }

  const [fileData, setFileData] = useState([]);
  const [adds, setAdds] = useState([]);
  const [dels, setDels] = useState([]);
  const [numOps, setNumOps] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  async function fetchFileDataRemotely() {
    const route = `/files/list/${id}`;
    const response = await fetch(`${PROTOCOL}://${SERVER_API_BASE}${route}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  useEffect(() => {
    async function setFileDataOrShowError() {
      response = await fetchFileDataRemotely();
      if (response.ok) {
        const fetchedFilesOfId = await response.json();
        console.log(fetchedFilesOfId);
        setFileData(fetchedFilesOfId);
      } else {
        // Show error message if fetchFileDataRemotely fails
        setSnackbarMessage(
          "Unable to fetch files from the server. Text content and secrets are shown, but files cannot be downloaded."
        );
        setSnackbarVisible(true);
      }
    }
    setFileDataOrShowError();
  }, [numOps]);

  useEffect(() => {
    async function setAddsAndDels() {
      const addsTemp = [];
      const delsTemp = [];
      const ops = await getFileOps(db);
      for (const op of ops) {
        if (op.operation === "add") {
          addsTemp.push(op);
        } else if (op.operation === "delete") {
          delsTemp.push(op);
        }
      }
      console.log("addsTemp:", addsTemp);
      console.log("delsTemp:", delsTemp);
      setAdds(addsTemp);
      setDels(delsTemp);
    }
    setAddsAndDels();
  }, [numOps]);

  function handleFileDelete(folderId, fileName) {
    return async () => {
      try {
        includeOpInFileOps(db, folderId, fileName, "", "delete");
      } catch (error) {
        console.error("Error deleting file:", error);
        setSnackbarMessage("Error deleting file: " + error.message);
        setSnackbarVisible(true);
      } finally {
        setNumOps(numOps + 1);
      }
    };
  }

  function createFileAddHandler(db, folderId, file) {
    return async function handleFileAdd() {
      console.log("replace");
      await includeOpInFileOps(
        db,
        folderId,
        file.assets[0].name,
        file.assets[0].uri,
        "add"
      );
      const fileOps = await getFileOps(db);
      console.log("fileOps:", fileOps);
    };
  }

  function handleFileAddOrReplace(folderId) {
    return async () => {
      try {
        const file = await DocumentPicker.getDocumentAsync({});
        console.log("file:", file);
        if (
          file.canceled === false &&
          (await addOpAlreadyExists(db, folderId, file.assets[0].name))
        ) {
          Alert.alert(
            `File already exists`,
            `Replacing "${file.assets[0].name}" will overwrite its contents`,
            [
              {
                text: "Cancel",
                onPress: async () => {
                  console.log("Upload cancelled");
                },
              },
              {
                text: "Replace",
                onPress: createFileAddHandler(db, id, file),
              },
            ]
          );
        } else if (file.canceled === false) {
          createFileAddHandler(db, id, file);
          await includeOpInFileOps(
            db,
            folderId,
            file.assets[0].name,
            file.assets[0].uri,
            "add"
          );
          const fileOps = await getFileOps(db);
          console.log("fileOps:", fileOps);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setSnackbarMessage("Error uploading file: " + error.message);
        setSnackbarVisible(true);
      } finally {
        setNumOps(numOps + 1);
      }
    };
  }

  return (
    <>
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
                Files
              </TText>
            </View>

            <View>
              <IconButton
                size={26}
                style={{ ...styles.iconButtonContent, display: "none" }}
              />
            </View>
          </View>
          <ScrollView style={{ paddingRight: 10 }}>
            <TText
              style={{
                fontSize: fontSize.SMALL,
                fontFamily: "InterSemiBold",
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              Uploaded
            </TText>
            <View>
              {fileData &&
                fileData.map((file, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginBottom: 5,
                    }}
                  >
                    <FileDownloadButton file={file} />
                    <TouchableOpacity
                      onPress={() => {
                        console.log(`pressed delete ${file.fileName}`);
                        handleFileDelete(id, fileData.fileName)();
                      }}
                    >
                      <Icon
                        source="delete"
                        color={theme.colors.primary}
                        size={26}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

              {console.log("adds: ", adds)}
              {console.log(id)}
              {console.log(
                "filterByFolderId(adds, id):",
                filterByFolderId(adds, id)
              )}

              {fileData &&
                fileData.length === 0 &&
                filterByFolderId(adds, id).length === 0 && (
                  <View>
                    <TText
                      style={{
                        fontSize: fontSize.SMALL,
                        fontFamily: "InterRegular",
                      }}
                    >
                      No files found
                    </TText>
                  </View>
                )}
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterSemiBold",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                To Upload
              </TText>
              <View style={{ paddingLeft: 10, paddingRight: 10 }}></View>

              {filterByFolderId(adds, id).map((addedFile, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  <TText
                    style={{
                      fontSize: fontSize.SMALL,
                      fontFamily: "InterRegular",
                      // textDecorationLine: "underline",
                    }}
                  >
                    {addedFile.fileName}
                  </TText>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(`pressed delete ${addedFile.fileName}`);
                    }}
                  >
                    <Icon
                      source="delete"
                      color={theme.colors.primary}
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <View
                style={{
                  alignItems: "flex-end",
                  paddingLeft: 8,
                  paddingRight: 8,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity onPress={handleFileAddOrReplace(id)}>
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: theme.colors.primary,
                      flexDirection: "row",
                      maxWidth: 30,
                    }}
                  >
                    <Icon source="plus" color="white" size={30} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              console.log("add");
            }}
          ></TouchableOpacity>
        </Modal>
      </Portal>
      <Snackbar
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
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
    </>
  );
};

const FileDownloadButton = ({ file }) => {
  const handleDownloadAndOpen = async () => {
    try {
      const route = file.downloadRoute;
      const url = `${PROTOCOL}://${SERVER_API_BASE}${route}`;
      const fileName = file.fileName;
      const downloadDest = FileSystem.documentDirectory + fileName;

      console.log(`Downloading from: ${url}`);
      console.log(`Saving to: ${downloadDest}`);

      const { uri, status, headers } = await FileSystem.downloadAsync(
        url,
        downloadDest
      );

      save(uri, fileName, headers["Content-Type"]);

      console.log("uri:", uri);
      console.log("status:", status);

      if (status === 200) {
        console.log(`File downloaded to: ${uri}`);
        await WebBrowser.openBrowserAsync(uri);
        console.log("File opened");
      } else {
        console.error(`Download failed with status: ${status}`);
        Alert.alert("Error", "Download failed with status: " + status);
      }
    } catch (error) {
      console.error("Error downloading or opening file:", error);
      Alert.alert(
        "Error",
        "Error downloading or opening file: " + error.message
      );
    }
  };
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log(
          `Detected ${file.fileName} download: downloadURL (protocol+base+route) is:`
        );
        console.log(`${PROTOCOL}://${SERVER_API_BASE}${file.downloadRoute}`);
        handleDownloadAndOpen();
      }}
    >
      <View
        flexDirection="row"
        gap={10}
        alignItems="center"
        style={{ marginTop: 5, marginBottom: 5 }}
      >
        <Icon source="download" size={26} color={theme.colors.primary} />
        <TText
          style={{
            fontSize: fontSize.SMALL,
            fontFamily: "InterRegular",
            textDecorationLine: "underline",
          }}
        >
          {" "}
          {file.fileName !== "" ? file.fileName : "unnamed file"}{" "}
        </TText>
      </View>
    </TouchableOpacity>
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

export default FileModalWrite;
