import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Portal, Modal } from "react-native-paper";
import SidemenuContext from "../context/SidemenuContext";
import { useTheme } from "react-native-paper";

const SideMenu = () => {
  const { sidemenuVisible, setSidemenuVisible } = useContext(SidemenuContext);

  const theme = useTheme();
  const backgroundColor = theme.colors.background;
  const textColor = theme.colors.inverseSurface;

  const closeModal = () => {
    setSidemenuVisible(false);
  };

  return (
    <Portal>
      <Modal visible={sidemenuVisible} onDismiss={closeModal}>
        <View style={{flexDirection: "row", height: "100%"}}>
          <ScrollView
            style={{
              flex: 0,
              backgroundColor: "white",
              padding: 20,
              height: "100%",
              maxWidth: "80%",
              borderColor: "red",
              borderWidth: 2,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: textColor }}>
                Example Modal. Click the close button or outside the area to
                dismiss.
              </Text>
            </View>
            <View
              style={{
                gap: 10,
              }}
            >
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Menu Item 1111</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Menu Item 222</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Menu Item 333</Text>
              </TouchableOpacity>
              <Button onPress={closeModal}>Close</Button>
            </View>
          </ScrollView>
            <TouchableWithoutFeedback style={{flex: 1}} onPress={closeModal}>
          <View style={{borderColor: "blue", borderWidth: 3, flex: 1}}>
              <Text>outside</Text>
          </View>
            </TouchableWithoutFeedback>

          {/* <View style={{borderColor: "green", borderWidth: 2, height: "100%", width: "20%"}} onPress={closeModal}>
            <TouchableWithoutFeedback style={{flex: 1}} onPress={closeModal}>
              <></>
            </TouchableWithoutFeedback>
          </View> */}
          
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default SideMenu;
