# Induction App for Radiologists  
IXN project for UCL MSc Computer Science [NHS x IBM]  
This is the frontend code. The backend code is in a [separate repository](https://github.com/nghugo/ixn-backend).

## Explanation  
With the frontend code, you can:  
- Run it directly on an emulator on your computer as a React Native app (for development purposes; setup required).  
- Build an APK file from the code to install and run the app on Android devices.  
- Build an IPA file from the code to install and run the app on iOS devices.  

## Configuration  
The app needs to know the backend URL, which is defined as the `SERVER_API_BASE` variable in `src/config/paths.js` within the frontend code. Since this value is embedded in the app, it must be updated in the code before building the app.  

## Developer Setup
1. Go to the [Node.js official website](https://nodejs.org/) and install Node.js 18.  
2. Install Simulator from Xcode for the iOS simulator and/or Android Studio for the Android emulator.  
3. Run `npm install`.  
4. Run `npx expo start`. This runs the application locally
5. To build the application, ie generate the APK for Android or IPA for iOS, follow the steps in [expo EAS build](https://docs.expo.dev/build/setup/).
