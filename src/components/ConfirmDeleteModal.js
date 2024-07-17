import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Modal,
  Portal,
  Text,
  IconButton,
  Icon,
  Button,
} from "react-native-paper";
import { TText } from "../app/_layout";

import { fontSize } from "src/styles/fontConfig";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ConfirmDeleteModal = ({
  visible,
  closeModal,
  deleteTargetId,
  data,
  handleDeleteById,
}) => {
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  };

  const navigation = useNavigation();

  // console.log(`delete modal received data as:`)
  // data.map((d) => {
  //   console.log(d)
  // })

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
          Confirm Delete?
        </TText>

        <TText
          style={{
            fontSize: fontSize.SMALL,
            fontFamily: "InterRegular",
            marginBottom: 10,
          }}
        >
          Your deletion request will be saved but won't be carried out until you
          review and approve the changes.
        </TText>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => closeModal()}>
            <Button mode="outlined">No</Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              // console.log("data ^^^", data)
              // console.log("deleteTargetId ^^^", deleteTargetId)
              handleDeleteById(data, deleteTargetId);
              console.log(
                `Delete instruction executed for id: ${deleteTargetId}`
              );
              closeModal()
            }}
          >
            <Button mode="contained">Yes</Button>
          </TouchableOpacity>
        </View>
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

export default ConfirmDeleteModal;
