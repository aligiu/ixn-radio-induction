// import {useState, useEffect} from 'react';
// import {Keyboard} from 'react-native';

// export default function useKeyboardGoingToHide() {
//   const [isKeyboardGoingToHide, setKeyboardGoingToHide] = useState(false);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       () => {
//         setKeyboardGoingToHide(false);
//       },
//     );
//     const keyboardWillHideListener = Keyboard.addListener(
//       'keyboardWillHide',
//       () => {
//         setKeyboardGoingToHide(true);
//       },
//     );

//     return () => {
//       keyboardWillHideListener.remove();
//       keyboardDidShowListener.remove();
//     };
//   }, []);

//   return isKeyboardGoingToHide;
// };