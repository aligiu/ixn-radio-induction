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

  const navigation = useNavigation();

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
          Your changes will be saved and broadcasted for other users.
        </TText>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => closeModal()}>
            <Button mode="outlined">No</Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              console.log(`Confirm changes instruction received. Data:`);
              console.log(data)
              closeModal();
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

export default ReviewModal;
