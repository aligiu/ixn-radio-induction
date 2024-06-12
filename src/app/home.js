import * as React from "react";
import { Text } from 'react-native'
import { Link } from "expo-router";
import { Button } from "react-native-paper";

// import { name as appName } from "./app.json";
// import App from "./src/App";

export default function Home() {
  return (
    <>
      <Text>This is the homepage</Text>
      <Link href="/another">
        Go to another page
      </Link>
    </>
  );
};

