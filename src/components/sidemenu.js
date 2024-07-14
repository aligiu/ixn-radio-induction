import React, { useState, useEffect, useContext } from "react";
import { Linking } from "react-native";
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
import { useRouter } from "expo-router";
import {
  getToken,
  storeToken,
  removeToken,
  getEmail,
  storeEmail,
  storeIsAdmin,
  getIsAdmin,
  removeIsAdmin,
} from "../utils/auth";

export default function SideMenu() {
  const { sidemenuVisible, setSidemenuVisible } = useContext(SidemenuContext);

  const theme = useTheme();
  const backgroundColor = theme.colors.background;
  const textColor = theme.colors.inverseSurface;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

  const closeModal = () => {
    setSidemenuVisible(false);
  };

  useEffect(() => {
    async function handleLoginStatus() {
      const jwt = await getToken();
      const emailVal = await getEmail();
      const isAdminVal = await getIsAdmin();
      setIsLoggedIn(jwt !== null);
      setEmail(emailVal);
      setIsAdmin(isAdminVal);
    }
    handleLoginStatus();
  }, [sidemenuVisible]);
  console.log("isLoggedIn");

  console.log("isAdmin", isAdmin)

  return (
    <Portal>
      <Modal
        visible={sidemenuVisible}
        onDismiss={closeModal} // not used, closeModal is handled by the <View> with flex: 1
      >
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View
            // This <View> only occupies 80% of the screen width, leaving room for quick exit
            style={{
              flex: 0,
              justifyContent: "space-between",
              backgroundColor: backgroundColor,
              padding: 10,
              height: "100%",
              width: "80%",
            }}
          >
            <View>
              <View style={{ marginBottom: 20 }}>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon="close"
                    size={26}
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
                <TText
                  variant="headlineSmall"
                  style={{
                    marginTop: 12,
                    fontSize: fontSize.MEDIUM,
                    fontFamily: "InterRegular",
                    textAlign: "center",
                  }}
                >
                  Welcome, {email ? email : "Guest"} ({isAdmin ? "admin" : "normal user"})
                </TText>
              </View>
            </View>
            <View
              style={{
                gap: 10,
                alignItems: "center",
              }}
            >
              <SideMenuButton
                onPress={() => {
                  router.push("/adminControlPanel");
                  closeModal();
                }}
                text={"Admin Control Panel"}
              />
              {isLoggedIn && (
                <SideMenuButton
                  onPress={() => {
                    console.log("log out button pressed");
                    removeToken();
                    setIsLoggedIn(false);
                    removeIsAdmin(); 
                    closeModal();
                    router.push("/auth/login");
                  }}
                  text={"Log Out"}
                />
              )}

              {!isLoggedIn && (
                <SideMenuButton
                  onPress={() => {
                    router.push("/auth/login");
                    closeModal();
                  }}
                  text={"Log In"}
                />
              )}

              <SideMenuButton
                onPress={() => {
                  router.push("/help/userManual");
                  closeModal();
                }}
                text={"User Manual"}
              />
              <SideMenuButton
                onPress={() => Linking.openURL("mailto:support@example.com")}
                text={"Email Us"}
              />
            </View>
          </View>
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
}

function SideMenuButton({ onPress, text }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
      <Button
        mode="contained"
        style={{
          height: 50,
          borderRadius: 25,
          justifyContent: "center",
          borderColor: "green",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: fontSize.LARGE }}>
          {text}
        </Text>
      </Button>
    </TouchableOpacity>
  );
}

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
