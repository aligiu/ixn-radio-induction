import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Modal, Portal, Text, IconButton, Icon } from "react-native-paper";
import { TText } from "../app/_layout";

import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native";

const fileDAO = [
  { title: "procedures.docx", fileId: "123" },
  { title: "details.pdf", fileId: "222" },
  { title: "timetable1.pdf", fileId: "331" },
  { title: "timetable2.pdf", fileId: "436" },
];

const FileModal = ({ visible, closeModal }) => {
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: "85%",
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
                title={file.title}
                fileId={file.fileId}
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

const FileDownloadButton = ({ title, fileId }) => {
  return (
    <TouchableOpacity>
      {/* fileId used as download link later */}
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
          {title !== "" ? title : "unnamed file"}{" "}
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
