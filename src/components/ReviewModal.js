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

import { fetchWithJWT } from "../utils/auth";
import { SERVER_API_BASE, PROTOCOL } from "../config/paths";
import { updateTimestamps } from "../utils/content";

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
              console.log(`Confirm changes instruction received. Payload:`);
              const payload = JSON.stringify(
                updateTimestamps(
                  data
                )
              );  // set all timestamps to current (for versioning)
              console.log(payload)
              const route = "/content";
              // include JWT in fetch because the /content route (POST method) is only accessible by admins
              async function handleConfirm() {
                console.log(`${PROTOCOL}://${SERVER_API_BASE}${route}`)
                response = await fetchWithJWT(`${PROTOCOL}://${SERVER_API_BASE}${route}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: payload,
                });
                console.log(response.status)
                console.log(response)
                if (response.ok) {
                  closeModal();
                } else {
                  console.log("cannot upload")
                }
              }
              handleConfirm()
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
