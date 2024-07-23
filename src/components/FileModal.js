import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Modal, Portal, Text, IconButton, Icon } from "react-native-paper";
import { TText } from "../app/_layout";

import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native";

const fileDAO = [
  {
      "folderId": "1",
      "fileName": "banana.webp",
      "downloadRoute": "/api/files/download/1?fileName=banana.webp"
  },
  {
      "folderId": "1",
      "fileName": "monke.jpeg",
      "downloadRoute": "/api/files/download/1?fileName=monke.jpeg"
  },
  {
      "folderId": "2",
      "fileName": "tree.jpg",
      "downloadRoute": "/api/files/download/2?fileName=tree.jpg"
  },
  {
      "folderId": "3",
      "fileName": "tree.jpg",
      "downloadRoute": "/api/files/download/3?fileName=tree.jpg"
  }
];

const FileModal = ({ visible, closeModal, id }) => {
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: "85%",
    borderRadius: 10,
  };

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
          {fileDAO &&
            fileDAO.map((file, index) => (
              <FileDownloadButton
                key={index}
                file={file}
              />
            ))}
          {fileDAO && fileDAO.length === 0 && (
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
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const FileDownloadButton = ({ file }) => {
  return (
    <TouchableOpacity  onPress={() => {
      console.log(`Detected ${file.fileName} download: downloadRoute is ${file.downloadRoute}`)
    }}>
      <View
        flexDirection="row"
        gap={10}
        alignItems="center"
        style={{ marginTop: 5, marginBottom: 5 }}
      >
        <Icon source="download" size={26} />
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

export default FileModal;
