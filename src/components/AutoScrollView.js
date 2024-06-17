import { ScrollView } from "react-native";
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  useColorScheme,
} from "react-native";

import {
    useTheme,
    Button,
    Portal,
    Modal,
    IconButton,
  } from "react-native-paper";

import { contentContainerStyles } from "src/styles/contentContainer";

import { fontSize } from "../styles/fontConfig";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";

// //  alternative
// const Picture = (props) => {
//     return (
//       <div>
//         <img src={props.src}/>
//         {props.children}
//       </div>
//     )
//   }

export default function AutoScrollView({
  children,
}) {
    
    const theme = useTheme();
    
    const searchbarInFocus = true;

    const setSearchbarInFocus = () => {};

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ flexGrow: 1 }}
      style={contentContainerStyles.container}
    >
      {/* 
        If search bar is not in focus, then display children normally
        Otherwise, display the search bar results
        */}
      {!searchbarInFocus && children}
      {searchbarInFocus && (
        <ScrollView
          style={{
            // height: screenHeight - 145,

            backgroundColor: theme.colors.background,
          }}
          keyboardShouldPersistTaps="always"
        >
          <View
            style={{
              flexDirection: "column",
              gap: 10, // gap must be placed in <View> not <ScrollView>
            }}
          >
            <SearchAutocompleteElement
              autocompleteText={"Radiopaedia"}
              topic={"Educational Resources"}
              section={"Login"}
              routerLink={"/dummy"}
              setSearchbarInFocus={setSearchbarInFocus}
            />

            <SearchAutocompleteElement
              autocompleteText={"Radiopaedia"}
              topic={"Conferences"}
              section={"Link"}
              routerLink={"/dummy"}
              setSearchbarInFocus={setSearchbarInFocus}
            />
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
}

// {searchbarInFocus && (
//     <ScrollView
//       style={{
//         height: screenHeight - 145,

//         backgroundColor: theme.colors.background,
//         paddingTop: 8,
//         paddingLeft: 16,
//         paddingRight: 16,
//       }}
//       keyboardShouldPersistTaps="always"
//     >
//       <View
//         style={{
//           flexDirection: "column",
//           gap: 10, // gap must be placed in <View> not <ScrollView>
//         }}
//       >
//         <SearchAutocompleteElement
//           autocompleteText={"Radiopaedia"}
//           topic={"Educational Resources"}
//           section={"Login"}
//           routerLink={"/dummy"}
//           setSearchbarInFocus={setSearchbarInFocus}
//         />

//         <SearchAutocompleteElement
//           autocompleteText={"Radiopaedia"}
//           topic={"Conferences"}
//           section={"Link"}
//           routerLink={"/dummy"}
//           setSearchbarInFocus={setSearchbarInFocus}
//         />
//       </View>
//     </ScrollView>
// )}
