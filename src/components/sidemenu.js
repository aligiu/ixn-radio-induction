import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { TText } from "../app/_layout";
import {
  useTheme,
  Button,
  Portal,
  Modal,
  IconButton,
} from "react-native-paper";
import SidemenuContext from "../context/SidemenuContext";
import { fontSize } from "src/styles/fontConfig";

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
      <Modal
        visible={sidemenuVisible}
        onDismiss={closeModal} // not used, closeModal is handled by the <View> with flex: 1
      >
        <View style={{ flexDirection: "row", height: "100%" }}>
          <ScrollView
            // This scrollview only occupies 80% of the screen width
            style={{
              flex: 0,
              backgroundColor: backgroundColor,
              padding: 10,
              height: "100%",
              maxWidth: "80%",
            }}
          >
            <View style={{ borderWidth: 1, borderColor: "red" }}>
              <View style={{ marginBottom: 20 }}>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={closeModal}
                    style={styles.iconButtonContent}
                  />
                </View>

                <View style={styles.nhsLogoContainer}>
                  <Image
                    resizeMethod="contain"
                    source={require("assets/images/nhs-logo-hd.png")}
                    style={styles.nhsLogo}
                  />
                </View>
                <TText
                  variant="headlineSmall"
                  style={{
                    fontSize: fontSize.LARGE,
                    fontFamily: "InterSemiBold",
                    textAlign: "center",
                  }}
                >
                  Radiologist Induction Companion
                </TText>
              </View>
            </View>
            <View
              style={{
                gap: 10,
                borderWidth: 1,
                borderColor: "blue",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={styles.menuItem}>
                <TText>Menu Item 1111</TText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <TText>Menu Item 222</TText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <TText>Menu Item 333</TText>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={closeModal}>
            <View
              style={{
                // borderColor: "blue", borderWidth: 3,
                flex: 1,
              }}
            >
              {/* this view is responsible for clsoing the modal */}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  nhsLogoContainer: {
    alignItems: "center",
    paddingTop: 32,
    padding: 16,
  },
  nhsLogo: {
    height: 70,
    aspectRatio: 370.61 / 150,
  },
  iconContainer: {
    alignItems: "flex-start",
  },
  iconButtonContent: {
    padding: 0,
    margin: 0,
    borderWidth: 1,
  },
});

export default SideMenu;
