import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";
import { useRouter } from "expo-router";

import AutoScrollView from "../components/AutoScrollView";
import { useSQLiteContext } from "expo-sqlite";
import { getAllContentSorted } from "../db/queries";

import { setSchema } from "../db/setSchema";
import { setDummyData } from "../db/setDummyData";

import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    async function setContentDataAsync(db) {
      setContentData(await getAllContentSorted(db));
    }
    setContentDataAsync(db);
  }, []);



  

  return (
    <>
      <AutoScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
      >
        {/* Scroll view needed to dismiss search bar */}

        <TText style={styles.pageTitle}>Old Index [TEMP]</TText>

        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.push("/dummy")}>
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to dummy</TText>
            </Button>
          </TouchableOpacity>
         

          <TouchableOpacity onPress={() => router.push("/sqlTest")}>
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to sqlTest</TText>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/richtextAdvanced")}>
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to richtextAdvanced</TText>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/rlist")}>
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to rlist</TText>
            </Button>
          </TouchableOpacity>

        </View>
{/*         
        <View style={{ flexDirection: "column", gap: 10 }}>
          {contentData &&
            contentData.map((item, index) => (
              <NavBlock
                key={index}
                imageSource={require("assets/images/nhs-logo-square.png")}
                title={item.title}
                route={`/topics/${index}`}
                description={item.description}
                content={item.content}
              />
            ))}
        </View> */}


        <TouchableOpacity onPress={() => {
          setDummyData(db)
          }} style={{marginBottom: 20}}>
            <Button mode="elevated" style={{ marginTop: 15, backgroundColor: "red"}}>
              <TText>Init Schema and Dummy Data (Essential)</TText>
            </Button>
          </TouchableOpacity>

      </AutoScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  nhsSquare: {
    height: 60,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 15,
  },
});

function NavBlock({ title, description, imageSource, content }) {
  const navigation = useNavigation();

  const goToTopics = (content) => {
    navigation.navigate(`topics/[id]`, { content: content, title: title });
    // pass parameters to pages https://reactnavigation.org/docs/params/#what-should-be-in-params
  };

  return (
    <TouchableOpacity
      onPress={() => {
        goToTopics(content)
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Image
            resizeMethod="contain"
            source={imageSource}
            style={styles.nhsSquare}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TText
            style={{
              fontSize: fontSize.MEDIUM,
              fontFamily: "InterMedium",
            }}
          >
            {title}
          </TText>
          <TText
            style={{
              fontSize: fontSize.SMALL,
              fontFamily: "InterRegular",
            }}
            // numberOfLines="2"  // uncomment to abridge text
            // ellipsizeMode="tail"  // uncomment to abridge text
          >
            {description}
          </TText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
