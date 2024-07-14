import * as React from "react";
import { useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput, Switch, ToggleButton } from "react-native-paper";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { fontSize } from "src/styles/fontConfig";
import { contentContainerStyles } from "src/styles/contentContainer";
import { TText } from "../_layout";
import { SERVER_API_BASE, PROTOCOL } from "../../config/paths";
import { useNavigation } from "@react-navigation/native";

export default function Register() {
  const navigation = useNavigation();
  const { control, handleSubmit, focus, setValue } = useForm();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(" "); // set as 1 char space to prevent layout shift

  const onSubmit = async (data) => {
    console.log("Register form submitted");

    data.email = data.email.trim();

    if (!data.email || !data.password) {
      setErrorMessage("Please provide your email and password");
      return;
    }

    if (data.password != data.confirmPassword) {
      setErrorMessage("Passwords must match");
      return;
    }

    try {
      const payload = JSON.stringify({
        email: data.email,
        password: data.password,
      });
      console.log(payload);
      const route = "/auth/register-user";
      const response = await fetch(`${PROTOCOL}://${SERVER_API_BASE}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (response.status === 409) {
        // Handle conflicting request
        const result = await response.json();
        console.log("***", result);
        setErrorMessage(result.errorMessage);
      } else if (!response.ok) {
        setErrorMessage("Network failure");
      } else {
        const result = await response.json();
        console.log("Registration successful:", result);
        setErrorMessage(" "); // set as 1 char space to prevent layout shift

        // Navigate to the home screen upon successful registration
        navigation.navigate("index");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("An unknown error occurred");
    }
  };

  const handleEmailSubmit = () => {
    passwordRef.current?.focus();
  };

  const handlePasswordSubmit = () => {
    confirmPasswordRef.current?.focus();
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
        }}
      >
        <View style={{ justifyContent: "space-between", height: "60%" }}>
          <View>
            <View style={{ alignItems: "flex-end" }}>
              <Link href="">
                <TText
                  style={{
                    textDecorationLine: "underline",
                    fontSize: fontSize.MEDIUM,
                    fontWeight: "500",
                  }}
                >
                  Continue as Guest
                </TText>
              </Link>
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

          <View style={{ height: "50%", justifyContent: "flex-end", gap: 6 }}>
  
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  label="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    onChange(value);
                    // Handle onChange logic if needed
                  }}
                  onSubmitEditing={handleEmailSubmit}
                />
              )}
              name="email"
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  ref={passwordRef}
                  label="Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    onChange(value);
                    // Handle onChange logic if needed
                  }}
                  onSubmitEditing={handlePasswordSubmit}
                  secureTextEntry
                />
              )}
              name="password"
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  ref={confirmPasswordRef}
                  label="Confirm Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    onChange(value);
                    // Handle onChange logic if needed
                  }}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  secureTextEntry
                />
              )}
              name="confirmPassword"
              defaultValue=""
            />
            <View>
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  opacity: errorMessage.trim() == "" ? 0 : 1,
                  fontSize: 16,
                }}
              >
                {errorMessage}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{ gap: 10, marginBottom: 60, justifyContent: "space-between" }}
        >
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Button
              mode="contained"
              style={{ height: 50, borderRadius: 25, justifyContent: "center" }}
            >
              <Text style={{ fontWeight: "600", fontSize: fontSize.LARGE }}>
                Register
              </Text>
            </Button>
          </TouchableOpacity>

          <TText style={{ fontSize: fontSize.MEDIUM, textAlign: "center" }}>
            Registered?{" "}
            <Link href="auth/login">
              <TText style={{ textDecorationLine: "underline" }}>Log in</TText>
            </Link>
          </TText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nhsLogoContainer: {
    alignItems: "center",
    paddingTop: 32,
    padding: 16,
  },
  nhsLogo: {
    height: 70,
    aspectRatio: 370.61 / 150,
  },
});
