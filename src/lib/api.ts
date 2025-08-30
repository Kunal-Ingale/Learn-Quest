import { getAuth } from "firebase/auth";


const API_BASE_URL = "https://learnquest-ng5h.onrender.com";

export const getAuthHeaders = async (token?: string) => {
  if (typeof window === "undefined") {
    // SSR: Token must be passed explicitly
    if (!token) {
      throw new Error("User not authenticated");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } else {
    // Client-side: Use Firebase Auth
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken(true);
    return {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    };
  }
};

export const apiCall = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    
    //This line is making a customizable API call using the Fetch API with added 
    // authentication headers and any other request options you pass.
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};


// ...options
// This spreads any extra options you pass to apiCall(), like:

// method: 'POST'

// body: JSON.stringify(data)

// headers: {} (will get overridden or merged below)


//headers: { ...headers, ...options.headers }
// This merges two sets of headers:

// 1. ...headers:
// These are the default headers returned from getAuthHeaders():

// {
//   Authorization: "Bearer <FirebaseToken>",
//   "Content-Type": "application/json"
// }
// -----------------------------------------------------------------
// The request is authenticated via Bearer token

// The request is configurable and reusable for any endpoint

// The headers are merged safely, so nothing important is lost