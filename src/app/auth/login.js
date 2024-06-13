import * as React from "react";
import { useState } from "react";
import { View, Image, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme, Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";

export default function Another() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", text);
  };

  return (
    <ScrollView keyboardDismissMode="on-drag" style={styles.container}>
      <Link href="">Continue as Guest</Link>
      {/* <Image
        source={{ uri: "../../../assets/images/nhs-logo-hd.png" }}
        style={styles.nhsLogo}
      /> */}
      <Image
        source={require("./nhs-logo-hd.png")}
        style={styles.nhsLogo}
      />
      <View 
    //   style={styles.container}
      >
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
  container: {
    flex: 1,
    margin: 10,
    borderColor: "grey",
    borderWidth: 1,
  },
  nhsLogo: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 16,
    borderColor: "grey",
    borderWidth: 1,
  },
});
