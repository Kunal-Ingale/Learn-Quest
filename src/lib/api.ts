import { getAuth } from "firebase/auth";

const API_BASE_URL = "https://learnquest-ng5h.onrender.com";

export const getAuthHeaders = async () => {
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
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const headers = await getAuthHeaders();

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