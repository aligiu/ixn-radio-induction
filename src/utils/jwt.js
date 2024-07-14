import * as SecureStore from "expo-secure-store";

export const storeToken = async (token) => {
  try {
    await SecureStore.setItemAsync("jwt", token);
    console.log("Token stored successfully");
  } catch (error) {
    console.error("Error storing the token", error);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("jwt");
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
    await SecureStore.deleteItemAsync("jwt");
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing the token", error);
  }
};

export const fetchWithJWT = async (url, options = {}) => {

  // fetch wrapper function which automatically includes the JWT in local secure store in fetch request
  const token = await SecureStore.getItemAsync('jwt');
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  if (options.body instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
