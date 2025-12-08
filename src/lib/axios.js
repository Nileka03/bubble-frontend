// client/src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  // This logic automatically switches between Localhost (for you) and Relative Path (for Vercel)
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true,
});