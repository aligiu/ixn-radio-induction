import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme, Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { Image } from 'expo-image';

import { contentContainerStyles } from "src/styles/contentContainer";

export default function Another() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", text);
  };

  console.log(require("./nhs-logo.svg"))

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={contentContainerStyles.container}
    >
      <Link href="">Continue as Guest</Link>
      {/* <Image
        source={{ uri: "../../../assets/images/nhs-logo-hd.png" }}
        style={styles.nhsLogo}
      /> */}
      <Image 
      resizeMethod="resize"
      source={require("./nhs-logo.svg").default} 
      style={styles.nhsLogo} 
      />
      <Image 
      resizeMethod="resize"
      source={require("assets/images/nhs-logo-hd.png")} 
      style={styles.nhsLogo} 
      />
      <Image 
      resizeMethod="resize"
      source={require("../../../assets/images/nhs-logo-hd.png")} 
      style={styles.nhsLogo} 
      />

      <Image source={require("./clips.webp")} style={styles.nhsLogo} />
      <Image
        source={{
          uri: "https://images.freeimages.com/images/large-previews/d4f/www-1242368.jpg?fmt=webp&h=350",
        }}
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
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 16,
    borderColor: "grey",
    borderWidth: 1,
  },
});
