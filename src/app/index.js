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


// export default function Main() {
//   return (
//     <PaperProvider theme={theme}>
//       <App />
//     </PaperProvider>
//   );
// }

export default function Home() {
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
