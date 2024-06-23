import * as React from "react";
import { useMemo } from "react";
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



// ### ### ### to replace
import { mockedData } from "./mockedData";
function getContentData() {
  return mockedData;
}
// ### ### ### end



export default function Home() {
  const router = useRouter();

  // const contentData = useMemo(() => getContentData(), []);
  const contentData = getContentData();

  return (
    <>
      <AutoScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
      >
        {/* Scroll view needed to dismiss search bar */}

        <TText style={styles.pageTitle}>Home</TText>

        <View style={{ gap: 10 }}>
          <NavBlock
            imageSource={require("assets/images/nhs-logo-square.png")}
            title="Ashford and St Peter's"
            description={"Parking, Induction, Study Leave, PCAS and Logins"}
            route="/hospitals/1"
          />

          <NavBlock
            imageSource={require("assets/images/nhs-logo-square.png")}
            title="Frimley"
            description={
              "Parking, Induction, Study Leave, PCAS and Logins, some more very long text, verbose description, more stuff, etc etc"
            }
            route="/hospitals/2"
          />
        </View>

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

          <TouchableOpacity
            onPress={() => {
              const route = "/hospitals/1";
              router.push(route);
            }}
          >
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to hospital 1</TText>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/basic")}>
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to RichtextBasic</TText>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/richtextAdvanced")}>
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to richtextAdvanced</TText>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const route = "/topics/0";
              router.push(route);
            }}
          >
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to topic 0</TText>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const route = "/topics/1";
              router.push(route);
            }}
          >
            <Button mode="elevated" style={{ marginTop: 15 }}>
              <TText>Go to topic 1</TText>
            </Button>
          </TouchableOpacity>
        </View>
          

        <View style={{ flexDirection: "column", gap: 10 }}>          
          {contentData && contentData.map((item, index) => (
            <NavBlock
              key={index}
              imageSource={require("assets/images/nhs-logo-square.png")}
              title={item.title}
              route={`/topics/${index}`}
              description={item.description}
            />
          ))}
        </View>

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

function NavBlock({ title, description, imageSource, route }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(route);
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
