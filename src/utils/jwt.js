import * as SecureStore from "expo-secure-store";

export const storeToken = async (token) => {
  try {
    await SecureStore.setItemAsync("jwtToken", token);
    console.log("Token stored successfully");
  } catch (error) {
    console.error("Error storing the token", error);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("jwtToken");
    if (token) {
      console.log("Token retrieved successfully");
      return token;
    } else {
      console.log("No token stored");
    }
  } catch (error) {
    console.error("Error retrieving the token", error);
  }
  return null;
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync("jwtToken");
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing the token", error);
  }
};
