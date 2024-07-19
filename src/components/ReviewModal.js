import * as React from "react";
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
import { overwriteTargetWithSource } from "../db/queries";
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

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const navigation = useNavigation();
  const db = useSQLiteContext();

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
          Your changes will be saved and broadcasted for other users. If
          successful, you will be redirected to the home screen.
        </TText>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => closeModal()}>
            <Button mode="outlined">No</Button>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={handleConfirm}>
            <Button mode="contained">Yes</Button>
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
