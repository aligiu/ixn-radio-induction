import * as React from "react";
import { useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { fontSize } from "src/styles/fontConfig";

import { contentContainerStyles } from "src/styles/contentContainer";

export default function Another() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", text);
  };

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ flexGrow: 1 }}
      style={contentContainerStyles.container}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          flexGrow: 1,
          borderColor: "red",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            borderColor: "green",
            borderWidth: 1,
            height: "60%",
          }}
        >
          <View>
            <View style={{ alignItems: "flex-end" }}>
              <Link href="">
                <Text
                  style={{
                    textDecorationLine: "underline",
                    fontSize: fontSize.MEDIUM,
                    fontWeight: "500",
                  }}
                >
                  Continue as Guest
                </Text>
              </Link>
            </View>
            <View style={styles.nhsLogoContainer}>
              <Image
                resizeMethod="contain"
                source={require("assets/images/nhs-logo-hd.png")}
                style={styles.nhsLogo}
              />
            </View>
            <Text
              variant="headlineSmall"
              style={{
                fontSize: fontSize.LARGE,
                fontFamily: "InterSemiBold",
                textAlign: "center",
              }}
            >
              Radiologist Induction Companion
            </Text>
          </View>

          <View
            style={{
              height: "50%",
              justifyContent: "flex-end",
              gap: 6,
              borderColor: "blue",
              borderWidth: 1,
            }}
          >
            <TextInput
              label="Email"
              // value={text}
              mode="outlined"
              onChangeText={(text) => setText(text)}
            />
            <TextInput
              label="Email"
              // value={text2}
              mode="outlined"
              onChangeText={(text) => setText(text)}
            />
            <TextInput
              label="Password"
              // value={text3}
              mode="outlined"
              onChangeText={(text) => setText(text)}
            />
          </View>
        </View>
        <View
          style={{
            borderColor: "grey",
            borderWidth: 1,
            // height: 100,
            gap: 10,
            marginBottom: 60,
            justifyContent: "space-between",
          }}
        >
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={{ height: 50, borderRadius: 25, justifyContent: "center" }}
          >
            <Text
            style={{
              fontWeight: "600",
              fontSize: fontSize.LARGE}}
            >Log In</Text>
          </Button>

          {/* <TouchableOpacity onPress={handleSubmit} style={styles.touchable}>
            <Button mode="contained" style={styles.button}>
              <Text style={styles.buttonText}>Log In</Text>
            </Button>
          </TouchableOpacity> */}
          
          <Text
            style={{
              fontSize: fontSize.MEDIUM,
              textAlign: "center",
            }}
          >
            New User?{" "}
            <Link href="auth/register">
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                Register
              </Text>
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nhsLogoContainer: {
    alignItems: "center",
    padding: 16,
  },
  nhsLogo: {
    height: 70,
    aspectRatio: 370.61 / 150,
  },
});
