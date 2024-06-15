import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, Portal, Modal } from "react-native-paper";
import SidemenuContext from "../context/SidemenuContext";
import { useTheme } from "react-native-paper";

const SideMenu = () => {
  const { sidemenuVisible, setSidemenuVisible } = useContext(SidemenuContext);

  const theme = useTheme();
  const backgroundColor = theme.colors.background;
  const textColor = theme.colors.inverseSurface;

  return (
    <Portal>
      <Modal
        visible={sidemenuVisible}
        onDismiss={() => setSidemenuVisible(false)}
      >
        <ScrollView
          style={{
            backgroundColor: "white",
            padding: 20,
            height: "100%",
            maxWidth: "80%",
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: textColor }}>
              Example Modal. Click outside this area to dismiss.
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
            <Button onPress={() => setSidemenuVisible(false)}>Close</Button>
          </View>
        </ScrollView>

      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
  },
});

export default SideMenu;
