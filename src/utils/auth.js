import * as SecureStore from "expo-secure-store";

export const storeToken = async (token) => {
  try {
    await SecureStore.setItemAsync("jwt", token);
    console.log("Token stored successfully");
  } catch (error) {
    console.error("Error storing the token", error);
  }
};


export const storeEmail = async (email) => {
  try {
    await SecureStore.setItemAsync("email", email);
    console.log("Email stored successfully");
  } catch (error) {
    console.error("Error storing the email", error);
  }
};

export const storeIsAdmin = async (isAdmin) => {
  try {
    await SecureStore.setItemAsync("isAdmin", isAdmin);
    console.log("isAdmin stored successfully");
  } catch (error) {
    console.error("Error storing the isAdmin", error);
  }
};


export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("jwt");
    if (token) {
      // console.log("Token retrieved successfully");
      return token;
    } else {
      console.log("No token stored");
    }
  } catch (error) {
    console.error("Error retrieving the token", error);
  }
  return null;
};

export const getEmail = async () => {
  const jwt = await getToken()
  if (jwt === null) {
    return null
  }
  try {
    const email = await SecureStore.getItemAsync("email");
    if (email) {
      // console.log("Email retrieved successfully");
      return email;
    } else {
      console.log("No email stored");
    }
  } catch (error) {
    console.error("Error retrieving the email", error);
  }
  return null;
}

export const getIsAdmin = async () => {
  try {
    const isAdmin = await SecureStore.getItemAsync("isAdmin");
    if (isAdmin) {
      // console.log("isAdmin retrieved successfully");
      return isAdmin === "true";
    } else {
      console.log("No isAdmin stored");
    }
  } catch (error) {
    console.error("Error retrieving the isAdmin", error);
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

export const removeIsAdmin = async () => {
  try {
    await SecureStore.deleteItemAsync("isAdmin");
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

