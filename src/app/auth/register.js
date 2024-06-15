import * as React from "react";
import { useState, useRef } from "react";
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { fontSize } from "src/styles/fontConfig";
import { contentContainerStyles } from "src/styles/contentContainer";
import { TText } from "../_layout";

export default function Register() {
  const { control, handleSubmit, focus, setValue } = useForm();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const onSubmit = (data) => {
    console.log("Register form submitted:", data);
    // TODO: add handle form submission logic
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
      <View style={{ flexDirection: "column", justifyContent: "space-between", height: "100%", flexGrow: 1 }}>
        <View style={{ justifyContent: "space-between", height: "55%" }}>
          <View>
            <View style={{ alignItems: "flex-end" }}>
              <Link href="">
                <TText style={{ textDecorationLine: "underline", fontSize: fontSize.MEDIUM, fontWeight: "500" }}>
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
            <TText variant="headlineSmall" style={{ fontSize: fontSize.LARGE, fontFamily: "InterSemiBold", textAlign: "center" }}>
              Radiologist Induction Companion
            </TText>
          </View>

          <View style={{ height: "50%", justifyContent: "flex-end", gap: 6 }}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
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


          </View>
        </View>
        <View style={{ gap: 10, marginBottom: 60, justifyContent: "space-between" }}>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Button mode="contained" style={{ height: 50, borderRadius: 25, justifyContent: "center" }}>
              <Text style={{ fontWeight: "600", fontSize: fontSize.LARGE }}>Register</Text>
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
