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
import { Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { contentContainerStyles } from "src/styles/contentContainer";

import { fontSize } from "src/styles/fontConfig";
import { TText } from "../_layout";

export default function UserManual() {
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
        <View style={{ flex: 0 }}>
          <View style={styles.nhsLogoContainer}>
            <Image
              resizeMethod="contain"
              source={require("assets/images/nhs-logo-hd.png")}
              style={styles.nhsLogo}
            />
          </View>
          <TText
            variant="headlineSmall"
            style={[styles.pageTitle, { textAlign: "center" }]}
          >
            Radiologist Induction Companion{"\n"}User Manual
          </TText>
        </View>
        <View style={{ flex: 1 }}>
          <TText style={styles.sectionTitle}>Overview</TText>
          <TText style={styles.sectionSubTitle}>
            Main Purpose of the Application
          </TText>
          <TText style={styles.sectionContent}>
            The application serves as an "Induction Booklet" designed for easy
            access by all radiology trainees within the deanery. It provides
            organized information on various essential topics such as hospital
            sites, educational resources, timetables, and more. The application
            is structured with different sections, each accessible through
            intuitive tabs.
          </TText>
          <TText style={styles.sectionSubTitle}>
            Role-Based Access Control
          </TText>
          <TText style={styles.sectionContent}>
            The application features three types of users:
          </TText>
          <TText style={styles.sectionContent}>
            Guests: Can view text and files across all sections.
          </TText>
          <TText style={styles.sectionContent}>
            Registered Users: Have the same access as guests but can
            additionally view secret credentials.
          </TText>
          <TText style={styles.sectionContent}>
            Admins: Have full access, including the ability to edit any content
            within the application.
          </TText>
          <TText style={styles.sectionTitle}>Content Management</TText>
          <TText style={styles.sectionSubTitle}>Reading Content</TText>
          <TText style={styles.sectionContent}>
            Automatic Updates: When an internet connection is available, the
            application automatically updates its content upon launch, ensuring
            that users always have access to the most recent information without
            needing to perform any manual updates.
          </TText>
          <TText style={styles.sectionContent}>
            Offline Usage: If the user is offline, a notification will inform
            them that they are viewing offline content. The application will
            automatically update the content once the internet connection is
            reestablished.
          </TText>
          <TText style={styles.sectionSubTitle}>
            Writing Content (For Admins)
          </TText>
          <TText style={styles.sectionContent}>
            Content Editing: Admins have access to a built-in rich-text content
            editor and file uploader, allowing them to edit and distribute new
            content.
          </TText>
          <TText style={styles.sectionContent}>
            Automatic Synchronization: Any new content distributed by admins
            will be automatically synchronized across all users without
            requiring them to update the application manually.
          </TText>
          <TText style={styles.sectionTitle}>Navigation</TText>
          <TText style={styles.sectionSubTitle}>Content Organization</TText>
          <TText style={styles.sectionContent}>
            The application’s content is divided into individual sections, each
            represented by clickable elements on the home page.
          </TText>
          <TText style={styles.sectionSubTitle}>User interaction</TText>
          <TText style={styles.sectionContent}>
            Primary Navigation: Users can navigate through the content by
            clicking on these elements and using the back button located at the
            top left corner of the screen.
          </TText>
          <TText style={styles.sectionContent}>
            Search Bar: For quick access, users can utilize the search bar.
            Entering a search term will display relevant pages if a match is
            found, enabling efficient navigation to specific content.
          </TText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  nhsLogoContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
  nhsLogo: {
    height: 70,
    aspectRatio: 370.61 / 150,
  },
  sectionTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionSubTitle: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterSemiBold",
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: fontSize.MEDIUM,
    fontFamily: "InterRegular",
    paddingBottom: 8,
    textAlign: "left",
  },
});
