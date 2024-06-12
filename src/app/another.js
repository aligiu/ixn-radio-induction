import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme, Button, Searchbar, ProgressBar } from "react-native-paper";

export default function Another() {

  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <Text>Hi</Text>
      {/* <Searchbar
        theme={theme}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      /> */}
      {/* <ProgressBar progress={0.8} theme={theme} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
