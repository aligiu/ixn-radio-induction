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
import { fetchWithJWT } from "../../utils/jwt";

export default function RegisterAdminOrUser() {
  const navigation = useNavigation();
  const { control, handleSubmit, focus, setValue } = useForm();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(" "); // set as 1 char space to prevent layout shift
  const [isAdminSwitchOn, setIsAdminSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsAdminSwitchOn(!isAdminSwitchOn);

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
        role: isAdminSwitchOn ? "ROLE_ADMIN" : "ROLE_USER",
      });
      console.log(payload);
      const route = "/auth/register-admin-or-user";
      // include JWT in fetch because the /auth/register-admin-or-user route is only accessible by admins
      const response = await fetchWithJWT(`${PROTOCOL}://${SERVER_API_BASE}${route}`, {
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
      } 
      if (response.status === 403) {
        // Handle conflicting request
        const result = await response.json();
        console.log("***", result);
        setErrorMessage("Admin privileges required");
      }
      
      else if (!response.ok) {
        console.log(response.body);
        setErrorMessage("Network failure");
      } else {
        // response is ok at this point
        const result = await response.json();
        console.log("Registration successful:", result);

        // token not set in registerAdminOrUser, unlike registerUser
        // because registerAdminOrUser is used to register other users rather than for own use

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
          height: "100%",
          flexGrow: 1,
        }}
      >
        <View style={{ justifyContent: "space-between" }}>
          <View>
            <TText
              variant="headlineSmall"
              style={{
                fontSize: fontSize.LARGE,
                fontFamily: "InterSemiBold",
              }}
            >
              Add a user
            </TText>
          </View>

          <View style={{ gap: 6, marginTop: 20, marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10",
              }}
            >
              <TText
                style={{
                  fontSize: fontSize.MEDIUM,
                  fontWeight: "400",
                }}
              >
                Add user as an admin
              </TText>
              <Switch value={isAdminSwitchOn} onValueChange={onToggleSwitch} />
            </View>

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
                Add user
              </Text>
            </Button>
          </TouchableOpacity>
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
