
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendMessage = async (message) => {
  try {
    const response = await API.post("/api/chat", {
      message,
    });

    return response.data;
  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
};

export default API;
