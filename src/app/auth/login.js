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
      style={contentContainerStyles.container}
    >
      <View style={{ alignItems: "flex-end" }}>
        <Link href="">
          <Text
            style={{
              textDecorationLine: "underline",
              fontSize: fontSize.MEDIUM,
              fontFamily: "InterSemiBold",
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
          fontSize: fontSize.XLARGE,
        }}
      >
        Radiologist Induction Companion
      </Text>

      <View>
        <TextInput
          label="email"
          value={text}
          onChangeText={(text) => setText(text)}
          // style={styles.input}
        />
        <TextInput
          label="password"
          value={text}
          onChangeText={(text) => setText(text)}
          // style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          // style={styles.button}
        >
          Log In
        </Button>
      </View>
      <Text
        style={{
          fontSize: fontSize.MEDIUM,
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nhsLogoContainer: {
    alignItems: "center",
    padding: 20,
  },
  nhsLogo: {
    height: 80,
    aspectRatio: 370.61 / 150,
  },
});
