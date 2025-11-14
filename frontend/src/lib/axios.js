import axios from "axios";
import { getClerkToken } from "./clerkToken.js";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // This ensures cookies (including Clerk session cookies) are sent with requests
});

// Add request interceptor to include Clerk token in headers
axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = await getClerkToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.warn("Error getting token in interceptor:", error);
    }
    return config;
});

export default axiosInstance;
