import * as React from "react";
import { useState } from "react";
import { View, Image, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme, Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";

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
      <Link href="">Continue as Guest</Link>

      <Image 
      resizeMethod="resize"
      source={require("assets/images/nhs-logo-hd.png")} 
      style={styles.nhsLogo} 
      />

      <View>
        <TextInput
          label="email"
          value={text}
          onChangeText={(text) => setText(text)}
          style={styles.input}
        />
        <TextInput
          label="password"
          value={text}
          onChangeText={(text) => setText(text)}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Log In
        </Button>
      </View>
      <Text>
        New User? <Link href="auth/register">Register</Link>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nhsLogo: {
    width: 370.61,
    height: 150,
    alignSelf: "center",
    marginBottom: 16,
    borderColor: "grey",
    borderWidth: 1,
  },
});
