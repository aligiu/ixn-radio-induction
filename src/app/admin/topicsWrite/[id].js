import * as React from "react";
import { useState } from "react";
import { View, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { RichText, useEditorBridge, Toolbar } from "@10play/tentap-editor";
import { useRoute } from "@react-navigation/native";

import FileModalWrite from "../../../components/FileModalWrite";
import SecretModal from "../../../components/SecretModal";
import { updateFieldById_ContentToEdit } from "../../../db/queries";
import { useNavigation } from "@react-navigation/native";
import { useKeyboardHeight } from "../../../hooks/keyboard/keyboardHeight";
import InputContext from "../../../context/InputContext";

export default function Topic() {
  const { inputInFocus, setInputInFocus } = React.useContext(InputContext);

  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();

  const route = useRoute();
  const { content, title, description, secret } = route.params;
  const [secretState, setSecretState] = useState(secret);

  const editor = useEditorBridge({
    editable: true,
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: content ? content : "",
    onChange: () => {
      async function updateContent() {
        const newContent = await editor.getHTML();
        updateFieldById_ContentToEdit(db, id, "content", newContent);
      }
      updateContent();
    },
  });

  const [secretModalVisible, setSecretModalVisible] = React.useState(false);
  const [fileModalVisible, setFileModalVisible] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(title);
  const [descriptionValue, setDescriptionValue] = React.useState(description);

  const keyboardHeight = useKeyboardHeight();

  return (
    <>
      <View
        keyboardDismissMode="on-drag"
        style={{ flex: 1, paddingTop: 8, paddingLeft: 16, paddingRight: 16 }}
      >
        {/* Scroll view needed to dismiss search bar */}
        <View style={{ flex: 1, gap: 10 }}>
          <TextInput
            onFocus={() => setInputInFocus(true)}
            label="Title"
            mode="outlined"
            numberOfLines={1}
            onChangeText={(titleValue) => {
              setTitleValue(titleValue);
              updateFieldById_ContentToEdit(db, id, "title", titleValue);
            }}
            value={titleValue}
          />
          <TextInput
            onFocus={() => setInputInFocus(true)}
            label="Description"
            mode="outlined"
            multiline={true}
            numberOfLines={2}
            value={descriptionValue}
            onChangeText={(descriptionValue) => {
              setDescriptionValue(descriptionValue);
              updateFieldById_ContentToEdit(
                db,
                id,
                "description",
                descriptionValue
              );
            }}
          />

          <View
            style={{
              // minHeight: 100,
              flex: 1,
              borderWidth: 1,
              borderColor: "grey",
              borderRadius: 4,
              paddingLeft: 5,
              paddingRight: 5,
              // borderColor: "red",
              marginBottom:
                Platform.OS === "ios" && keyboardHeight > 0 ? 40 : 0, // (*) corresponds to toolbar height
            }}
          >
            <RichText editor={editor} />
          </View>

          <View
            style={{
              position: "absolute",
              minHeight: 40, // (*)
              // bottom: 0,
              bottom: keyboardHeight,
              marginLeft: -16,
              marginRight: -16,
            }}
          >
            <Toolbar editor={editor} />
          </View>
          <View
            style={{
              minHeight: keyboardHeight,
              // backgroundColor: "yellow",
            }}
          >
            {/* spacer */}
          </View>

          {keyboardHeight === 0 && (
            <View
              style={{
                display: "flex",
                height: 50,
                flexDirection: "row",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setSecretModalVisible(true)}>
                  <Button mode="outlined">Secrets</Button>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setFileModalVisible(true)}>
                  <Button mode="outlined">Files</Button>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
      <View>
        <SecretModal
          visible={secretModalVisible}
          closeModal={() => {
            setSecretModalVisible(false);
          }}
          secret={secretState}
          setSecretState={setSecretState}
          editable={true}
          id={id}
        />
        <FileModalWrite
          visible={fileModalVisible}
          closeModal={() => {
            setFileModalVisible(false);
          }}
          id={id}
        />
      </View>
    </>
  );
}
