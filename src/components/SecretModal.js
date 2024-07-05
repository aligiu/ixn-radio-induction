import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Modal, Portal, Text, IconButton } from "react-native-paper";
import { TText } from "../app/_layout";

import { fontSize } from "src/styles/fontConfig";

const SecretModal = ({ visible, closeModal }) => {
  const containerStyle = {
    backgroundColor: "white",
    margin: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: "90%",
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
        <ScrollView style={{ paddingRight: 10 }}>
          {/* If secrets found */}
          <View>
            <Text> Username: user1</Text>
            <Text> Password: password1</Text>
            <Text> Username: user2</Text>
            <Text> Password: password2</Text>
          </View>

        </ScrollView>
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

export default SecretModal;
