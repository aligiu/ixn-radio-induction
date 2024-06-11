import { View, Text } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { Link } from "expo-router";
import { customLightColors } from "@theme/colors";
import { Button } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: customLightColors.colors,
};

const Home = () => {
  return (
    <PaperProvider theme={theme}>
      <View>
        <Text>Home, Hello!</Text>
        <Link href="/buttonPage">ButtonPage</Link>
        <Button icon="camera">Custom Style Button</Button>
      </View>
    </PaperProvider>
  );
};

export default Home;
